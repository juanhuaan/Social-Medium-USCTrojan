const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.get("/ifExistedUsername:username", async (req, res) => {
  const username = req.params.username

  try{
    const isExisted = await User.findOne({username: username});
    res.status(200).json(!!isExisted)
  } catch(err){
    console.log(err)
  }
})
router.get("/ifExistedEmail:email", async (req, res) => {
  const email = req.params.email

  try{
    const isExisted = await User.findOne({email: email});
    res.status(200).json(!!isExisted)
  } catch(err){
    console.log(err)
  }
})

//REGISTER
router.post('/register', async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    })

    //save user and respond
    const user = await newUser.save(err => {
      console.log(err)
    })
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})

//LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    !user && res.status(404).json('user not found')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json('wrong password')

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
