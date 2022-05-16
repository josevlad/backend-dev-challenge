'use strict';

const mongoose = require('mongoose');
const Paginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const fxRate = new mongoose.Schema({
  _id: Number,
  pair: {
    type: String,
    required: true,
    uppercase: true,
    unique: true
  },
  feePercentage: {
    type: Number,
    required: true
  }
})
  .set('toJSON', {
    virtuals: false,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    }
  })
  .plugin(AutoIncrement, { id: 'fxRateIdSeq' });

const exchangerSchema = new mongoose.Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: true,
      uppercase: true
    },
    nickname: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true,
      uppercase: true
    },
    description: {
      type: String,
      required: true,
      uppercase: true
    },
    foreignExchangeRate: [fxRate]
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
  .plugin(AutoIncrement, { id: 'exchangerIdSeq' })
  .plugin(Paginate);

module.exports = mongoose.model('Exchanger', exchangerSchema);
