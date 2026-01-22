

const express = require('express');
const { createContact, getAllContact, deleteContact } = require('../controllers/contact.controller');
const {protect}=require('../middleware/protect.middleware')
const {authRole}=require('../middleware/authRole.middleware')
const router=express.Router()



router.post('/create',createContact)
router.get('/', protect,authRole(['Admin']),getAllContact)
router.delete('/:id',protect,authRole(['Admin']),deleteContact)


module.exports=router