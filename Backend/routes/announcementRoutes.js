const express =require("express")
const router = express.Router();
const { getAllAnnounceMentDetails,createAnnouncement} = require('../controllers/announcementController');
// const { protect } = require("../middlewares/authMiddlewares");
router.route('/').get(getAllAnnounceMentDetails);
// router.route('/:id').get(getWorkoutById);
router.route("/create").post(createAnnouncement);
// router.route("/update").put(updateSeat);
// router.route("/bulkupdates").put(updateBulkSeats);

module.exports=router;