const mongoose = require("mongoose");

const budgetSchema = mongoose.Schema(
    {
        expensesId: {
          type: String,
          required: true,
          unique: true,
        },
        expensesDeatils: {
          type: String,
          required: true,
        },
        expensesValue: {
            type: Number,
            required: true,
            default: 0,
        },
       
      },
  {
    timestamps: true,
  }
);


const BudgetModel = mongoose.model('BudgetModel', budgetSchema);
module.exports = BudgetModel;



