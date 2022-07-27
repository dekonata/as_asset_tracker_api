const express = require('express');
const passport = require('passport');

const { httpAuth } = require('./auth.controller')

const authRouter = express.Router();

authRouter.post('/local', 
	passport.authenticate('local'),
	httpAuth,
); 

module.exports = authRouter;