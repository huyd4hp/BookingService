const router = require("express").Router();
const handleRouter = require("../ultis/handleRouter");
const bookingController = require("../controller/booking.controller");
const login_required = require("../auth/login_required");
//
router.post(
  "/booking",
  login_required,
  handleRouter(bookingController.Booking)
);
router.get(
  "/bookings/",
  login_required,
  handleRouter(bookingController.HistoryBooking)
);
router.get(
  "/booking/:id",
  login_required,
  handleRouter(bookingController.FindBooking)
);
router.post("/checkin", handleRouter(bookingController.FindBookingDetail));
// Export
module.exports = router;
