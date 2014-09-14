#!/usr/bin/env node

process.env.PORT = 3002;
process.env.NODE_ENV = 'dev';
var app = require('./server');
