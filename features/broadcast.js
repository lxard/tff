const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const Pino = require("pino");

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
    case "broadcastsv1":
    case "broadcastv1":
    case "broadcastuser":
      logCommand();
      if (!isMe && !isOwner) {
        return replyCommand();
      }
      if (!text) {
        logger(
          "error",
          "broadcastuser",
          `Perintah salah contoh .broadcastuser AJO tamvan ganti dengan text masing-masing`
        );
        return replyCommand(
          `Perintah salah contoh .broadcastuser AJO tamvan ganti dengan text masing-masing`
        );
      }
      require("../utils/readUsers")()
        .then(async (res) => {
          if (!res.data || res.data.length === 0) {
            logger(
              "error",
              "BROADCASTV1",
              `‼️\x20\x20\x1b[1mData pengguna ${
                res.data.length || 0
              }\n\x20\x20Dapatkan data pengguna lebih banyak!\n\x20\x20\x1b[1mTUTORIAL:\x1b[0m\x20$
              }`
            );
            return replyCommand(
              `‼️\x20*Data pengguna ${
                res.data.length || 0
              }*\nDapatkan data pengguna lebih banyak!\n*TUTORIAL:*\x20$
              }`
            );
          } else {
            await replyCommand(
              `*BOT BY AJO*\n\x20*BROADCAST START*\n*Target:*\x20${res.data.length}\x20pengguna\n*Limit:*\x20${setting.features.broadcast.limit}\n*Jeda:*\x20${setting.features.broadcast.jeda}ms`
            );
            if (msgType === "imageMessage") {
              media = await downloadMediaMessage(
                msg,
                "buffer",
                {},
                { logger: Pino }
              );
              return require("../utils/broadcast")(
                reinbot,
                msg,
                res.data,
                text,
                msgType,
                media
              );
            } else {
              return require("../utils/broadcast")(
                reinbot,
                msg,
                res.data,
                text
              );
            }
          }
        })
        .catch(async (err) => {
          logger("error", "BROADCASTV1", err);
          replyCommand(err);
        });
      break;
    case "broadcastsv2":
    case "broadcastv2":
    case "broadcastgc":
      logCommand();
      if (!isMe && !isOwner) {
        return replyCommand();
      }
      if (!isGroup) {
        return onlyGroup();
      } else {
        if (!text) {
          logger(
            "error",
            "broadcastgc",
            `Perintah salah contoh .broadcastgc ajo ganteng ganti dengan text masing-masing`
          );
          return replyCommand(
            `Perintah salah contoh .broadcasgc ajo ganteng ganti dengan text masing-masing`
          );
        }
        try {
          groupMetadata = await reinbot.groupMetadata(groupId);
          participants = groupMetadata.participants.map((part) => part.id);
          await replyCommand(
            `*BOT BY AJO*\n\x20\x20*BROADCAST START*\n*Nama group:*\x20${
              groupMetadata.subject
            }\n*Owner:*\x20${
              groupMetadata.owner?.split("@")[0]
            }\n*Target:*\x20${participants.length}\x20pengguna\n*Limit:*\x20${
              setting.features.broadcast.limit
            }\n*Jeda:*\x20${setting.features.broadcast.jeda}ms`
          );
          if (msgType === "imageMessage") {
            media = await downloadMediaMessage(
              msg,
              "buffer",
              {},
              { logger: Pino }
            );
            return require("../utils/broadcast")(
              reinbot,
              msg,
              participants,
              text,
              msgType,
              media
            );
          } else {
            return require("../utils/broadcast")(
              reinbot,
              msg,
              participants,
              text
            );
          }
        } catch (err) {
          logger("error", "BROADCASTV2", err);
          replyCommand(err);
        }
      }
      break;
    case "broadcastsv3":
    case "broadcastv3":
    case "broadcastid":
      logCommand();
      if (!isMe && !isOwner) {
        return replyCommand();
      }
      if (!text || !text.split("|")[0] || !text.split("|")[1]) {
        logger(
          "error",
          "broadcastid",
          `Perintah salah contoh .broadcastid id|ajo ganteng ganti dengan text masing-masing`
        );
        return replyCommand(
          `Perintah salah contoh .broadcastid id|ajo ganteng ganti dengan text masing-masing`
        );
      } else {
        try {
          if (text.split("|")[0].endsWith("@g.us")) {
            groupMetadata = await reinbot.groupMetadata(text.split("|")[0]);
          } else {
            groupMetadata = await reinbot.groupMetadata(
              `${text.split("|")[0]}@g.us`
            );
          }
          participants = groupMetadata.participants.map((part) => part.id);
          await replyCommand(
            `*BOT BY AJO*\n\x20\x20*BROADCAST START*\n*Nama group:*\x20${
              groupMetadata.subject
            }\n*Owner:*\x20${
              groupMetadata.owner?.split("@")[0]
            }\n*Target:*\x20${participants.length}\x20pengguna\n*Limit:*\x20${
              setting.features.broadcast.limit
            }\n*Jeda:*\x20${setting.features.broadcast.jeda}ms`
          );
          if (msgType === "imageMessage") {
            media = await downloadMediaMessage(
              msg,
              "buffer",
              {},
              { logger: Pino }
            );
            return require("../utils/broadcast")(
              reinbot,
              msg,
              participants,
              text.split("|")[1],
              msgType,
              media
            );
          } else {
            return require("../utils/broadcast")(
              reinbot,
              msg,
              participants,
              text.split("|")[1]
            );
          }
        } catch (err) {
          logger("error", "BROADCASTV3", err);
          replyCommand(err);
        }
      }
      break;
  }
};
