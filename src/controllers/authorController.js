const author = require("../models/authorModel");
const Validators = require('../validators/validator');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createAuthor = async function(req,res) 
{
    try
    {
        let requestBody=req.body;
        if (!Validators.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request body. Please provide author details.' })
            return
        }

        if (!Validators.isValid(requestBody.fname)) {
            res.status(400).send({ status: false, message: 'First name is required.' })
            return
        }

        if (!Validators.isValid(requestBody.lname)) {
            res.status(400).send({ status: false, message: 'Last name is required.' })
            return
        }

        if (!Validators.isValid(requestBody.title)) {
            res.status(400).send({ status: false, message: 'Title is required.' })
            return
        }

        if (!Validators.isValid(requestBody.email)) {
            res.status(400).send({ status: false, message: 'E-Mail is required.' })
            return
        }
        if (!Validators.isValid(requestBody.password)) {
            res.status(400).send({ status: false, message: 'Password is required.' })
            return
        }
        if (!(validator.isEmail(requestBody.email))) {
            res.status(400).send({ status: false, msg: 'Enter a valid email-id.' })
            return
        }
        let data = req.body
        let created = await author.create(data)
        res.status(201).send({status: true, data: created})
    }
    catch(err)
    {
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }    
};

const login = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!Validators.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request body. Please provide login details.' })
            return
        }
        if (requestBody.email && requestBody.password) {
            const check = await author.findOne({ email: requestBody.email, password: requestBody.password });
            if (check==null) {
                return res.status(400).send({ status: false, msg: "Invalid login credentials!" })
            }
            
            let payload = { _id: check._id };
            let token = jwt.sign(payload, 'projectOne');
            res.header('x-api-key', token);
            res.status(200).send({ status: true, msg: "Login Successfull!", token: token})
        } else {
            res.status(400).send({ status: false, msg: "Must contain email and password." })
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error.message })
    }
};

module.exports={createAuthor,login};