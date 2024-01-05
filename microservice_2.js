const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const amqp = require('amqplib/callback_api');

const queue = 'task_queue';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    logger.info(`[M2] Waiting for tasks in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, (msg) => {
      const task = JSON.parse(msg.content.toString());

      setTimeout(() => {
        const result = { doubledParam: task.param * 2 };
        logger.info('[M2] Processed task:', { result });

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
          correlationId: msg.properties.correlationId,
        });

        channel.ack(msg);
      }, 5000);
    });
  });
});
