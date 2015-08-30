'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
  symbol: String,
  lastUpdated: Date,
  history: Schema.Types.Mixed
});

module.exports = mongoose.model('Stock', StockSchema);
