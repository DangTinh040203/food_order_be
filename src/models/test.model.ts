import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

export const Test = mongoose.model('Test', testSchema);
