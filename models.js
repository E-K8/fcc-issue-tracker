const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: String,
  status_text: String,
  open: { type: Boolean, required: true },
  created_on: { type: Date, required: true },
  updated_on: { type: Date, required: true },
  project: String,
});

const Issue = mongoose.model('Issue', issueSchema);

const projectSchema = new Schema({});
