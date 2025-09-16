const express = require('express')
const multer = require('multer')
// const path = require('path');
// const fs = require('fs');
const router = express.Router()
const connectToDatabase = require('../models/db')
const logger = require('../logger')

// Define the upload directory path
const directoryPath = 'public/images'

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath) // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Use the original file name
  }
})

const upload = multer({ storage })

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
  logger.info('/ called')
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const secondChanceItems = await collection.find({}).toArray()
    res.json(secondChanceItems)
  } catch (e) {
    logger.console.error('oops something went wrong', e)
    next(e)
  }
})

// Add a new item
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    let secondChanceItem = req.body

    // Find the highest existing id and increment it
    const lastItem = await collection.find().sort({ id: -1 }).limit(1)

    await lastItem.forEach((item) => {
      secondChanceItem.id = (parseInt(item.id) + 1).toString()
    })

    // Add date_added field
    secondChanceItem.date_added = Math.floor(new Date().getTime() / 1000)

    secondChanceItem = await collection.insertOne(secondChanceItem)

    res.status(201).json(secondChanceItem)
  } catch (e) {
    next(e)
  }
})

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const secondChanceItem = await collection.findOne({ id: req.params.id })
    if (!secondChanceItem) {
      return res.status(404).send('secondChanceItem not found')
    }
    res.json(secondChanceItem)
  } catch (e) {
    next(e)
  }
})

// Update and existing item
router.put('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const secondChanceItem = await collection.findOne({ id: req.params.id })
    if (!secondChanceItem) {
      logger.error('secondChanceItem not found')
      return res.status(404).send('secondChanceItem not found')
    }
    secondChanceItem.category = req.body.category
    secondChanceItem.condition = req.body.condition
    secondChanceItem.age_days = req.body.age_days
    secondChanceItem.description = req.body.description
    secondChanceItem.age_years = Number(
      (secondChanceItem.age_days / 365).toFixed(1)
    )
    secondChanceItem.updated_at = new Date()

    const updatepreloveItem = await collection.findOneAndUpdate(
      { id: req.params.id },
      { $set: secondChanceItem },
      { returnDocument: 'after' }
    )
    if (updatepreloveItem) {
      res.json({ updated: 'success' })
    } else {
      res.status(500).send('Update failed')
    }
  } catch (e) {
    next(e)
  }
})

// Delete an existing item
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const secondChanceItem = await collection.findOne({ id: req.params.id })
    if (!secondChanceItem) {
      logger.error('secondChanceItem not found')
      return res.status(404).send('secondChanceItem not found')
    }
    await collection.deleteOne({ id: req.params.id })
    res.json({ deleted: 'success' })
  } catch (e) {
    next(e)
  }
})

module.exports = router
