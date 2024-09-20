const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const busSchema = mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
      unique: true,
    },
    seatDetails: {
      type: String,
      required: true,
    },
    seatStatus: {
        type: Boolean,
        required: true,
        default: true,
    },
   
  },
  {
    timestamps: true,
  }
);


const BusSeatModel = mongoose.model('BusSeatDetails', busSchema);
module.exports = BusSeatModel;
