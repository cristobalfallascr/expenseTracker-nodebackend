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
    expenseCount: {
      type: Number,
      required: true,
    },
    budgetTotalAmount: {
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
    expenseList: {
      expenses: [
        {
          expenseId: {
            type: Schema.Types.ObjectId,
            ref: "Budget",
            required: true,
          },
        },
      ],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
