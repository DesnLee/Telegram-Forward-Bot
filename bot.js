const ENV = require('./config')
const mongo = require('./mongo')

const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(ENV.BOT_TOKEN, {polling: true})

//*************************************************************************************
/////////////////////////////  设置默认 mongoose 连接  //////////////////////////////////
//*************************************************************************************
require("mongoose").connect('mongodb://127.0.0.1:27017/ForwardBotDB')
require("mongoose").connection.on('error', console.error.bind(console, 'MongoDB 连接错误：'))


if (!ENV.ME) {
    throw `config ERROR: 请在 config.js 中填写使用者数字ID`
}

bot.on("polling_error", console.log)
bot.sendMessage(ENV.ME, '私聊助手开始运行！')
    .catch(e => console.log('send start message ERROR:\n', e))

//*************************************************************************************
/////////////////////////////////  消息处理逻辑  ////////////////////////////////////////
//*************************************************************************************

const opt = {'parse_mode': 'Markdown'}

bot.on('message', async receivedMsg => {
    // 忽略非私聊消息
    if (receivedMsg.chat.type !== 'private') return

    // 忽略黑名单用户消息
    const fromUser = await mongo.User.findOne({tg_id: receivedMsg.from.id})
    if (fromUser.is_banned) return

    // 文字命令消息逻辑
    if (receivedMsg.text) {

        // 处理用户命令
        if (receivedMsg.text.indexOf('/') === 0) {
            switch (receivedMsg.text) {
                case '/start':
                    new mongo.User({
                        tg_id: receivedMsg.from.id,
                        first_name: receivedMsg.from.first_name,
                    })
                        .save()
                        .then(() => {
                            if (!ENV.WELCOME) return
                            bot.sendMessage(receivedMsg.chat.id, ENV.WELCOME, opt)
                                .catch(e => console.log('send welcome message ERROR:\n', e))
                        })
                    break
                default:
                    bot.sendMessage(receivedMsg.chat.id, '未找到命令', opt)
                        .catch(e => console.log('send command warn ERROR:\n', e))
            }
            return
        }

        // 处理自己命令
        if (receivedMsg.text.indexOf('!') === 0 && receivedMsg.from.id === ENV.ME) {

            // 处理错误
            if (!receivedMsg.reply_to_message) {
                bot.sendMessage(receivedMsg.chat.id, '请回复一条消息以指定操作对象', opt)
                    .catch(e => console.log('send command warn ERROR:\n', e))
                return
            }

            // 通过被回复消息查询操作对象id
            mongo.Message.findOne({forwarded_message_id: receivedMsg.reply_to_message.message_id})
                .then(targetMsg => {
                    switch (receivedMsg.text) {
                        // 加入黑名单
                        case '!ban':
                            mongo.User.findOne({tg_id: targetMsg.from_id})
                                .then(async user => {
                                    user.updateOne({is_banned: true})
                                        .then(() => {
                                            bot.sendMessage(ENV.ME, `用户[${user.first_name}](tg://user?id=${user.tg_id}) 已加入黑名单，他的消息将不再会转发。\n\n如需取消封禁请对该用户的消息回复 \`!unban\``, opt)
                                                .catch(e => console.log('send command warn ERROR:\n', e))
                                        })
                                        .catch(e => console.log('add user to black list ERROR:\n', e))
                                })
                            break

                        // 移出黑名单
                        case '!unban':
                            mongo.User.findOne({tg_id: targetMsg.from_id})
                                .then(async user => {
                                    user.updateOne({is_banned: false})
                                        .then(() => {
                                            bot.sendMessage(ENV.ME, `用户[${user.first_name}](tg://user?id=${user.tg_id}) 已从黑名单移出`, opt)
                                                .catch(e => console.log('send command warn ERROR:\n', e))
                                        })
                                        .catch(e => console.log('remove user from black list ERROR:\n', e))
                                })
                            break

                        // 删除我的消息
                        case '!del':
                            bot.sendMessage(ENV.ME, `此命令还未完成`, opt)
                            break
                        default:
                            bot.sendMessage(receivedMsg.chat.id, '未找到命令', opt)
                                .catch(e => console.log('send command warn ERROR:\n', e))
                    }
                })
                .catch(e => bot.sendMessage(ENV.ME, `未找到操作对象，请检查回复对象是否正确`))
            return
        }
    }

    // 其他人发的非命令消息转发给自己
    if (receivedMsg.from.id !== ENV.ME) {
        bot.forwardMessage(ENV.ME, receivedMsg.chat.id, receivedMsg.message_id)
            .then(forwardedMsg => {
                new mongo.Message({
                    received_message_id: receivedMsg.message_id,
                    forwarded_message_id: forwardedMsg.message_id,
                    from_id: receivedMsg.from.id,
                    first_name: receivedMsg.from.first_name,
                    content: receivedMsg,
                }).save()
            })
            .catch(e => console.log('forward message ERROR:\n', e))
    }

    // 转发我回复的消息给对应用户
    if (receivedMsg.from.id === ENV.ME && receivedMsg.reply_to_message) {
        mongo.Message.findOne({forwarded_message_id: receivedMsg.reply_to_message.message_id})
            .then(metaData => {
                const chat_id = metaData.from_id

                if (receivedMsg.text) {
                    bot.sendMessage(chat_id, receivedMsg.text)
                        .then(() => ENV.NOTICE ? bot.sendMessage(ENV.ME, '消息回复成功') : null)
                        .catch(e => console.log('send message ERROR:\n', e))
                }

                if (receivedMsg.sticker) {
                    bot.sendSticker(chat_id, receivedMsg.sticker.file_id)
                        .then(() => ENV.NOTICE ? bot.sendMessage(ENV.ME, '消息回复成功') : null)
                        .catch(e => console.log('send sticker ERROR:\n', e))
                }

                if (receivedMsg.photo) {
                    const photoOpt = receivedMsg.caption ? {caption: receivedMsg.caption} : {}
                    bot.sendPhoto(chat_id, receivedMsg.photo[0].file_id, photoOpt)
                        .then(() => ENV.NOTICE ? bot.sendMessage(ENV.ME, '消息回复成功') : null)
                        .catch(e => console.log('send photo ERROR:\n', e))
                }

            })
            .catch(e => {
                console.log('find original message_id ERROR:\n', e)
                bot.sendMessage(ENV.ME, `未找到回复对象，请检查回复对象是否正确`)
            })
    }
})
