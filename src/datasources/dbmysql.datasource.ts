import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// Local DB info
// const config = {
//   name: 'dbmysql',
//   connector: 'mysql',
//   url: '',
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: '',
//   database: 'vision_calling',
// };

// Heroku Clear DB info
const config = {
  name: 'dbmysql',
  connector: 'mysql',
  url: '',
  host: 'eu-cdbr-west-03.cleardb.net',
  port: 3306,
  user: 'bc027ac1b473b7',
  password: '6b001ad1',
  database: 'heroku_44b098d87ba5d38',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbmysqlDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'dbmysql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.dbmysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
