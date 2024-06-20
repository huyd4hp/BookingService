const bookingService = require("../service/booking.services");
const EventService = require("../ultis/event_service");
const producer = require("../ultis/kafka_producer");
// Controller
class BookingController {
  static Booking = async (req, res, next) => {
    const { seat_id } = req.body;
    const { CLIENT_ID, CLIENT_NAME, CLIENT_EMAIL } = req.headers;
    if (!seat_id) {
      return res.status(400).json({
        detail: [
          {
            loc: ["body", "seat_id"],
            msg: "field required",
            type: "value_error.missing",
          },
        ],
      });
    }
    // - Check Seat in Booking
    const holderBooking = await bookingService.GetBySeatID(seat_id);
    if (holderBooking) {
      require("../app").socketService.emit("booking", {
        status: "Refused",
        metadata: `Seat ${seat_id}: ${holderBooking.status}`,
      });
      return res.status(409).json({
        status: "error",
        message: "booking refused",
        detail: `Seat ${seat_id}: ${holderBooking.status}`,
      });
    }
    const data = {
      ...req.body,
      buyer_id: CLIENT_ID,
      buyer_name: CLIENT_NAME,
      buyer_email: CLIENT_EMAIL,
    };
    let SeatInfo = undefined;
    let VoucherInfo = undefined;
    let total = 0;
    SeatInfo = await EventService.FindSeat(data.seat_id);
    if (!SeatInfo) {
      require("../app").socketService.emit("booking", {
        status: "Refused",
        metadata: `Seat Not Found`,
      });
      return res.status(404).json({
        status: "error",
        message: "booking refused",
        detail: `Seat Not Found`,
      });
    }
    data["event_owner"] = SeatInfo["event_owner"];
    if (SeatInfo["status"] != "NotOrdered") {
      require("../app").socketService.emit("booking", {
        status: "Refused",
        metadata: `Seat ${SeatInfo["status"]}`,
      });
      return res.status(400).json({
        status: "error",
        message: "booking refused",
        detail: `Seat ${SeatInfo["status"]}`,
      });
    }
    total = total + SeatInfo["price"];
    if (data.hasOwnProperty("voucher_id")) {
      VoucherInfo = await EventService.FindVoucher(data.voucher_id);
      if (!VoucherInfo) {
        require("../app").socketService.emit("booking", {
          status: "Refused",
          metadata: `Voucher Not Found`,
        });
        return res.status(404).json({
          status: "error",
          message: "booking refused",
          detail: `Voucher Not Found`,
        });
      }
      if (VoucherInfo["event"] != SeatInfo["event"]) {
        require("../app").socketService.emit("booking", {
          status: "Refused",
          metadata: `Not Suitable Voucher`,
        });
        return res.status(400).json({
          status: "error",
          message: "booking refused",
          detail: `Not Suitable Voucher`,
        });
      }
    }
    if (data.hasOwnProperty("addons_id")) {
      for (let id of data.addons_id) {
        const AddonInfo = await EventService.FindAddon(id);
        if (!AddonInfo) {
          require("../app").socketService.emit("booking", {
            status: "Refused",
            metadata: `Addon (ID:${id}) Not Found`,
          });
          return res.status(404).json({
            status: "error",
            message: "booking refused",
            detail: `Addon (ID:${id}) Not Found`,
          });
        }
        if (AddonInfo["event"] != SeatInfo["event"]) {
          require("../app").socketService.emit("booking", {
            status: "Refused",
            metadata: `Not Suitable Addon`,
          });
          return res.status(400).json({
            status: "error",
            message: "booking refused",
            detail: `Not Suitable Addon`,
          });
        }
        total = total + AddonInfo["price"];
      }
    }
    if (VoucherInfo !== undefined) {
      const discount = (total * VoucherInfo["discount_percent"]) / 100;
      if (discount <= VoucherInfo["discount_max"]) {
        total = total - discount;
      } else {
        total = total - VoucherInfo["discount_max"];
      }
    }
    data["total"] = total;
    const newBooking = await bookingService.AddBooking(data);
    producer.sendMessage(
      "booking",
      newBooking._id.toString(),
      JSON.stringify(newBooking)
    );
    require("../app").socketService.emit("booking", {
      status: "Accept",
      metadata: newBooking,
    });
    return res.status(200).json({
      status: "success",
      message: "Booking Accept",
      metadata: newBooking,
    });
  };

  static HistoryBooking = async (req, res, next) => {
    const { CLIENT_ID } = req.headers;
    const metadata = await bookingService.All(CLIENT_ID);
    return res.status(200).json({
      status: "success",
      metadata: metadata,
    });
  };
  static FindBooking = async (req, res, next) => {
    const { CLIENT_ID } = req.headers;
    const id = req.params.id;
    const metadata = await bookingService.GetByID(id);
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
}
module.exports = BookingController;
