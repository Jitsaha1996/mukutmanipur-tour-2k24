const User = require('../models/usersModel');
const asynHandler = require('express-async-handler');
const jwtToken = require('../utils/generateTokes');

// app.use(express.bodyParser({limit: '50mb'}));
const registerUsers = asynHandler(async (req, res) => {
  const { rName, email, password, pic, dob, phone, isArchived, familyMembers } = req.body;
  const userExist = await User.findOne({ email })
  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }
  
  const myBuffer = Buffer.from(pic, 'base64');
  const user = await User.create({
    rName, email, password, pic, dob, phone, isArchived, familyMembers
  })
  
  if (user) {
    res.status(201).json({
      _id: user._id,
      rName: user.rName,
      pic: user.pic,
      email: user.email,
      isAdmin: user.isAdmin,
      isConfirmSeatBooking: user.isConfirmSeatBooking,
      phone: user.phone,
      dob: user.dob,
      familyMembers: user.familyMembers,
      isArchived: isArchived.isArchived,
      token: jwtToken(user._id)
    })
  } else {
    res.status(400);
    throw new Error("Error Occured");
  }

  res.json({
    rName, email
  })

})
const editUsers = asynHandler(async (req, res) => {
  const { rName, pic, dob, phone, email, isArchived, familyMembers } = req.body;
  const userExist = await User.findOne({ email })
  const filter = { email: userExist.email };
  console.log("Filter1", userExist);
  // if (userExist) {
  //   res.status(400);
  //   throw new Error("User Already Exist");
  // }
  const updateDocument = {
    $set: {
      rName: rName,
      pic: pic,
      dob: dob,
      phone: phone,
      isArchived: isArchived,
      familyMembers: familyMembers


    },
  };
  const user = await User.updateOne(filter, updateDocument);
  console.log("User", user);
  if (user) {
    res.status(200).json({
      message: `${email} updated sucessfully!!`,
      status: "sucess",
      statuscode: 200
    })
  } else {
    res.status(400);
    throw new Error("Error Occured");
  }


})

const authUsers = asynHandler(async (req, res) => {
  const { email, password } = req.body;//desturctaring


  const user = await User.findOne({ email });
  const res1 = await user.matchPassword(password);


  if (user && res1) {
    res.json({
      _id: user._id,
      rName: user.rName,
      email: user.email,
      isAdmin: user.isAdmin,
      isConfirmSeatBooking: user.isConfirmSeatBooking,
      familyMembers: user.familyMembers,
      isArchived: user.isArchived,
      pic: user.pic,

      token: jwtToken(user._id)

    });
  } else {
    res.status(401);
    throw new Error("Invalid Email and Password");
  }


})
const getUserList = asynHandler(async (req, res) => {

  const userList = await User.find();
  res.json(userList);
})

const getUserByEmail = asynHandler(async (req, res) => {
  const { email } = req.params;
  console.log("kk",email); // Get email from request parameters

  // Find the user by email
  const user = await User.findOne({ email });
  console.log(user);

  // Check if user exists
  if (!user) {
      res.status(404);
      throw new Error("User not found");
  }

  // Return the user data
  res.json({
      _id: user._id,
      rName: user.rName,
      email: user.email,
      isAdmin: user.isAdmin,
      isConfirmSeatBooking: user.isConfirmSeatBooking,
      familyMembers: user.familyMembers,
      isArchived: user.isArchived,
      pic: user.pic,
      dob: user.dob,
      phone: user.phone
  });
});
module.exports = { registerUsers, authUsers, getUserList, editUsers , getUserByEmail };