const express =require("express")
const router = express.Router();
const { createSeat,getAllBusSeatDetails,updateSeat,updateBulkSeats} = require('../controllers/busSeatDetailsController');
// const { protect } = require("../middlewares/authMiddlewares");
router.route('/').get(getAllBusSeatDetails);
// router.route('/:id').get(getWorkoutById);
router.route("/create").post(createSeat);
router.route("/update").put(updateSeat);
router.route("/bulkupdates").put(updateBulkSeats);

module.exports=router;