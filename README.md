<h1 align="center">Telegram-Forward-Bot</h1>

<div align="center">

Telegram-Forward-Bot built with Node.js based on [Node-Telegram-Bot-API](https://github.com/yagop/node-telegram-bot-api)

This project relies on [Node.js](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions) and [MongoDB](https://docs.mongodb.com/manual/administration/install-community/), so if you don't have both of these installed, please first install.

</div>

## Start with single file

If you just want to use this bot, you can choose to download 2 runtime files to
use it.

The main file below is built with [vercel/ncc](https://github.com/vercel/ncc)
and does not require any other dependencies to be installed. Of course, you still need to install [Node.js](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)
and [MongoDB](https://docs.mongodb.com/manual/administration/install-community/).

- configuration file: https://raw.githubusercontent.com/DesnLee/Telegram-Forward-Bot/master/dist/env/config.yaml
- main file: https://raw.githubusercontent.com/DesnLee/Telegram-Forward-Bot/master/dist/index.js

> **Please Note:** 
> 
> the configuration file must be in a directory named "env" and place the env directory at the same level as the main file. 
> 
> After download, you should complete the configuration file.

# Start with build
```shell
git clone https://github.com/DesnLee/Telegram-Forward-Bot.git && cd Telegram-Forward-Bot
```

## Install Dependencies

```sh
 yarn install    # npm install
```

## Config

in ./env/config.yaml

```yaml
# Please keep the following double quotes

# Your mongodb address like 'mongodb://user:pwd@127.0.0.1:27017/ForwardBotDB'
database_url : ""

# The bot token that you get from BotFather
bot_token :    ""

# Your telegram number ID, no quotes like 123456789
me :

# Need notification, true / false
notice :       true

# Auto-reply message when the user sends the following commands, can use Markdown format
msg :
  start : "*Hello，welcome!*\n\nThis is my bot, and can forwards your messages to me"

# Don't change the following options!!
parse :
  html : { parse_mode : 'HTML' }
  mark : { parse_mode : 'Markdown' }
  mark2 : { parse_mode : 'MarkdownV2' }
```

## build

```shell
yarn build    # npm run build
```

## run

```shell
cd dist && node index.js
```

## Usage

- You can reply to the forwarded message to reply to the original message, currently supports text, stickers, photos.
- Reply  `!ban` or `!unban` to a forwarded message will add/remove someone to the blacklist, and when someone is blacklisted, the bot will not forward his/her messages to you.
- Reply  `!info` to a forwarded message will show you the userinfo whose sent the message.
- Reply "!del" or "!del all" to a message you sent earlier and the message will
  be deleted from the chat history between the bot and you and the sender of the
  message.
- 
## Use the PM2 daemon

### install PM2

```shell
npm install pm2 -g
```

### use PM2

```shell
# start
pm2 start /Absolute/Path/To/index.js

# save status
pm2 save

# Boot up
pm2 startup
```

## License

**The MIT License (MIT)**

Copyright © 2021 Alex Lee
