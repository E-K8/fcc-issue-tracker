'use strict';
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
        return res.json({ error: 'required field(s) missing' });
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
        res.status(500).json({
          error: 'An error occurred while processing your request',
          _id: _id,
        });
      }
    })

    .put(async function (req, res) {
      let projectName = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }

      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          throw new Error('Project not found');
        }

        let updatedIssue = await IssueModel.findByIdAndUpdate(
          _id,
          {
            ...req.body,
            updated_on: new Date(),
          },
          { new: true }
        );

        if (!updatedIssue) {
          return res.json({ error: 'could not update', _id: _id });
        }

        res.json({ result: 'successfully updated', _id: _id });
      } catch (error) {
        res.status(500).json({ error: error.message, _id: _id });
      }
    })

    .delete(async function (req, res) {
      let projectName = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          throw new Error('project not found');
        }
        const result = await IssueModel.deleteOne({
          _id: _id,
          projectId: projectModel._id,
        });
        if (result.deletedCount === 0) {
          throw new Error('ID not found');
        }
        res.json({ result: 'successfully deleted', _id: _id });
      } catch (error) {
        res.json({ error: 'could not delete', _id: _id });
      }
    });
};
