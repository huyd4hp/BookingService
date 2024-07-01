const bookingModel = require("../model/booking.model");
const producer = require("../ultis/kafka_producer");
const cron = require("node-cron");

const CronJob = async () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // Find and delete documents
    const deletedDocuments = await bookingModel.find({
      status: "Pending",
      createdAt: { $lt: fifteenMinutesAgo },
    });

    for (let deletedDoc of deletedDocuments) {
      await producer.connect();
      producer.sendMessage(
        "payment_return",
        "Failed",
        JSON.stringify(deletedDoc)
      );
      await producer.disconnect();
    }
    const deletedDocumentIds = deletedDocuments.map((doc) => doc._id);
    await bookingModel.deleteMany({
      _id: { $in: deletedDocumentIds },
    });
  });
};
module.exports = CronJob;
