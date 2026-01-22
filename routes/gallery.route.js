const express = require('express');
const { createGallery, getAllGallery, deleteGallery } = require('../controllers/gallery.controller');
const { protect } = require('../middleware/protect.middleware');
const { authRole } = require('../middleware/authRole.middleware');
const multer=require('multer');
const { storage } = require('../config/cloudinary');

const upload=multer({storage})


const router=express.Router()



router.post('/create',protect,authRole(['Admin']),upload.single('image'), createGallery)
router.get('/',getAllGallery)
router.delete('/:id',protect,authRole(['Admin']),deleteGallery)


module.exports=router