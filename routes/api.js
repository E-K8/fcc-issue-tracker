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

  const Issue = mongoose.model('Issue', issueSchema);

  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let project = req.params.project;
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json('Required fields missing from request');
      }

      let newIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project,
      });
      newIssue.save((error, savedIssue) => {
        if (!error && savedIssue) {
          return res.json(savedIssue);
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      let updateObject = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] != '') {
          updateObject[key] = req.body[key];
        }
      });
      if (Object.keys(updateObject).length < 2) {
        return res.json('No updated field sent');
      }
      updateObject['updated_on'] = new Date().toUTCString();
      Issue.findByIdAndUpdate(
        req.body._id,
        updateObject,
        { new: true },
        (error, updatedIssue) => {
          if (!error && updatedIssue) {
            return res.json('successfully updated');
          } else if (!updatedIssue) {
            return res.json('could not update ' + req.body._id);
          }
        }
      );
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
