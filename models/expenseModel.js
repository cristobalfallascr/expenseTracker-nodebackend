const mongoose = require("mongoose");

//declare expense schema

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },

    budgetedAmount: { type: Number, required: true },
    usedAmount: { type: Number, required: true },
    availableAmount: { type: Number, required: true },
    createdBy: { type: String },

    budgetId: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    transactions: { type: Number, required: true },
    transactionList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
        required: false,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
