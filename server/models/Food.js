const { Mongoose } = require("mongoose");

const mongoose = require('mongoose')

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
})

const Food = mongoose.model('Food', FoodSchema)
module.exports = Food