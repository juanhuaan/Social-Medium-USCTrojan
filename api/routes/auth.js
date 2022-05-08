const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.post("/ifExistedUsername", async (req, res) => {
  const username = req.body.username

  try{
    const isExisted = await User.findOne({username: username});
    res.status(200).json(!!isExisted)
  } catch(err){
    console.log(err)
  }
})
router.post("/ifExistedEmail", async (req, res) => {
  const email = req.body.email
  console.log(email)

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
    if(!user){
      res.status(404).json('user not found')
      return;
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(validPassword){
      res.status(200).json(user)
    }else{
      res.status(400).json('wrong password')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
