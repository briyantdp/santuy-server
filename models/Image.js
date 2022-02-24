const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  itemId : {
    type : ObjectId,
    ref : "Item"
  }
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
