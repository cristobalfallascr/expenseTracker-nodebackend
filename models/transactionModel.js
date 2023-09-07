const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    usedAmount: { type: Number, required: true },
    expenseId: {
      type: Schema.Types.ObjectId,
      ref: "Expense",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transacion", transactionSchema);
