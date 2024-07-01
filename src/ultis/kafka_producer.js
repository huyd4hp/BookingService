const { Kafka, Partitioners } = require("kafkajs");
const { KAFKA_HOST, KAFKA_PORT } = require("../settings");
class KafkaProducer {
  constructor({ clientId, brokers }) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }
  async connect() {
    await this.producer.connect();
  }
  async disconnect() {
    await this.producer.disconnect();
  }
  async sendMessage(topic, key, value) {
    await this.producer.send({
      topic: topic,
      messages: [
        {
          key: key,
          value: value,
        },
      ],
    });
  }
}
const producer = new KafkaProducer({
  clientId: "my-app",
  brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
});
module.exports = producer;
