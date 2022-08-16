const express = require('express');

const authRouter = require('./auth/auth.router');
const assetsRouter = require('./assets/assets.router');
const accessoriesRouter = require('./accessories/accessories.router');
const cabinetsRouter = require('./cabinets/cabinets.router');
const shelvesRouter = require('./shelves/shelves.router');
const staffRouter = require('./staff/staff.router');
const transfersRouter = require('./transfers/transfers.router');
const locationsRouter = require('./locations/locations.router');
const reportsRouter = require('./reports/reports.router');


const api = express.Router();

api.use('/assets/', assetsRouter);
api.use('/accessories', accessoriesRouter);
api.use('/cabinets/', cabinetsRouter);
api.use('/shelves/', shelvesRouter);
api.use('/staff/', staffRouter);
api.use('/transfers', transfersRouter);
api.use('/locations', locationsRouter);
api.use('/reports', reportsRouter);


module.exports = api;