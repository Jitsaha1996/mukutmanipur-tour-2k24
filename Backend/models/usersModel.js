const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    rName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isConfirmSeatBooking: {
      type: Boolean,
      required: true,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: String,
      required: true,
      unique: false,
    },
    pic: {
      type: String,
      required: false,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isArchived: {
      type: Boolean,
      required: true,
      default: false,
    },
    isCashier: {
      type: Boolean,
      required: true,
      default: false,
    },
    familyMembers: [
      {
        name: {
          type: String,
          required: true,
        },
        seatPreference: {
          type: String,
          required: true,
        },
        seatNumber: {
          type: String,
          required: false,
          default:""
        },
      },
    ],
    familyWiseCost:{
      expectedCost:{
        type:String,
        required:false
      },
      paid:{
        type:String,
        required:false
      },
      due:{
        type:String,
        required:false
      },
    }
  },
  {
    timestamps: true,
  }
);

// Will encrypt password every time it's saved
userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
