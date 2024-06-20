const router = require("express").Router();
const handleRouter = require("../ultis/handleRouter");
const bookingController = require("../controller/booking.controller");
//
router.post("/booking", handleRouter(bookingController.Booking));
router.get("/bookings/", handleRouter(bookingController.HistoryBooking));
router.get("/booking/:id", handleRouter(bookingController.FindBooking));
// Export
module.exports = router;
