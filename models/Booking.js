const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  invoice : {
    type : String,
    required : true
  },
  itemId: {
    _id : {
      type : ObjectId,
      ref : "Item",
      required : true
    },
    title : {
      type : String,
      required : true
    },
    price : {
      type : Number, 
      required : true
    },
    duration : {
      type : Number,
      required : true
    }
  },
  totalPrice : {
    type : Number,
    required : true
  }, 
  customerId: {
    type: ObjectId,
    ref: "Customer",
  },
  bankId: {
    type: ObjectId,
    ref: "Bank",
  },
  payments : {
    proofPayment: {
      type: String,
      required: true,
    },
    bankFrom: {
      type: String,
      required: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default : "Proses"
    },
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
