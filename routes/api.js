'use strict';

const expect = require('chai').expect;
const mongodb = require('mongodb');
const mongoose = require('mongoose');

const uri =
  'mongodb+srv://user_2023:' +
  process.env.PW +
  '@e-k8.30bqhdu.mongodb.net/issue_tracker?retryWrites=true&w=majority&appName=E-K8';

module.exports = function (app) {
  mongoose.connect(uri);

  const issueSchema = new mongoose.Schema({
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

  const URLModel = mongoose.model('Issue', issueSchema);

  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let project = req.params.project;
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
