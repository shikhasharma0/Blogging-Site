const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://Project-1-Group:CaBrSNjCFD2YQuqc@cluster0.w5bka.mongodb.net/Project-1-Group-DB", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use("/", route)

app.listen(process.env.PORT || 5000, (err)=> {
    console.log("Connected to PORT 5000")
})

