const bookingModel = require("../model/booking.model");

class BookingService {
  static AddBooking = async (data) => {
    await bookingModel.create(data);
    return await bookingModel.findOne({ seat: data.seat }).lean();
  };
  static Filter = async ({ buyer_id, event, event_owner }) => {
    const filter = {};
    if (buyer_id) {
      filter.buyer_id = buyer_id;
    }
    if (event) {
      filter.event = event;
    }
    if (event_owner) {
      filter.event_owner = event_owner;
    }
    const bookings = await bookingModel.find(filter).lean();
    return bookings;
  };

  static CheckUserInEvent = async (event, user) => {
    const booking = await bookingModel
      .findOne({
        event: event,
        buyer_id: user,
      })
      .lean();
    return booking;
  };
  static FindByID = async (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const booking = await bookingModel.findById(id).lean();
      if (!booking) {
        return null;
      }
      return booking;
    }
    return null;
  };
  static FindBySeatID = async (id) => {
    const booking = await bookingModel.findOne({ seat_id: id }).lean();
    if (!booking) {
      return null;
    }
    return booking;
  };
  static FindByBookingCode = async (code) => {
    const booking = await bookingModel.findOne({ booking_code: code }).lean();
    if (!booking) {
      return null;
    }
    return booking;
  };
  static CheckIn = async (code) => {
    const booking = await bookingModel.findOneAndUpdate(
      {
        booking_code: code,
      },
      {
        join: true,
      },
      {
        new: true,
      }
    );
    return booking;
  };
}
module.exports = BookingService;
