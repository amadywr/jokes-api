const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const Users = require('../../model/Users')

router.post('/createUser', async (req, res) => {
  const date = new Date()
  const user = {
    name: req.body.name,
    email: req.body.email,
    apikey: uuidv4(),
    createdAt: date,
  }

  if (!user.name || !user.email) {
    return res.status(400).json({ msg: 'please enter name and email' })
  }

  const foundUser = await Users.findOne({ email: user.email })

  if (foundUser) {
    return res.status(400).json({
      msg: `${foundUser.email} is already registered`,
    })
  } else {
    Users.create(user)
    res.status(201).json({ msg: 'user successfully created', user })
  }
})

router.get('/getUser', async (req, res) => {
  const apikey = req.headers.apikey

  const user = await Users.findOne({ apikey: apikey })

  if (!user) {
    return res.status(404).json({ msg: 'user not found' })
  }

  res.status(200).json(user)
})

router.get('/forgotApikey', async (req, res) => {
  const { name, email } = req.query

  if (!name || !email) {
    return res.status(400).json({
      msg: 'please enter both name and email to retrieve your details',
    })
  }

  const user = await Users.findOne({ name, email })

  if (!user) {
    return res.status(404).json({ msg: 'user not found' })
  }

  res.status(200).json(user)
})

router.put('/updateDetails', async (req, res) => {
  const apikey = req.headers.apikey
  const { name, email } = req.body

  const foundUser = await Users.findOne({ apikey })

  if (!foundUser) {
    return res.status(400).json('user not found')
  }

  if (name !== undefined) {
    foundUser.name = name
  }

  if (email !== undefined) {
    foundUser.email = email
  }

  foundUser.save()
  return res.status(202).json({ msg: 'user details updated', foundUser })
})

router.delete('/deleteUser', async (req, res) => {
  const apikey = req.headers.apikey
  const { name, email } = req.body

  const foundUser = await Users.findOne({ name, email, apikey })

  if (!foundUser) {
    return res.status(400).json({ msg: 'user not found' })
  }

  await Users.findOneAndDelete({ name, email, apikey })

  res.json({ msg: 'user deleted' })
})

module.exports = router
