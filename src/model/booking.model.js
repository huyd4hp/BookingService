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
    seat_id: {
      type: Number,
      required: true,
      unique: true,
    },
    addons_id: {
      type: [Number],
      default: [],
    },
    voucher_id: {
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
  },
  {
    timestamps: true,
  }
);
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, bookingSchema, COLLECTION_NAME);
