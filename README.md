Инструкция по локальному развертыванию проекта

1. Установка Node.js:

-Скачайте и установите Node.js с официального сайта.
-Проверьте, что Node.js и npm установлены, выполнив в терминале или командной строке:
node -v
npm -v

2. Установка RabbitMQ:

-Скачайте и установите RabbitMQ с официального сайта.
-Запустите RabbitMQ сервер.

3. Клонирование проекта:

Склонируйте репозиторий с GitHub:

-git clone https://github.com/blackteena/NodeJS_RabbitMQ_test.git
-Перейдите в директорию проекта:

4. Установка зависимостей:

-Установите зависимости, выполнив следующую команду в терминале:
npm install

5. Запуск M1 (HTTP обработка):

-Запустите M1, выполнив следующую команду:
node M1.js

Веб-сервер M1 будет доступен по адресу http://localhost:3000.

6. Запуск M2 (Обработка заданий из RabbitMQ):

-Запустите M2, выполнив следующую команду:
node M2.js