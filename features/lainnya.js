const Pino = require("pino");
const {
  downloadMediaMessage,
  downloadContentFromMessage,
} = require("@whiskeysockets/baileys");

module.exports = async (
  reinbot,
  msg,
  id,
  media,
  isGroup,
  userId,
  groupId,
  isMe,
  isOwner,
  msgType,
  msgText,
  command,
  text,
  logCommand,
  reply,
  replyCommand,
  onlyOwner,
  onlyGroup,
  setting,
  groupMetadata,
  participants,
  logger
) => {
  switch (command) {
    case "others":
    case "other":
    case "lainnya":
    case "lain":
      logCommand();
      try {
        return replyCommand(
          `SEPERTINYA ANDA MEMASUKAN COMMAND YANG SALAH GUNAKAN COMMAND .menu UNTUK MEMULAI`
        );
      } catch (err) {
        logger("error", "LAINNYA", err);
        replyCommand(err);
      }
      break;
    case "sticker":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      try {
        if (msgType === "imageMessage") {
          media = await downloadMediaMessage(
            msg,
            "buffer",
            {},
            { logger: Pino }
          );
          return require("../utils/createSticker")(reinbot, msg, media);
        }
        if (
          msgType === "extendedTextMessage" &&
          msg.message.extendedTextMessage.contextInfo.quotedMessage
        ) {
          const quotedMessageType = Object.keys(
            msg.message.extendedTextMessage.contextInfo.quotedMessage
          )[0];
          if (quotedMessageType === "imageMessage") {
            const mMediaKey =
              msg.message.extendedTextMessage.contextInfo.quotedMessage
                .imageMessage.mediaKey;
            const mDirectPath =
              msg.message.extendedTextMessage.contextInfo.quotedMessage
                .imageMessage.directPath;
            const mUrl =
              msg.message.extendedTextMessage.contextInfo.quotedMessage
                .imageMessage.url;
            console.log(msg.message.extendedTextMessage.contextInfo);
            const stream = await downloadContentFromMessage(
              {
                mediaKey: mMediaKey,
                directPath: mDirectPath,
                url: mUrl,
              },
              "image",
              {}
            );
            return;
          }
        }
      } catch (err) {
        logger("error", "STICKER", err);
        replyCommand(err);
      }
      break;
    case "reload":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      try {
        await replyCommand("Reloading server...");
        const pm2 = require("pm2");
        pm2.reload("reinbot", (err) => {
          if (err) {
            logger("error", "RESTART", err);
            replyCommand(err);
          }
        });
      } catch (err) {
        logger("error", "RESTART", err);
        replyCommand(err);
      }
      break;
    case "stop":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      try {
        await replyCommand("Stopping server...");
        const pm2 = require("pm2");
        pm2.stop("reinbot", (err) => {
          if (err) {
            logger("error", "STOP", err);
            replyCommand(err);
            process.exit();
          }
        });
      } catch (err) {
        logger("error", "STOP", err);
        replyCommand(err);
        process.exit();
      }
      break;
  }
};
