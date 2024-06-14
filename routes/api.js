'use strict';

const expect = require('chai').expect;
const mongodb = require('mongodb');

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let filterObject = Object.assign(req.query);
      filterObject['project'] = project;

      Issue.find(filterObject, (error, arrayOfResults) => {
        if (!error && arrayOfResults) {
          return res.json(arrayOfResults);
        }
      });
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
      if (!req.body._id) {
        return res.json('id error');
      }
      Issue.findByIdAndDelete(req.body._id, (error, deletedIssue) => {
        if (!error && deletedIssue) {
          res.json('deleted ' + deletedIssue.id);
        } else if (!deletedIssue) {
          res.json('could not delete ' + req.body._id);
        }
      });
    });
};
