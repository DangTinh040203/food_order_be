import mongoose from 'mongoose';

// test model
const testSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

export const Test = mongoose.model('Test', testSchema);
