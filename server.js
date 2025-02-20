const dotenv = require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});