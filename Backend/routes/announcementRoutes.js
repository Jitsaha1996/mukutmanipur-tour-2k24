const express =require("express")
const router = express.Router();
const { getAllAnnounceMentDetails,createAnnouncement,updateAnnouncement,deleteAnnoucement} = require('../controllers/announcementController');
// const { protect } = require("../middlewares/authMiddlewares");
router.route('/').get(getAllAnnounceMentDetails);
// router.route('/:id').get(getWorkoutById);
router.route("/create").post(createAnnouncement);
router.route("/delete/:announcementId").get(deleteAnnoucement);


router.route("/update").put(updateAnnouncement);
// router.route("/bulkupdates").put(updateBulkSeats);

module.exports=router;