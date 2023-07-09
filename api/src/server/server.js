"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var app = express();
dotenv.config({ path: __dirname + './env' });
var PORT = process.env.PORT || 3000;
app.get('/', function (req, res) {
    console.log('Get');
});
app.listen(PORT, function () {
    console.log("listening on port ".concat(PORT));
});
