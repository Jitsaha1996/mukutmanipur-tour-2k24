const BusSeatModel=require('../models/busSeatmodel');
const asynHandler = require('express-async-handler');


const getAllBusSeatDetails = asynHandler(async (req, res) => {
 
    const seats = await BusSeatModel.find();
    res.json(seats);
})
const createSeat = asynHandler(async (req, res) => {
    const { seatNumber, seatDetails, seatStatus } = req.body; // Corrected spelling to 'seatDetails'

    // Check if the seat number already exists
    const seatExist = await BusSeatModel.findOne({ seatNumber });
    if (seatExist) {
        res.status(400);
        throw new Error("Seat Already Exists");
    }

    // Create a new seat document
    const seat = await BusSeatModel.create({
        seatNumber,
        seatDetails, // Use the corrected field name
        seatStatus
    });

    if (seat) {
        res.status(201).json({
            _id: seat._id,
            seatNumber: seat.seatNumber,
            seatDetails: seat.seatDetails, // Use the corrected field name
            seatStatus: seat.seatStatus
        });
    } else {
        res.status(400);
        throw new Error("Error Occurred");
    }
});


const updateBulkSeats = asynHandler(async (req, res) => {
    const  seats  = req.body; // Expecting an array of seat updates

    if (!Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({
            message: "Invalid input, please provide an array of seats to update.",
            status: "error",
        });
    }

    const bulkOperations = seats.map(seat => {
        const { seatNumber, seatDetails, seatStatus } = seat;

        return {
            updateOne: {
                filter: { seatNumber }, // Filter by seatNumber
                update: {
                    $set: {
                        seatDetails: seatDetails,
                        seatStatus: seatStatus,
                    },
                },
            },
        };
    });

    try {
        const result = await BusSeatModel.bulkWrite(bulkOperations);

        res.status(200).json({
            message: `${result.modifiedCount} seats updated successfully!`,
            status: "success",
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred during bulk update.",
            error: error.message,
            status: "error",
        });
    }
});


  const updateSeat = asynHandler(async (req, res) => {
    const { seatNumber, seatDetails,seatStatus } = req.body;
    const seatExist = await BusSeatModel.findOne({ seatNumber })
    const filter = { seatNumber: seatExist.seatNumber };
    const updateDocument = {
      $set: {
        seatDetails: seatDetails,
        seatStatus: seatStatus,
      },
    };
    const seat = await BusSeatModel.updateOne(filter, updateDocument);
    if (seat) {
      res.status(200).json({
        message: `${seatNumber} updated sucessfully!`,
        status: "sucess",
        statuscode: 200
      })
    } else {
      res.status(400);
      throw new Error("Error Occured");
    }
  });

  
// const getWorkoutById = asynHandler(async (req, res) => {
//     const note = await Workout.findById(req.params.id);
  
//     if (note) {
//       res.json(note);
//     } else {
//       res.status(404).json({ message: "Note not found" });
//     }
  
//     res.json(note);
//   });

module.exports={createSeat,getAllBusSeatDetails,updateSeat,updateBulkSeats};

