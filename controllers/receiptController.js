const Receipt = require('../models/Receipt.js')
const Like = require('../models/Like.js')
const Cookies = require('js-cookie')

class receiptController {
  // Displaying a list of all recipes
  async index(req, res) {
    try {
      const receipts = await Receipt.find();
      res.render('receipt/index', { receipts }); 
    } catch (error) {
      console.error('Error fetching the list of recipes:', error);
      res.status(500).send('Something went wrong. Please try again.');
    }
  }

  async showForm(req, res) {
    res.render('receipt/add')
  }

  // Creating a new recipe
  async create(req, res) {
    const { name, description, receipt } = req.body;
    
    try {
      const newReceipt = new Receipt({ name, description, receipt });
      await newReceipt.save();
      res.status(201).send('Recipe successfully created!');
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).send('Something went wrong. Please try again.');
    }
  }

  // Retrieving a specific recipe by ID
  async show(req, res) {
    const { id } = req.params;

    try {
      const receipt = await Receipt.findById(id);
      if (!receipt) {
        return res.status(404).send('Recipe not found.');
      }
      res.render('receipt/read', { receipt }); 
    } catch (error) {
      console.error('Error fetching the recipe:', error);
      res.status(500).send('Something went wrong. Please try again.');
    }
  }

  async editForm(req, res) {
    const {id} = req.params
    const receiptData = Receipt.findById(id)
    if (!receiptData) {
        return res.status(404).send('Recipe not found.');
      }
    res.render('receipt/update', {receipt: receiptData})
  }

  // Updating a recipe
  async update(req, res) {
    const { id } = req.params;
    const { name, description, author, receipt } = req.body;

    try {
      const updatedReceipt = await Receipt.findByIdAndUpdate(id, { name, description, author, receipt }, { new: true });
      if (!updatedReceipt) {
        return res.status(404).send('Recipe not found.');
      }
      res.status(200).send('Recipe successfully updated!');
    } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).send('Something went wrong. Please try again.');
    }
  }

  // Deleting a recipe
  async delete(req, res) {
    const { id } = req.params;

    try {
      const deletedReceipt = await Receipt.findByIdAndDelete(id);
      if (!deletedReceipt) {
        return res.status(404).send('Recipe not found.');
      }
      res.status(200).send('Recipe successfully deleted!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).send('Something went wrong. Please try again.');
    }
  }

  async like(req, res) {
     try {
    // Checking if the like from the current user for this recipe already exists
    const existingLike = await Like.findOne({ userId: req.userId, receiptId: req.body.receiptId });

    if (existingLike) {
      // If the like already exists, return an error
      return res.status(400).json({ message: 'Like already added' });
    }

    // Creating a new like
    const like = new Like({
      userId: Cookies.get('id'),
      receiptId: req.body.receiptId
    });

    // Saving the like in the database
    await like.save();

    res.status(201).json({ message: 'Like added successfully' });
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
  }
}

module.exports = new receiptController()