const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },

    budgetCode: { type: String, required: true },

    expenseCount: {
      type: Number,
      required: true,
    },
    budgetTotalAmount: {
      type: Number,
      required: true,
    },

    budgetAmountAssigned: {
      type: Number,
      required: true,
    },
    budgetAmountUnassigned: {
      type: Number,
      required: true,
    },
    budgetAmountUsed: {
      type: Number,
      required: true,
    },
    budgetAmountAvailable: {
      type: Number,
      required: true,
    },
    expenseList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expense",
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

module.exports = mongoose.model("Budget", budgetSchema);
