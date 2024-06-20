const bookingModel = require("../model/booking.model");

class BookingService {
  static AddBooking = async (data) => {
    const newBooking = await bookingModel.create(data);
    return newBooking;
  };
  static All = async (CLIENT_ID) => {
    const metadata = await bookingModel.find({ buyer_id: CLIENT_ID });
    return metadata;
  };
  static GetByID = async (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const booking = await bookingModel.findById(id).lean();
      if (!booking) {
        return null;
      }
      return booking;
    }
    return null;
  };
  static GetBySeatID = async (id) => {
    const booking = await bookingModel.findOne({ seat_id: id }).lean();
    if (!booking) {
      return null;
    }
    return booking;
  };
}
module.exports = BookingService;
