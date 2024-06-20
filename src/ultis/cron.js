const bookingModel = require("../model/booking.model");
const producer = require("../ultis/kafka_producer");
const cron = require('node-cron');

const CronJob = async () => {
  cron.schedule('* * * * *', async () => { // Chạy 1p/1 lần -> update s/1 lần
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000); // 2 phút expire

  // Find and delete documents
  const deletedDocuments = await bookingModel.find({
    status: "Pending",
    createdAt: { $lt: fifteenMinutesAgo },
  });

  for (let deletedDoc of deletedDocuments) {
    producer.sendMessage(
      "payment_return",
      "Failed",
      JSON.stringify(deletedDoc)
    );
  }
  const deletedDocumentIds = deletedDocuments.map((doc) => doc._id);
  await bookingModel.deleteMany({
    _id: { $in: deletedDocumentIds },
  });
});
};
module.exports = CronJob;
