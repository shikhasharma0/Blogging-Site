const Bloger = require('../models/blogModel');
const Author = require('../models/authorModel');
const Validators = require('../validators/validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const createBlogs = async function (req, res) 
{
    try 
    {
      const requestBody = req.body;
  
      if (!Validators.isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: 'Invalid request body. Please provide blog details' })
        return
      }
      if (!Validators.isValid(requestBody.title)) {
        res.status(400).send({ status: false, message: 'Blog Title is required' })
        return
      }
  
      if (!Validators.isValid(requestBody.body)) {
        res.status(400).send({ status: false, message: 'Blog body is required' })
        return
      }
  
      if (!Validators.isValid(requestBody.authorId)) {
        res.status(400).send({ status: false, message: 'Author id is required' })
        return
      }
  
      if (!Validators.isValid(requestBody.category)) {
        return res.status(400).send({ status: false, message: 'Blog category is required' })
      }
  
      let author = await Author.findOne({_id : requestBody.authorId});
      if (!author) {
        return res.status(400).send({ status: false, message: "Author_Id not found" });
      }

      if(requestBody.isPublished){
      requestBody.publishedAt = moment().format('DD-MM-YYYY');
      }
  
      let createdBlog = await Bloger.create(requestBody);
      res.status(201).send({ status: true, message: 'New blog created successfully', data: createdBlog });
    } 
    catch (error) 
    {
      res.status(500).send({ status: false, msg: error.message });
    }
};

const getBlogs = async function (req, res) 
{
    try 
    {
        let filter={};
        if(req.query.category!=undefined)
        {
            filter['category']=req.query.category;
        }
        if(req.query.authorId!=undefined)
        {
            filter['authorId']=req.query.authorId;
        }
        if(req.query.tags!=undefined)
        {
            let tags=JSON.parse(req.query.tags)
            filter['tags']=tags;
        }
        if (req.query.subCategory!=undefined)
        {
            let subCategory=JSON.parse(req.query.subCategory)
            filter['subCategory']=subCategory;
        }
        filter['isDeleted']=false;
        filter['isPublished']=true;
        let blogs=await Bloger.find(filter);
        if (blogs.length!=0) {
            for(let i=0;i<blogs.length;++i)
            {
                delete blogs[i].deletedAt;
            }
            res.status(200).send({ status: true, data: blogs });
        } 
        else {
            res.status(404).send({ status: false, message: 'No blogs found!' })
        }
    } 
    catch (error) 
    {
        res.status(400).send({ status: false, error: error.message });
    }
};

const updateBlog = async function(req,res)
{
    try
    {
        if(req.params.blogId==undefined)
        
            res.status(400).send({status : false,msg : "Bad request! Please provide BlogID."});
        
        let data = req.body;
        if (!Validators.isValidRequestBody(data)) {
            res.status(400).send({ status: false, message: 'Invalid request body. Please provide blog details to be updated.' })
            return
        }
        let blog = await Bloger.findOne({_id : req.params.blogId,isDeleted : false});
        if(!blog.isPublished)
        {
            data['isPublished']=true;
            data['publishedAt']=moment().format('DD-MM-YYYY');
        }
        let arrData={};
        if(data.tags!=undefined)
        {
            arrData = {tags : data.tags};
            delete data.tags;
        }
        if(data.subCategory!=undefined)
        {
            arrData = {tags : data.subCategory};
            delete data.subCategory;
        }
        console.log("updateblog128");
        blog = await Bloger.findOneAndUpdate({_id : req.params.blogId,isDeleted : false},{$set : data},{new : true});
        if(Object.keys(arrData).length!=0)
        {
            blog = await Bloger.findOneAndUpdate({_id : req.params.blogId,isDeleted : false},{$push : arrData},{new : true});
        }
        if(blog!=null)
        {
            delete blog.deletedAt;
            res.status(200).send({status : true,data : blog});
        }
        else
        {
            res.status(404).send({status : false,msg : "Blog doesn't exist!"});
        }
    }
    catch(err)
    {
        res.status(500).send({status : false,msg : err.message});

    }
};

const deleteBlogById = async function(req,res)
{
    try
    {
        if(req.params.blogId==undefined)
        
            res.status(400).send({status : false,msg : "Bad request! Please provide BlogID."});

        let blog = await Bloger.findOneAndUpdate({_id : req.params.blogId,isDeleted : false},{isDeleted : true,deletedAt : moment().format('DD-MM-YYYY')});
        if(blog!=null)
        {
            res.status(200).send({status : true,msg : "Blog deleted successfully!"});
        }
        else
        {
            res.status(404).send({status : false,msg : "Blog doesn't exist!"});
        }
    }
    catch(err)
    {
        res.status(500).send({status : false,msg : err.message});
    }
};

const deleteBlog = async function(req,res)
{
    try
    {
        let filter={};
        if(req.query.category!=undefined)
        {
            filter['category']=req.query.category;
        }
        if(req.query.authorId!=undefined)
        {
            let token=jwt.verify(req.headers['x-api-key'],'projectOne');
            if(token._id!=req.query.authorId)res.status(403).send({status : false,msg : 'Unauthorised Access!'});
            filter['authorId']=req.query.authorId;
        }
        if(req.query.authorId==undefined)
        {
            let token=jwt.verify(req.headers['x-api-key'],'projectOne');
            filter['authorId']=token._id;
        }
        if(req.query.tags!=undefined)
        {
            let tags=JSON.parse(req.query.tags)
            filter['tags']=tags;
        }
        if (req.query.subCategory!=undefined)
        {
            let subCategory=JSON.parse(req.query.subCategory)
            filter['subCategory']=subCategory;
        }
        if(req.query.unpublished!=undefined)
        {
            filter['isPublished']=false;
        }
        let blog = await Bloger.updateMany(filter,{$set : {isDeleted : true,deletedAt : moment().format('DD-MM-YYYY')}});
        if(blog.modifiedCount!=0)
        {
            res.status(200).send({status : true,msg : "Blog deleted successfully!"});
        }
        else
        {
            res.status(404).send({status : false,msg : "Blog doesn't exist!"});
        } 
    }
    catch(err)
    {
        res.status(500).send({status : false,msg : err.message});

    }
};

module.exports={deleteBlogById,deleteBlog,updateBlog,getBlogs,createBlogs};