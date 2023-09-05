const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  budgets: {
    items: [
      {
        budgetId: {
          type: Schema.Types.ObjectId,
          ref:'Budget',
          required: true,
        },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
