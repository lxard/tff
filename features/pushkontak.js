const Pino = require("pino");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

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
    case "pushkontakv1":
    case "pushv1":
    case "pushkontakuser":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!text) {
        logger(
          "error",
          "pushkontakuser",
          `Perintah salah contoh .pushkontakuser AJO tamvan ganti dengan text masing-masing`
        );
        return replyCommand(
          `Perintah salah contoh .pushkontakuser AJO tamvan ganti dengan text masing-masing`
        );
      }
      require("../utils/readUsers")()
        .then(async (res) => {
          if (!res.data || res.data.length === 0) {
            logger(
              "error",
              "PUSHKONTAKV1",
              `‼️\x20\x20\x1b[1mData pengguna ${
                res.data.length || 0
              }\n\x20\x20Dapatkan data pengguna lebih banyak!\n\x20\x20\x1b[1mTUTORIAL:\x1b[0m\x20${
                reinbot.tutorial.saveUsers
              }`
            );
            await replyCommand(
              `‼️\x20*Data pengguna ${
                res.data.length || 0
              }*\nDapatkan data pengguna lebih banyak!\n*TUTORIAL:*\x20${
                reinbot.tutorial.saveUsers
              }`
            );
            return;
          } else {
            await replyCommand(
              `*BOT BY AJO*\n\x20*PUSH KONTAK START*\n*Target:*\x20${res.data.length}\x20pengguna\n*Limit:*\x20${setting.features.pushContacts.limit}\n*Jeda:*\x20${setting.features.pushContacts.jeda}ms`
            );
            if (msgType === "imageMessage") {
              media = await downloadMediaMessage(
                msg,
                "buffer",
                {},
                { logger: Pino }
              );
              return require("../utils/pushContacts")(
                reinbot,
                msg,
                res.data,
                text,
                msgType,
                media
              );
            } else {
              return require("../utils/pushContacts")(
                reinbot,
                msg,
                res.data,
                text
              );
            }
          }
        })
        .catch(async (err) => {
          logger("error", "PUSHKONTAKV1", err);
          return replyCommand(err);
        });
      break;
    case "pushkontakv2":
    case "pushv2":
    case "pkv2":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!isGroup) {
        return onlyGroup();
      }
      try {
        if (!text) {
          logger(
            "error",
            "PUSHKONTAKV2",
            `‼️\x20\x20\x1b[1mPerintah kurang lengkap atau tidak valid\x1b[0m\n\x20\x20\x1b[1mContoh:\x1b[0m\x20.pkv2\x20Hello world\n\x20\x20\x1b[1mTUTORIAL:\x1b[0m\x20${reinbot.tutorial.pushContacts}`
          );
          return replyCommand(
            `‼️\x20*Perintah kurang lengkap atau tidak valid*\n*Contoh:*\x20.pkv2\x20Hello World\n*TUTORIAL:*\x20${reinbot.tutorial.pushContacts}`
          );
        } else {
          groupMetadata = await reinbot.groupMetadata(groupId);
          participants = groupMetadata.participants.map((part) => part.id);
          await replyCommand(
            `🎉\x20\x20*PUSH KONTAK START*\n*Nama group:*\x20${
              groupMetadata.subject
            }\n*Owner:*\x20${
              groupMetadata.owner?.split("@")[0]
            }\n*Target:*\x20${participants.length}\x20pengguna\n*Limit:*\x20${
              setting.features.pushContacts.limit
            }\n*Jeda:*\x20${setting.features.pushContacts.jeda}ms`
          );
          if (msgType === "imageMessage") {
            media = await downloadMediaMessage(
              msg,
              "buffer",
              {},
              { logger: Pino }
            );
            return require("../utils/pushContacts")(
              reinbot,
              msg,
              participants,
              text,
              msgType,
              media
            );
          } else {
            return require("../utils/pushContacts")(
              reinbot,
              msg,
              participants,
              text
            );
          }
        }
      } catch (err) {
        logger("error", "PUSHKONTAKV2", err);
        replyCommand();
      }
      break;
    case "pushkontakv3":
    case "pushv3":
    case "pushkontakid":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      try {
        if (!text || !text.split("|")[0] || !text.split("|")[1]) {
          logger(
            "error",
            "pushkontakid",
            `Perintah salah contoh .pushkontakid id|AJO tamvan ganti dengan text masing-masing`
          );
          return replyCommand(
            `Perintah salah contoh .pushkontakid id|AJO tamvan ganti dengan text masing-masing`
          );
        } else {
          if (text.split("|")[0].endsWith("@g.us")) {
            groupMetadata = await reinbot.groupMetadata(text.split("|")[0]);
          } else {
            groupMetadata = await reinbot.groupMetadata(
              `${text.split("|")[0]}@g.us`
            );
          }
          participants = groupMetadata.participants.map((part) => part.id);
          await replyCommand(
            `*BOT BY AJO*\n\x20*PUSH KONTAK START*\n*Nama group:*\x20${
              groupMetadata.subject
            }\n*Owner:*\x20${
              groupMetadata.owner?.split("@")[0]
            }\n*Target:*\x20${participants.length}\x20pengguna\n*Limit:*\x20${
              setting.features.pushContacts.limit
            }\n*Jeda:*\x20${setting.features.pushContacts.jeda}ms`
          );
          if (msgType === "imageMessage") {
            media = await downloadMediaMessage(
              msg,
              "buffer",
              {},
              { logger: Pino }
            );
            return require("../utils/pushContacts")(
              reinbot,
              msg,
              participants,
              text.split("|")[1],
              msgType,
              media
            );
          } else {
            return require("../utils/pushContacts")(
              reinbot,
              msg,
              participants,
              text.split("|")[1]
            );
          }
        }
      } catch (err) {
        logger("error", "PUSHKONTAKV3", err);
        replyCommand();
      }
      break;
  }
};
