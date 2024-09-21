const mongoose = require("mongoose");

const annoucmentSchema = mongoose.Schema(
  {
    announcementId: {
      type: String,
      required: true,
      unique: true,
    },
    announcementDetails: {
      type: String,
      required: true,
    },
    announcementStatus: {
        type: Boolean,
        required: true,
        default: true,
    },
   
  },
  {
    timestamps: true,
  }
);


const AnnouncementModel = mongoose.model('AnnouncementModel', annoucmentSchema);
module.exports = AnnouncementModel;
