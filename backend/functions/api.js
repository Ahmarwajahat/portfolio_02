const serverless = require('serverless-http');
const app = require('../server');

// Create a serverless handler wrapper around our Express app
module.exports.handler = serverless(app);
