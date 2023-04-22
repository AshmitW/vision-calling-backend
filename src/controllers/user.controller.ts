import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  post,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {RtcRole, RtcTokenBuilder} from 'agora-token';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

const UserIdSchema: SchemaObject = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      minLength: 6,
    },
  },
};

export const UserIdRequestBody = {
  description: 'The input of getting user function',
  required: true,
  content: {
    'application/json': {schema: UserIdSchema},
  },
};

const AgoraTokenSchema: SchemaObject = {
  type: 'object',
  required: ['channelName ', 'uid '],
  properties: {
    channelName: {
      type: 'string',
    },
    uid: {
      type: 'string',
    },
  },
};

export const AgoraTokenRequestBody = {
  description: 'The input of Agora token generate function',
  required: true,
  content: {
    'application/json': {schema: AgoraTokenSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    // return currentUserProfile[securityId];
    return this.userRepository.findById(currentUserProfile[securityId]);
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }

  @authenticate('jwt')
  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async findById(
    @requestBody(UserIdRequestBody) user: {id: string},
  ): Promise<User> {
    return this.userRepository.findById(user.id);
  }

  @authenticate('jwt')
  @post('/agora/token', {
    responses: {
      '200': {
        description: 'Agora Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                agoraToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async generateAgoraRTCToken(
    @requestBody(AgoraTokenRequestBody)
    tokenInfo: {
      channelName: string;
      uid: string;
    },
  ): Promise<{agoraToken: string}> {
    const appId = 'd19b8e8972314505b397601f15cae1b5';
    const appCertificate = 'ba252f35ca2d4ba1a9ffe70dbe2e8c7e';
    const channelName = tokenInfo.channelName;
    const uid = tokenInfo.uid;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const agoraToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      expirationTimeInSeconds,
      privilegeExpiredTs,
    );
    return {agoraToken};
  }
}
