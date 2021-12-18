<h1 align="center">Telegram-Forward-Bot</h1>

<div align="center">

Telegram-Forward-Bot built with Node.js based on [Node-Telegram-Bot-API](https://telegram.me/node_telegram_bot_api)

This project relies on [Node.js](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions) and [MongoDB](https://docs.mongodb.com/manual/administration/install-community/), so if you don't have both of these installed, please first install.

</div>

## Start

```shell
git clone https://github.com/DesnLee/Telegram-Forward-Bot.git && cd Telegram-Forward-Bot
```

## Install Dependencies

```sh
npm install
```

## Config

#### in ./config.js

```js
// in config.js, you need to edit following lines

// input your bot token，keep quotation marks
const BOT_TOKEN = ''

// input your number id，delete quotation marks
const ME = ''

//  input your welcome message, you can use Markdown，keep quotation marks
const WELCOME = `*Hello~*`

// need notice [ true, false]
const NOTICE = false
```

## Run

```shell
node bot
```

## Usage

- You can reply to the forwarded message to reply to the original message, currently supports text, stickers, photos.
- Replying to a forwarded message `!ban` or `!unban` will add/remove someone to the blacklist, and when someone is blacklisted, the bot will not forward his/her messages to you.

## Use the PM2 daemon

### install PM2

```shell
npm install pm2 -g
```

### use PM2

```shell
# start
pm2 start /Absolute/Path/To/bot.js

# save status
pm2 save

# Boot up
pm2 startup
```

## License

**The MIT License (MIT)**

Copyright © 2021 Alex Lee

