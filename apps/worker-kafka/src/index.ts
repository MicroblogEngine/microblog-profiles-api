import 'dotenv/config';
import { Kafka } from "kafkajs";
import { Topics } from "@ararog/microblog-server";

const CLIENT_ID = 'microblog';
const GROUP_ID = 'microblog-profiles-api';

const startKafka = async () => {
  console.info('Starting Kafka consumer...');

  const sasl = process.env.NODE_ENV === 'production' ? {
    mechanism: 'plain', // scram-sha-256 or scram-sha-512
    username: process.env.KAFKA_USER as string,
    password: process.env.KAFKA_PASSWORD as string
  } : {};

  const kafka = new Kafka({
    clientId: CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER as string],
    ...sasl,
  });

  const consumer = kafka.consumer({ groupId: GROUP_ID, allowAutoTopicCreation: true })
  await consumer.connect()
  await consumer.subscribe({ topics: [
    Topics.SEND_VERIFICATION_MAIL, 
    Topics.SEND_RESET_PASSWORD_MAIL
  ], fromBeginning: true })

  console.info('Kafka consumer connected to broker ', process.env.KAFKA_BROKER as string);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.info('Received message from topic: ', topic, 'partition: ', partition, 'message: ', message.value?.toString());
    },
  })
}

startKafka();