'use strict'

const User = require('../models/user.model')

exports.me = async (req, res, next) => {
  try {
    return res.json({ message: 'success', data: res.req.user })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const {email, name} = req.body
    if (email) await User.updateOne({_id: res.req.user._id}, {email: email}, { runValidators: true })
    if (name) await User.updateOne({_id: res.req.user._id}, {name: name}, { runValidators: true })
    return res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    await User.changePassword(req.body, res.req.user._id)
    return res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const {email, name} = req.body
    if (email) await User.updateOne({_id: res.req.user._id}, {email: email}, { runValidators: true })
    if (name) await User.updateOne({_id: res.req.user._id}, {name: name}, { runValidators: true })
    return res.json({ message: 'success' })
  } catch (error) {
    next(error)
  }
}

exports.getAll = async (req, res, next) => {
  try {
    const query = []
    const project = {
      _id: 1,
      name: 1,
      email: 1,
      createdAt: 1
    }
    query.push(
      { $sort: { _id: -1 } }
    )
    query.push({$match: {active: true}}, {$project: project})
    const combQuery = {$facet: {items: query}}
    const users = await User.aggregate([combQuery]).allowDiskUse(true)
    return res.json({ message: 'success', data: users })
  } catch (error) {
    next(error)
  }
}
