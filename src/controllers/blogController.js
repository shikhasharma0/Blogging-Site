const Bloger = require('../models/blogModel');
const Author = require('../models/authorModel');
const Validators = require('../validators/validator')
const moment = require('moment');
const { all } = require('express/lib/application');

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
            filter['tags']=req.query.tags;
        }
        if (req.query.subcategory!=undefined)
        {
            filter['subCategory']=req.query.subcategory;
        }
        filter['isDeleted']=false;
        let blogs=await Bloger.find(filter);
        if (blogs.length > 0) {
            for(let i=0;i<blogs.length;++i)
            {
                delete blogs[i].deletedAt;
                if(blogs[i].isPublished==false)
                delete blogs[i].publishedAt;
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

const createBlogs = async function (req, res) 
{
    try 
    {
      const requestBody = req.body;
  
      if (!Validators.isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide blog details' })
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
  
    //   if (!(requestBody.authorId === requestBody.tokenId)) {
    //     return res.status(400).send({ status: false, msg: "unauthorized access" })
    //   }
  
      let author = await Author.findOne({_id : requestBody.authorId});
      if (!author) {
        return res.status(400).send({ status: false, message: "Author_Id not found" });
      }
  
      //requestBody.isPublished = requestBody.isPublished ? requestBody.isPublished : false;
      requestBody.publishedAt = requestBody.isPublished ? moment().format('DD-MM-YYYY') : null;
  
      let createdBlog = await Bloger.create(requestBody);
      res.status(201).send({ status: true, message: 'New blog created successfully', data: createdBlog });
    } 
    catch (error) 
    {
      res.status(500).send({ status: false, msg: error.message });
    }
};

const updateBlog = async function(req,res)
{
    try
    {
        let data = req.body;
        if(data.isPublished==undefined)
        {
            data['isPublished']=true;
        }
        data['publishedAt']=moment().format('DD-MM-YYYY');
        let blog = await Bloger.findOneAndUpdate({_id : req.params.blogId,isDeleted : false},{$set : data},{new : true});
        if(blog!=null)
        {
            delete blog.deletedAt;
            if(blog.isPublished==false)
            delete blog.publishedAt;
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
        
            res.status(400).send({status : false,msg : "Bad request!"});

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
            filter['authorId']=req.query.authorId;
        }
        if(req.query.tags!=undefined)
        {
            filter['tags']=req.query.tags;
        }
        if (req.query.subCategory!=undefined)
        {
            filter['subCategory']=req.query.subCategory;
        }
        if(req.query.unpublished!=undefined)
        {
            filter['isPublished']=false;
        }
        let blog = await Bloger.updateMany(filter,{$set : {isDeleted : true,deletedAt : moment().format('DD-MM-YYYY')}});
        console.log(blog);
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