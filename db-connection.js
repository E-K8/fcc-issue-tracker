const mongoose = require('mongoose');
const uri = process.env.PW;
const db = mongoose.connect(uri);

module.exports = db;
