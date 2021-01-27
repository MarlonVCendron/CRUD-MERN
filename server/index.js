require('dotenv-safe').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()

const UserModel = require('./models/User')
const FoodModel = require('./models/Food')

const saltRounds = 10

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
  key: 'userId',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires: 86400
  }
}))


mongoose.connect('mongodb+srv://newuser:newuser@crud.r7hnw.mongodb.net/food?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);



function verifyJWT(req, res, next) {
  const token = req.headers['token']
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' })

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' })

    req.userId = decoded.id
    next()
  });
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || typeof username !== 'string') return res.json({ status: 'error', error: 'Username can\'t be empty' })
  if (!password || typeof password !== 'string') return res.json({ status: 'error', error: 'Password can\'t be empty' })

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) console.error(err)

    try {
      const user = new UserModel({ username, hash })
      user.save(err => {
        if (err) {
          if (err.code === 11000) return res.json({ status: 'error', error: 'Username already taken' })
          else throw err
        }
        else res.json({ status: 'ok' })
      })
    } catch (error) {
      res.send(error)
    }
  })
})

// app.get('/login', async (req, res) => {
//   if(req.session.user){
//     res.send({loggedIn: true, user: req.session.user.username})
//   }else{
//     res.send({loggedIn: false})
//   }
// })


app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await UserModel.findOne({ username })

  if (!user) return res.json({ status: 'error', error: 'Invalid username/password' })

  if (await bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({
      id: user._id,
      username: user.username,
    }, process.env.SECRET, { expiresIn: 86400 })

    req.session.user = user
    return res.json({ status: 'ok', token: token })
  }

  return res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/change-password', verifyJWT, async (req, res) => {
  const { token, password } = req.body
  try {
    const user = jwt.verify(token, process.env.SECRET)
    const _id = user.id

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) console.error(err)

      await UserModel.updateOne({ _id }, {
        $set: { hash }
      })
    })
    return res.json({ status: 'ok' })
  } catch (error) {
    return res.json({ status: 'error', error })
  }
})

app.post('/insert', verifyJWT, async (req, res) => {
  const { name, calories } = req.body
  const food = new FoodModel({ name, calories })

  try {
    await food.save()
  } catch (error) {
    console.error(error)
  }

  res.send(food._id)
})

app.put('/update', verifyJWT, async (req, res) => {
  const { _id, newName } = req.body

  try {
    await FoodModel.findById(_id, (err, updatedFood) => {
      updatedFood.name = newName
      updatedFood.save()
      res.send('Updated')
    })
  } catch (error) {
    console.error(error)
  }
})

app.get('/read', verifyJWT, async (req, res) => {
  FoodModel.find({}, (err, result) => {
    if (err) res.send(err)
    res.send(result)
  })
})

app.delete('/delete/:id', verifyJWT, async (req, res) => {
  const id = req.params.id

  try {
    await FoodModel.findByIdAndRemove(id).exec()
    res.send('Deleted')
  } catch (error) {
    console.error(error)
  }
})

app.listen(3001, () => {
  console.log('Server running')
})