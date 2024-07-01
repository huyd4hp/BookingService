const bookingService = require("../service/booking.services");
const EventService = require("../ultis/event_service");
const producer = require("../ultis/kafka_producer");
const Payment = require("../ultis/payment");
const { socket } = require("../app");
// Controller
class BookingController {
  static Booking = async (req, res, next) => {
    const { CLIENT_ID, CLIENT_EMAIL } = req.headers;
    const { event, voucher, total } = req.body;
    if (!event) {
      return res.status(400).json({
        status: "error",
        message: "Missing event",
      });
    }
    const EventBooking = await EventService.FindEvent(event);
    if (!EventBooking) {
      return res.status(404).json({
        status: "error",
        message: "Event Not Found",
      });
    }
    const holderbooking = await bookingService.CheckUserInEvent(
      event,
      CLIENT_ID
    );
    if (holderbooking) {
      require("../app").socket.push(CLIENT_ID, "Booking", {
        status: "Failed",
        message: "You have already joined this event.",
      });
      return res.status(409).json({
        status: "error",
        message: "You have already joined this event.",
      });
    }
    const Seats = await EventService.FindSeats(event, "NotOrdered");
    if (Seats.length == 0) {
      require("../app").socket.push(CLIENT_ID, "Booking", {
        status: "Failed",
        message: "Seat Sold Out",
      });
      return res.status(400).json({
        status: "error",
        message: "Seat Sold Out",
      });
    }
    const AnySeat = Seats[0];
    let retotal = AnySeat["price"];
    if (voucher) {
      const Voucher = await EventService.FindVoucher(voucher);
      if (!Voucher) {
        require("../app").socket.push(CLIENT_ID, "Booking", {
          status: "Failed",
          message: "Voucher Not Found",
        });
        return res.status(404).json({
          status: "error",
          message: "Voucher Not Found",
        });
      }
      if (Voucher["event"] != event) {
        require("../app").socket.push(CLIENT_ID, "Booking", {
          status: "Failed",
          message: "Not Suitable Voucher",
        });
        return res.status(400).json({
          status: "error",
          message: "Not Suitable Voucher",
        });
      }
      const discount = Voucher["discount_percent"] * retotal;
      if (discount <= Voucher["discount_max"]) {
        retotal -= discount;
      } else {
        retotal -= Voucher["discount_max"];
      }
    }
    let data = {
      ...req.body,
      total: retotal,
      seat: AnySeat["id"],
      buyer_id: CLIENT_ID,
      buyer_email: CLIENT_EMAIL,
      event_owner: EventBooking["owner"],
    };
    if (voucher) {
      data = {
        ...data,
        voucher: voucher,
      };
    }
    const booking = await bookingService.AddBooking(data);
    const payment_url = await Payment.GeneralPaymentURL(
      booking._id,
      req.headers["authorization"]
    );
    require("../app").socket.push(CLIENT_ID, "Booking", {
      status: "Accept",
      message: {
        booking,
        payment_url: payment_url,
      },
    });
    await producer.connect();
    producer.sendMessage(
      "booking",
      booking._id.toString(),
      JSON.stringify(booking)
    );
    await producer.disconnect();
    return res.status(200).json({
      ...booking,
      payment_url: payment_url,
    });
  };
  static HistoryBooking = async (req, res, next) => {
    const { CLIENT_ID } = req.headers;
    const metadata = await bookingService.Filter({
      buyer_id: CLIENT_ID,
    });
    return res.status(200).json({
      status: "success",
      metadata: metadata,
    });
  };
  static FindBooking = async (req, res, next) => {
    const { CLIENT_ID } = req.headers;
    const id = req.params.id;
    const metadata = await bookingService.FindByID(id);
    if (!metadata) {
      return res.status(404).json({
        status: "error",
        message: "Booking Not Found",
      });
    }
    if (CLIENT_ID != metadata["buyer_id"]) {
      return res.status(403).json({
        status: "error",
        message: "Access Forbidden",
      });
    }
    return res.status(200).json({
      status: "success",
      metadata: metadata,
    });
  };
  static CheckIn = async (req, res, next) => {
    const { booking_code } = req.body;
    if (!booking_code) {
      return res.status(400).json({
        status: "error",
        message: "Missing Booking Code",
      });
    }
    const booking = await bookingService.FindByBookingCode(booking_code);
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Not Found Booking",
      });
    }
    return res.status(200).json({
      status: "success",
      metadata: await bookingService.CheckIn(booking_code),
    });
  };
  static ManageBooking = async (req, res, next) => {
    const { CLIENT_ID, CLIENT_ROLE } = req.headers;
    let metadata = undefined;
    if (CLIENT_ROLE === "User") {
      return res.status(403).json({
        status: "error",
        message: "Access Forbidden",
      });
    }
    if (CLIENT_ROLE === "EventAdmin") {
      metadata = await bookingService.Filter({
        event_owner: CLIENT_ID,
      });
    } else {
      metadata = await bookingService.Filter();
    }
    return res.status(200).json({
      status: "success",
      metadata: metadata,
    });
  };
}
module.exports = BookingController;
