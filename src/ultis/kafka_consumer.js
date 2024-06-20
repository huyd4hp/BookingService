const { Kafka } = require("kafkajs");
const bookingModel = require("../model/booking.model");
const producer = require("../ultis/kafka_producer");
class KafkaConsumer {
  constructor({ clientId, brokers, topic }) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });
    this.consumer = this.kafka.consumer({ groupId: "my_group_id" });
    this.topic = topic;
  }

  async connect() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic });
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (topic == "payment_return" && message.key.toString() == "Paid") {
          const seat_id = message.value.toString();
          await bookingModel.findOneAndUpdate(
            { seat_id: seat_id },
            { status: "Paid" },
            { new: true }
          );
          const UpdatedBooking = await bookingModel
            .findOne({ seat_id: seat_id })
            .lean();
          producer.sendMessage(
            "new_booking",
            "OK",
            JSON.stringify(UpdatedBooking)
          );
        }
      },
    });
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}

const consumer = new KafkaConsumer({
  clientId: "booking-service",
  brokers: ["localhost:9092"],
  topic: "payment_return",
});
consumer.connect();
module.exports = consumer;
