const { Kafka } = require("kafkajs");
const bookingModel = require("../model/booking.model");
const producer = require("../ultis/kafka_producer");
const { KAFKA_HOST, KAFKA_PORT } = require("../settings");
const bookingCode = require("../ultis/bookingCode");
const { json } = require("express");
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
        if (topic == "payment_return") {
          const action = message.key.toString();
          if (action == "Paid") {
            const seat_id = message.value.toString();
            console.log(seat_id);
            while (true) {
              try {
                const code = bookingCode();
                await bookingModel.findOneAndUpdate(
                  { seat: seat_id },
                  { status: action, booking_code: code },
                  { new: true }
                );
                break;
              } catch (err) {
                continue;
              }
            }
            const UpdatedBooking = await bookingModel
              .findOne({ seat: seat_id })
              .lean();
            await producer.connect();
            producer.sendMessage(
              "new_booking",
              "OK",
              JSON.stringify(UpdatedBooking)
            );
            await producer.disconnect();
          }
          if (action == "Failed") {
            const booking = JSON.parse(message.value.toString());
            const seat = booking["seat"];
            await bookingModel.deleteOne({ seat: seat });
          }
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
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
  topic: "payment_return",
});
module.exports = consumer;
