const jwt = require('jsonwebtoken');
const blogModel = require("../models/blogModel")

const authenticate =  function(req,res,next)
{
   try 
   {
      token = req.headers["x-api-key"]
      if (!token) return res.status(400).send({status: false, msg: "Token must be persent in code"});
      
      let decodedToken = jwt.verify(token,"projectOne");
      if (!decodedToken) return res.status(401).send({status: false, msg: "invailed token"});
      next()
   
    } 
    catch (err) {
        res.status(500).send({status : false,msg: err.message})
    }
};

const authorise = function(req,res,next)
{
    try
    {
        let blogId = req.params.blogid
        let authorId = await blogModel.findOne({_id : blogId},{authorId : 1});
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({status:false, msg: "Token must be persent in request header"});

        let decodedToken = jwt.verify(token, "projectOne")
        if (!decodedToken) return res.status(401).send({status: false, msg: "Invailed token"});
        else
        {
            if(authorId==decodedToken._id)
            next()
            else
            res.status(403).send({status : false,msg : "Unauthorised Access!"});
        }
    }
    catch(err)
    {
        res.status(500).send({status : false,msg : err.messsage});
    }
}

module.exports.authenticate = authenticate
module.exports.authorise = authorise