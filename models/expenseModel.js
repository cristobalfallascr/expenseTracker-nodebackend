const mongoose = require("mongoose");

//declare expense schema

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    budgetedAmount: { type: Number, required: true },
    usedAmount: { type: Number, required: true },
    availableAmount: { type: Number, required: true },
    createdBy: { type: String },
    records: { type: Number, required: true },
    budgetId: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
      // required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
