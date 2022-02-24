const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sumBooking : {  
    type : Number,
    default : 0
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "Indonesia",
  },
  description: {type : String, required : true},
  categoryId : {
    type : ObjectId,
    ref : "Category"
  },
  imageId: [{type: ObjectId, ref: "Image"}],
  facilitiesId: [{ type: ObjectId, ref: "Facilities" }],
  similarRoomsId: [{ type: ObjectId, ref: "SimilarRooms" }],
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
