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
  const { rName, pic, dob, phone, email, isArchived, familyMembers,isConfirmSeatBooking } = req.body;
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
      familyMembers: familyMembers,
      isConfirmSeatBooking:isConfirmSeatBooking


    },
  };
  const user = await User.updateOne(filter, updateDocument);
  console.log("User", user);
  if (user) {
    res.status(200).json({
      message: `${email} updated sucessfully!!`,
      status: "sucess",
      email:email,
      statuscode: 200
    })
  } else {
    res.status(400);
    throw new Error("Error Occured");
  }


})

const forgetpasswords = asynHandler(async (req, res) => {
  const { phone, newPassword } = req.body;

  // Find the user by phone number
  const userExist = await User.findOne({ phone });
  
  if (!userExist) {
    res.status(404);
    throw new Error("User not found");
  }

  // Directly update the password without hashing
  userExist.password = newPassword; // Set new password directly
  await userExist.save(); // Save the user document

  res.status(200).json({
    message: `${phone} updated successfully!`,
    status: "success",
    statusCode: 200
  });
});


const paymentInfoForFamilyWidse = asynHandler(async (req, res) => {
  const { email ,payment} = req.body;
  const userExist = await User.findOne({ email })
  const filter = { email: userExist.email };
  console.log("Filter1", userExist);
  // if (userExist) {
  //   res.status(400);
  //   throw new Error("User Already Exist");
  // }

  if (!userExist) {
    res.status(404);
    throw new Error("User not found");
}

const familymemberLength= userExist.familyMembers.length;

const familyWiseCost={
  expectedCost: (familymemberLength * 1200).toString(),
  paid: payment,
  due: ((familymemberLength * 1200) -parseInt(payment)).toString()
}



  const updateDocument = {
    $set: {
      familyWiseCost:familyWiseCost


    },
  };
  const user = await User.updateOne(filter, updateDocument);
  console.log("User", user);
  if (user) {
    res.status(200).json({
      message: `${email} updated sucessfully !!`,
      status: "sucess",
      email:email,
      statuscode: 200
    })
  } else {
    res.status(400);
    throw new Error("Error Occured");
  }


})

const authUsers = asynHandler(async (req, res) => {
  const { phone, password } = req.body;//desturctaring


  const user = await User.findOne({ phone });
  const res1 = await user.matchPassword(password);
  console.log("res1",res1);


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
  try {
    const userList = await User.find().select('rName email isAdmin isConfirmSeatBooking isArchived familyMembers familyWiseCost');
    
    // If no users found, respond with 204 No Content
    if (!userList.length) {
      return res.status(204).json({ message: 'No users found' });
    }

    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


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
      phone: user.phone,
      familyWiseCost: user.familyWiseCost

  });
});
module.exports = { registerUsers, authUsers, getUserList, editUsers , getUserByEmail ,paymentInfoForFamilyWidse,forgetpasswords};