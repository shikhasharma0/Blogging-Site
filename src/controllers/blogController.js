const Bloger = require('../models/blogModel');
const Author = require('../models/authorModel');


// const Blogdata = async function (req, res) {
   
//     let blog = req.body.authorid
//     let BlogerrCreated = await Bloger .create(blog)
//     res.send({data: BlogerrCreated })
// }




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
 

//module.exports.Blogdata = Blogdata
module.exports.PostBlogdata = PostBlogdata