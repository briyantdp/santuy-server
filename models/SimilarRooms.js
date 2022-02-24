const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const similarRoomsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  itemId : {
    type : ObjectId,
    ref : "Item"
  }
});

const SimilarRooms = mongoose.model("SimilarRooms", similarRoomsSchema);

module.exports = SimilarRooms;
