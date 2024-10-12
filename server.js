const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

mongoose.connect('mongodb://localhost:27017/personal-budget')
  .then(() => console.log('MongoDB is connected'))
  .catch(err => console.error(err));

app.use(express.json());
app.use('/', express.static('public'));

const budgetSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    budget: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true,
      match: /^#[0-9A-F]{6}$/i
    }
  });

  const Budget = mongoose.model('Budget', budgetSchema);

  app.get('/api/budget', async (req, res) => {
    try {
        const budgets = await Budget.find(); 
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});


  app.post('/api/budget', async (req, res) => {
    const { title, budget, color } = req.body;
    if (!title || !budget || !color) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
      const newBudget = new Budget({ title, budget, color });
      await newBudget.save();
      res.status(201).json(newBudget);
    } catch (err) {
      res.status(500).json({ message: 'Error saving data' });
    }
  });


/*app.get('/hello', (req, res) => {
    res.send('Hello World!');
});*/

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
