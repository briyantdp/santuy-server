const mongoose = require("mongoose");
const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  bankNumber: {
    type: String,
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  imageUrl : {
    type : String,
  }
});

const Bank = mongoose.model("Bank", bankSchema);

module.exports = Bank;
