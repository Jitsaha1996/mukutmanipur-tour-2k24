const BudgetModel = require('../models/budgetModel');
const asynHandler = require('express-async-handler');


// const totalBudgetInfo = asynHandler(async (req, res) => {
//  let budget = 0;
//     const allUsers = await User.find();
//     if(allUsers){
//        allUsers.forEach(element => {
//             budget= budget+ element.familyMembers.length *1200;
//         });
//     }
    
//     res.json({
//         TotalBudget:budget
//     });
// })

const getAllExpenses = asynHandler(async (req, res) => {
 
    const expenses = await BudgetModel.find();
    res.json(expenses);
})
const createExpense = asynHandler(async (req, res) => {
    const { expensesId, expensesDeatils, expensesValue } = req.body; // Corrected spelling to 'seatDetails'

    // Check if the seat number already exists
    const expenseExit = await BudgetModel.findOne({ expensesId });
    if (expenseExit) {
        res.status(400);
        throw new Error("Expense Id  Already Exists");
    }

    // Create a new seat document
    const expense = await BudgetModel.create({
        expensesId,
        expensesDeatils, // Use the corrected field name
        expensesValue
    });

    if (expense) {
        res.status(201).json({
            expensesId: expense.expensesId,
            expensesDeatils: expense.expensesDeatils,
            expensesValue: expense.expensesValue, // Use the corrected field name
        });
    } else {
        res.status(400);
        throw new Error("Error Occurred");
    }
});

const updateExpenses = asynHandler(async (req, res) => {
    const { expensesId, expensesDeatils, expensesValue } = req.body;
    const expenseExit = await BudgetModel.findOne({ expensesId });
    const filter = { expensesId: expenseExit.expensesId };
    const updateDocument = {
        $set: {
            expensesDeatils: expensesDeatils,
            expensesValue: expensesValue,
        },
    };
    const expense = await BudgetModel.updateOne(filter, updateDocument);
    if (expense) {
        res.status(200).json({
            message: `${expensesId} updated sucessfully!`,
            status: "sucess",
            statuscode: 200
        })
    } else {
        res.status(400);
        throw new Error("Error Occured");
    }
});

const deleteExpense = asynHandler(async (req, res) => {
    const { expensesId } = req.params; // Assuming seatNumber is passed as a URL parameter

    // Check if the seat exists
    const expenseExit = await BudgetModel.findOne({ expensesId });

    if (!expenseExit) {
        return res.status(404).json({
            message: `Expense number ${expensesId} not found.`,
            status: "fail",
            statuscode: 404,
        });
    }

    // Proceed to delete the seat
    const expenseDelete = await BudgetModel.deleteOne({ expensesId });

    if (expenseDelete.deletedCount === 1) {
        res.status(200).json({
            message: ` ${expensesId} deleted successfully!`,
            status: "success",
            statuscode: 200,
        });
    } else {
        res.status(400);
        throw new Error("Error occurred while deleting the announcement.");
    }
});


module.exports = { createExpense, updateExpenses, deleteExpense, getAllExpenses };

