const Bloger = require('../models/blogModel');
const Author = require('../models/authorModel');


// const Blogdata = async function (req, res) {
   
//     let blog = req.body.authorid
//     let BlogerrCreated = await Bloger .create(blog)
//     res.send({data: BlogerrCreated })
// }

// / --------------------------- fourth api to get blog by query without query get all blogs --------------------------------------------------------------------------//

const getBlogs = async function (req, res) {
    try {
      let blogs=await Bloger.find();
      if (blogs.length > 0) {
        res.status(200).send({ status: true, data: blogs });
      } else {
        res.status(404).send({ status: false, message: 'No blogs found of thia author' })
      }
  
    } catch (error) {
      res.status(400).send({ status: false, error: error.message });
    }
  }

 let PostBlogdata = async function (req, res){
    try {
             
            let blog = req.body
            let authorId = blog.authorid
            let BlogerrCreated = await Bloger .create(blog)
            res.send({data: BlogerrCreated })
    
        
        if (!authorId) { return res.status(400).send("authorid required") }
        let author = await authorModel.findById(authorId)
        if (!author) { return res.status(400).send("invalid authorId") }


        // let blogCreated = await blogModel.create(blog)
        // if (!blogCreated) return res.status(400).send('invalid request')
        // res.status(201).send({ data: blogCreated })
        // const createBlogs = async function (req, res) {
        //     try {
        //       const requestBody = req.body;
          
        //       if (!isValidRequestBody(requestBody)) {
        //         res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide blog details' })
        //         return
          

    }catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

const updateBlog = async function(req,res)
{
    try
    {
        let data = req.body;
        let blog = await Bloger.findOneAndUpdate({_id : req.params.blogId,isDeleted : false},{$set : data},{new : true});
        if(Object.keys(blog).length!=0)
        {
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
        let id = req.params.blogId;
        let blog = await Bloger.findOneAndUpdate({_id : id,isDeleted : false},{isDeleted : true});
        if(Object.keys(blog).length!=0)
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
        if(req.query.authorid!=undefined)
        {
            filter['authorId']=req.query.authorid;
        }
        if(req.query.tag!=undefined)
        {
            filter['tags']=req.query.tag;
        }
        if (req.query.subcategory!=undefined)
        {
            filter['subCategory']=req.query.subcategory;
        }
        if(req.query.unpublished!=undefined)
        {
            filter['isPublished']=false;
        }
        let blog = await Bloger.updateMany(filter,{$set : {isDeleted : true}});
        if(Object.keys(blog).length!=0)
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

module.exports={deleteBlogById,deleteBlog,updateBlog,getBlogs,PostBlogdata};