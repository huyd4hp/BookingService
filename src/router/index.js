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
router.get(
  "/manage/bookings",
  login_required,
  handleRouter(bookingController.ManageBooking)
);
router.post("/checkin", handleRouter(bookingController.CheckIn));
// Export
module.exports = router;
