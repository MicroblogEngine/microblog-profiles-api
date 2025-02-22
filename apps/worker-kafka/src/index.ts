import 'dotenv/config';
import { Kafka, SASLOptions } from "kafkajs";
import { Topics } from "@ararog/microblog-server";

const CLIENT_ID = process.env.KAFKA_CLIENT_ID ?? 'microblog';
const GROUP_ID = process.env.KAFKA_GROUP_ID ?? 'microblog';

const startKafka = async () => {
  console.info('Starting Kafka consumer...');

  const sasl: SASLOptions | undefined = process.env.NODE_ENV === 'production' ? {
    mechanism: process.env.KAFKA_SASL_MECHANISM as 'plain',
    username: process.env.KAFKA_USER as string,
    password: process.env.KAFKA_PASSWORD as string,
  } : undefined;

  console.info('Connecting to Kafka broker at ', process.env.KAFKA_BROKER);
  const kafka = new Kafka({
    clientId: CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    sasl: sasl,
  });

  const consumer = kafka.consumer({ groupId: GROUP_ID, allowAutoTopicCreation: true })
  await consumer.connect()
  await consumer.subscribe({ topics: [
    Topics.DELETE_PROFILE
  ], fromBeginning: true })

  console.info('Kafka consumer connected to broker ', process.env.KAFKA_BROKER as string);
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.info('Received message from topic: ', topic, 'partition: ', partition, 'message: ', message.value?.toString());
    },
  })
}

startKafka();