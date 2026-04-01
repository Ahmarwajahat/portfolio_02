const serverless = require('serverless-http');
const app = require('../server');

// Create a serverless handler wrapper around our Express app
// The basePath prevents 404s when Netlify redirects from /api to /.netlify/functions/api
module.exports.handler = serverless(app, { basePath: '/.netlify/functions/api' });
