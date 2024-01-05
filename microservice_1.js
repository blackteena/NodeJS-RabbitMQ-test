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

const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/process', async (req, res) => {
  const inputParam = req.body.param;

  await sendMessageToQueue(inputParam);

  res.status(200).json({ message: 'Task submitted for processing' });
});

function sendMessageToQueue(param) {
  return new Promise((resolve, reject) => {
    amqp.connect('amqp://localhost', (error0, connection) => {
      if (error0) {
        reject(error0);
        return;
      }

      connection.createChannel((error1, channel) => {
        if (error1) {
          reject(error1);
          return;
        }

        const queue = 'task_queue';
        const message = { param };

        channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

        logger.info('[M1] Sent task to RabbitMQ:', { message });

        resolve();
      });
    });
  });
}

app.listen(PORT, () => {
  logger.info(`M1 listening at http://localhost:${PORT}`);
});
