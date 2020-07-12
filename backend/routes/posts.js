const express = require('express')
const router = express.Router()
const postController = require('../controllers/posts')
const auth = require('../middleware/auth')
const fileExtract = require('../middleware/file')

router.post('', auth, fileExtract, postController.createPost)

router.get('', postController.getPosts)

router.put('/:id', auth, fileExtract, postController.updatePost)

router.get('/:id', postController.getPost)

router.delete('/:id', auth, postController.deletePost)

module.exports = router
