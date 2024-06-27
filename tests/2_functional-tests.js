const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let issue1;
let issue2;

// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}

// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}

// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}

suite('Functional Tests', function () {
  suite('Routing tests', function () {
    suite('POST request tests', function () {
      test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Issue one',
            issue_text: 'Functional Test - Every field filled in',
            created_by: 'Kate',
            assigned_to: 'Liz',
            status_text: 'In QA',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            issue1 = res.body;
            assert.equal(res.body.issue_title, 'Issue one');
            assert.equal(
              res.body.issue_text,
              'Functional Test - Every field filled in'
            );
            assert.equal(res.body.created_by, 'Kate');
            assert.equal(res.body.assigned_to, 'Liz');
            assert.equal(res.body.status_text, 'In QA');
            done();
          });
      }).timeout(10000);

      test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .post('/api/issues/test')
          .set('content-type', 'application/json')
          .send({
            issue_title: 'Issue two',
            issue_text: 'Functional Test - Required fields',
            created_by: 'Kate',
            assigned_to: '',
            status_text: '',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            issue2 = res.body;
            assert.equal(issue2.issue_title, 'Issue two');
            assert.equal(
              issue2.issue_text,
              'Functional Test - Required fields'
            );
            assert.equal(issue2.created_by, 'Kate');
            assert.equal(issue2.assigned_to, '');
            assert.equal(issue2.status_text, '');
            done();
          });
      }).timeout(5000);

      test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .post('/api/issues/test')
          .set('content-type', 'application/json')
          .send({
            issue_title: '',
            issue_text: '',
            created_by: 'Kate',
            assigned_to: '',
            status_text: '',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
      });
    });

    suite('GET request tests', function () {
      test('View issues on a project: GET request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });

      test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .query({
            _id: issue1._id,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].issue_title, issue1.issue_title);
            assert.equal(res.body[0].issue_text, issue1.issue_text);
          });
        done();
      });

      test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .query({
            issue_title: issue1.issue_title,
            issue_text: issue1.issue_text,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].issue_title, issue1.issue_title);
            assert.equal(res.body[0].issue_text, issue1.issue_text);
            done();
          });
      });
    });

    suite('PUT requests', function () {
      test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: issue1._id,
            issue_title: 'changed',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, issue1._id);
            done();
          });
      });

      test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: issue1._id,
            issue_title: 'let us update this title',
            issue_text: 'let us update this text',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, issue1._id);
            done();
          });
      });

      test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            issue_title: 'updated this',
            issue_text: 'updated that',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id');
            done();
          });
      });

      test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: issue1._id,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
          });
      });

      test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
        chai
          .request(server)
          .put('/api/issues/test')
          .send({
            _id: '666dfb1b7a25cceaadf0d123',
            issue_title: 'update with invalid',
            issue_text: 'update with invalid',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not update');
            done();
          });
      });
    });
  });
});

// let id1 = '';
// let id2 = '';

// suite('Functional Tests', function () {
//   suite('POST /api/issues/{project} => object with issue data', function () {
//     test('Every field filled in', function (done) {
//       chai
//         .request(server)
//         .post('/api/issues/test')
//         .send({
//           issue_title: 'Title',
//           issue_text: 'text',
//           created_by: 'Functional Test - Every field filled in',
//           assigned_to: 'Chai and Mocha',
//           status_text: 'In QA',
//         })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.equal(res.body.issue_title, 'Title');
//           assert.equal(res.body.issue_text, 'text');
//           assert.equal(
//             res.body.created_by,
//             'Functional Test - Every field filled in'
//           );
//           assert.equal(res.body.assigned_to, 'Chai and Mocha');
//           assert.equal(res.body.status_text, 'In QA');
//           assert.equal(res.body.project, 'test');
//           id1 = res.body.id;
//           console.log('id 1 has been set as ' + id1);
//           done();
//         });
//     });

//     test('Required fields filled in', function (done) {
//       chai
//         .request(server)
//         .post('/api/issues/test')
//         .send({
//           issue_title: 'Title',
//           issue_text: 'text',
//           created_by: 'Functional Test - Required fields filled in',
//         })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.equal(res.body.issue_title, 'Title');
//           assert.equal(res.body.issue_text, 'text');
//           assert.equal(
//             res.body.created_by,
//             'Functional Test - Required fields filled in'
//           );
//           assert.equal(res.body.assigned_to, '');
//           assert.equal(res.body.status_text, '');
//           assert.equal(res.body.project, 'test');
//           id2 = res.body.id;
//           console.log('id 2 has been set as ' + id2);
//         });
//       done();
//     });

//     test('Missing required fields', function (done) {
//       chai
//         .request(server)
//         .post('/api/issues/test')
//         .send({
//           issue_title: 'Title',
//         })
//         .end(function (err, res) {
//           assert.equal(res.body, 'Required fields missing from request');
//           done();
//         });
//     });
//   });

//   suite('PUT /api/issues/{project} => text', function () {
//     test('No body', function (done) {
//       chai
//         .request(server)
//         .put('/api/issues/test')
//         .send({})
//         .end(function (err, res) {
//           assert.equal(res.body, 'No updated field sent');
//           done();
//         });
//     });

//     test('One field to update', function (done) {
//       chai
//         .request(server)
//         .put('/api/issues/test')
//         .send({
//           _id: id1,
//           issue_text: 'new text',
//         })
//         .end(function (err, res) {
//           assert.equal(res.body, 'successfully updated');
//           done();
//         });
//     });

//     test('Multiple fields to update', function (done) {
//       chai
//         .request(server)
//         .put('/api/issues/test')
//         .send({
//           _id: id2,
//           issue_title: 'new title',
//           issue_text: 'new text',
//         })
//         .end(function (err, res) {
//           assert.equal(res.body, 'sussessfully updated');
//           done();
//         });
//     });
//   });

//   suite('DELETE /api/issues/{project} => text', function () {
//     test('No _id', function (done) {
//       chai
//         .request(server)
//         .delete('/api/issues/test')
//         .send({})
//         .end(function (err, res) {
//           assert.equal(res.body, 'id error');
//           done();
//         });
//     });

//     test('Valid id', function (done) {
//       chai
//         .request(server)
//         .delete('/api/issues/test')
//         .send({
//           _id: id1,
//         })
//         .end(function (err, res) {
//           assert.equal(res.body, 'deleted ' + id1);
//         });
//       chai
//         .request(server)
//         .delete('/api/issues/test')
//         .send({
//           _id: id2,
//         })
//         .end(function (err, res) {
//           assert.equal(res.body, 'deleted ' + id2);
//           done();
//         });
//     });
//   });

//   suite('GET /api/issues/{project} => filter', function () {
//     test('One filter', function (done) {
//       chai
//         .request(server)
//         .get('/api/issues/test')
//         .query({ created_by: 'Functional Test - Every field filled in' })
//         .end(function (err, res) {
//           res.body.forEach((issueResult) => {
//             assert.equal(
//               issueResult.created_by,
//               'Functional Test - Every field filled in'
//             );
//           });
//           done();
//         });
//     });

//     test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {
//       chai
//         .request(server)
//         .get('/api/issues/test')
//         .query({
//           open: true,
//           created_by: 'Functional Test - Every field filled in',
//         })
// .end(function (err, res) {
//   res.body.forEach((issueResult) => {
//     assert.equal(issueResult.open, true);
//     assert.equal(
//       issueResult.created_by,
//       'Functional Test - Every field filled in'
//     );
//   });
//   done();
//         });
//     });
//   });
// });
