const Post = require('../models/post')

const createPost = async (req, res, next)=>{
  const url = req.protocol + '://' + req.get('host');
  try {
    const postObj = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
    })
   const result = await postObj.save()

    const post = {
      ...result,
      id: result._id
    }

		res.status(201).json({
      message:"Post Added Successfully!",
      post
    })

	} catch(e) {
    res.status(500).json({
      message:"Creating a post failed!"
    })
	}
}

const updatePost = async (req, res, next)=>{

  try {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    })

    const result = await Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    if(result.n > 0) {
      res.status(200).json({
        message:"Post Updated Successfully!"
      })
    } else {
      res.status(401).json({message:'Not Authorized!'})
    }
  } catch(e) {
    res.status(500).json({
      message:"Updating post failed!"
    })
  }
}

const getPosts = async (req, res, next)=>{
  try {
    const pageSize = +req.query.pageSize
    const currentPage = +req.query.page
    const postQuery = Post.find()
    if(pageSize && currentPage) {
      postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
    }
    const fetchedPosts = await postQuery;
    if(fetchedPosts) {
      const count = await Post.countDocuments()
      res.status(200).json({message:'Posts fetched successfully!', posts: fetchedPosts, maxPosts: count})
    }

  } catch(e) {
    res.status(500).json({
      message:"Fetching posts failed!"
    })
  }
}

const getPost = async(req, res, next)=>{
  try {
    const post = await Post.findById({_id: req.params.id})
    if(!post) {
      return res.status(404).json({message:'Posts not found!'})
    }
    res.status(200).json(post)
  } catch(e) {
    res.status(500).json({
      message:"Fetching a post failed!"
    })
  }
}

const deletePost = async(req, res, next)=>{
  try {
    const result = await Post.deleteOne({_id:req.params.id, creator: req.userData.userId})
    if(result.n > 0) {
      res.status(200).json({message:'Posts deleted successfully!'})
    } else {
      res.status(401).json({message:'Not Authorized!'})
    }
  } catch(e) {
    res.status(500).json({
      message:"Deleting a post failed!"
    })
  }
}

module.exports = {
  createPost,
  updatePost,
  getPosts,
  getPost,
  deletePost
}
