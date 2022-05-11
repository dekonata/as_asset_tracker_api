const express = require('express');

const assetsRouter = require('./assets/assets.router');
const cabinetsRouter = require('./cabinets/cabinets.router');
const shelvesRouter = require('./shelves/shelves.router');
const staffRouter = require('./staff/staff.router');
const transfersRouter = require('./transfers/transfers.router');
const locationsRouter = require('./locations/locations.router');
const reportsRouter = require('./reports/reports.router');

const api = express.Router();

api.use('/assets/', assetsRouter);
api.use('/cabinets/', cabinetsRouter);
api.use('/shelves/', shelvesRouter);
api.use('/staff/', staffRouter);
api.use('/transfers', transfersRouter);
api.use('/locations', locationsRouter);
api.use('/reports', reportsRouter);

module.exports = api;