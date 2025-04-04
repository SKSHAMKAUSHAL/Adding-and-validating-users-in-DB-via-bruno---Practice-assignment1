const express = require('express');
const { resolve } = require('path');
const connectToDb = require('./db')
const bcrypt = require('bcrypt')
require('dotenv').config();
const app = express();
const User = require('./schema')


const port = process.env.PORT || 9000;
const DB_url = process.env.DB_URL;

app.use(express.json())
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

  app.get('/users', async (req, res) => {
    try {
      const users = await User.find(); // Exclude passwords for security
      res.status(200).json({user: users});
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


app.post('/pass', async(req, res) => {
  try{
    const {username, mail, password} = req.body;

    if (!username || !mail || !password){
      return res.status(500).json({message: `Bad request! All field required`});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const newuser = new User({
      username, mail, password: hashedpass,
    })

    await newuser.save();

    res.status(201).json({message: `User created successufully`, user: newuser})
    
  }catch(err){
    return res.status(400).json({message: `Internal server error`})
  }
})




app.listen(port, async() => {
  try{
    await connectToDb(DB_url);
    console.log(`Connected to DataBase`);

    console.log(`Example app listening at http://localhost:${port}`);
    
  }catch(err){
    // res.status(500).json({message: `Internal server error`, error: err})
    console.log(err);
  }

});