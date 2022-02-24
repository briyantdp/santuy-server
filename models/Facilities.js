const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const facilitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  itemId : {
    type : ObjectId,
    ref : "Item"
  }
});

const Facilities = mongoose.model("Facilities", facilitiesSchema);

module.exports = Facilities;
