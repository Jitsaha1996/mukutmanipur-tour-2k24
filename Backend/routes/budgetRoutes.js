const express =require("express")
const router = express.Router();
const { createExpense, updateExpenses, deleteExpense, getAllExpenses } = require('../controllers/budgetController');
// const { protect } = require("../middlewares/authMiddlewares");
router.route('/').get(getAllExpenses);
// router.route('/:id').get(getWorkoutById);
router.route("/create").post(createExpense);
router.route("/delete/:expensesId").get(deleteExpense);


router.route("/update").put(updateExpenses);
// router.route("/bulkupdates").put(updateBulkSeats);

module.exports=router;