"use strict";
const mongoose = require("mongoose");
const DOCUMENT_NAME = "booking";
const COLLECTION_NAME = "bookings";

const BookingStatus = {
  Pending: "Pending",
  Paid: "Paid",
};
var bookingSchema = new mongoose.Schema(
  {
    booking_code: {
      type: String,
      unique: true,
    },
    buyer_id: {
      type: String,
      required: true,
    },
    buyer_name: {
      type: String,
    },
    buyer_email: {
      type: String,
      required: true,
    },
    event_owner: {
      type: String,
      required: true,
    },
    seat: {
      type: Number,
      required: true,
      unique: true,
    },
    event: {
      type: Number,
      required: true,
    },
    voucher: {
      type: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
    },
    join: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, bookingSchema, COLLECTION_NAME);
