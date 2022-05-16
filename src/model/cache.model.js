'use strict';

const ttl = require('mongoose-ttl');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { getEnv } = require('../utils');

const cacheSchema = new mongoose.Schema(
  {
    _id: Number,
    key: {
      type: String,
      required: true,
      unique: true
    },
    rate: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)
  .set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    }
  })
  .plugin(AutoIncrement, { id: 'cacheIdSeq' })
  .plugin(ttl, { ttl: getEnv('RESPONSE_TTL') });

module.exports = mongoose.model('Cache', cacheSchema);
