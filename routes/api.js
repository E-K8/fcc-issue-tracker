'use strict';

const expect = require('chai').expect;
const mongodb = require('mongodb');

const IssueModel = require('../models').Issue;
const ProjectModel = require('../models').Project;

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(async function (req, res) {
      let projectName = req.params.project;

      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          return res.json([{ error: 'Project not found' }]);
        } else {
          const issues = await IssueModel.find({
            projectId: project._id,
            ...req.query,
          });
          if (!issues) {
            return res.json([{ error: 'No issues found' }]);
          }
          return res.json(issues);
        }
      } catch (error) {
        res.json({ error: 'Could not get', _id: _id });
      }
    })

    .post(async function (req, res) {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json('Required fields missing from request');
      }
      try {
        let projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: projectName });
          projectModel = await projectModel.save();
        }
        const issueModel = new IssueModel({
          projectId: projectModel._id,
          issue_title: issue_title || '',
          issue_text: issue_text || '',
          created_by: created_by || '',
          assigned_to: assigned_to || '',
          status_text: status_text || '',
          open: true,
          created_on: new Date(),
          updated_on: new Date(),
        });
        const issue = await issueModel.save();
        res.json(issue);
      } catch (error) {
        res
          .status(500)
          .json({ error: 'An error occurred while processing your request' });
      }
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
