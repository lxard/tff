const getDateTime = require("../utils/getDateTime");

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
    case "save":
    case "sv":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (isGroup) {
        logger(
          "error",
          "SAVE",
          "KHUSUS CHAT PRIVATE BANG AJO"
        );
        return replyCommand(
          `KHUSUS CHAT PRIVATE BANG AJO`
        );
      } else {
        try {
          if (!text) {
            logger(
              "error",
              "SAVE",
              "Command salah contohnya .save AJO atau nama bebas setelah itu akan di kirim kontak"
            );
            return replyCommand(
              `Command salah contohnya .save AJO atau nama bebas setelah itu akan di kirim kontak`
            );
          }
          const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${text}\nORG:${
            setting.name
          }\nTEL;type=CELL;type=VOICE;waid=${userId.split("@")[0]}:+${
            userId.split("@")[0]
          }\nEND:VCARD`;
          const res = await reinbot.sendMessage(
            id,
            {
              contacts: {
                displayName: text,
                contacts: [{ vcard }],
              },
            },
            { quoted: msg }
          );
          return reinbot.sendMessage(
            userId,
            {
              text: `*BOT BY AJO*
*DONE NOMER MU UDAH KU SAVE*

*JANGAN LUPA SAVE BACK NOMER INI*
*BOT BY AJO-BOTZZ*

*TERIMA KASIH ORANG BAIK*`,
            },
            { quoted: res }
          );
        } catch (err) {
          logger("error", "SAVE", err);
          replyCommand(err);
        }
      }
      break;
    case "showcontacts":
    case "showcontact":
    case "sct":
    case "showkontak":
    case "skt":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      try {
        return replyCommand(
          `‼️\x20\x20*FITUR INI MASIH DALAM TAHAP PENGEMBANGAN*`
        );
      } catch (err) {
        logger("error", "CONTACTS", err);
        replyCommand(err);
      }
      break;
    case "savecontactsv1":
    case "savecontactv1":
    case "savekontakuser":
    case "skv1":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!text) {
        logger(
          "error",
          "savekontakuser",
          `command yang anda masukan salah contohnya .savekontakuser AJO ganti nama kalian untuk merubah nama save`
        );
        return replyCommand(
          `command yang anda masukan salah contohnya .savekontakuser AJO ganti nama kalian untuk merubah nama save`
        );
      }
      require("../utils/readUsers")()
        .then(async (res) => {
          if (!res.data || res.data.length === 0) {
            logger(
              "error",
              "SAVEKONTAKV1",
              `‼️\x20\x20\x1b[1mData pengguna ${
                res.data.length || 0
              }\n\x20\x20Dapatkan data pengguna lebih banyak!\n\x20\x20\x1b[1mTUTORIAL:\x1b[0m\x20`
            );
            return replyCommand(
              `‼️\x20*Data pengguna ${
                res.data.length || 0
              }*\nDapatkan data pengguna lebih banyak!\n*TUTORIAL:*\x20`
            );
          }
          await replyCommand(
            `BOT BY AJO\n\x20*SAVE KONTAK START*\n*Target:*\x20${res.data.length}\x20pengguna`
          );
          return require("../utils/saveContacts")(reinbot, msg, res.data, text);
        })
        .catch(async (err) => {
          logger("error", "PUSHKONTAKV1", err);
          return replyCommand(err);
        });
      break;
    case "savecontactsv2":
    case "savecontactv2":
    case "savekontakgc":
    case "skv2":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!isGroup) {
        return onlyGroup();
      }
      if (!text) {
        logger(
          "error",
          "savekontakgc",
          `command yang anda masukan salah contohnya .savekontakgc AJO ganti nama kalian untuk merubah nama save`
        );
        return replyCommand(
          `command yang anda masukan salah contohnya .savekontakgc AJO ganti nama kalian untuk merubah nama save`
        );
      }
      try {
        groupMetadata = await reinbot.groupMetadata(groupId);
        participants = groupMetadata.participants.map((part) => part.id);
        await replyCommand(
          `*BOT BY AJO*\n\x20*SAVE KONTAK START*\n*Nama group:*\x20${
            groupMetadata.subject
          }\n*Owner:*\x20${groupMetadata.owner?.split("@")[0]}\n*Target:*\x20${
            participants.length
          }\x20pengguna`
        );
        return require("../utils/saveContacts")(
          reinbot,
          msg,
          participants,
          text
        );
      } catch (err) {
        logger("error", "SAVEKONTAKV2", err);
        replyCommand(err);
      }
      break;
    case "savecontactsv3":
    case "savecontactv3":
    case "savekontakid":
    case "skv3":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!text || !text.split("|")[0] || !text.split("|")[1]) {
        logger(
          "error",
          "savekontakid",
          `command yang anda masukan salah contohnya .savekontakid id|AJO ganti nama kalian untuk merubah nama save`
        );
        return replyCommand(
          `command yang anda masukan salah contohnya .savekontakid id|AJO ganti nama kalian untuk merubah nama save`
        );
      }
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
          `*BOT BY AJO*\n\x20*SAVE KONTAK START*\n*Nama group:*\x20${
            groupMetadata.subject
          }\n*Owner:*\x20${groupMetadata.owner?.split("@")[0]}\n*Target:*\x20${
            participants.length
          }\x20pengguna`
        );
        return require("../utils/saveContacts")(
          reinbot,
          msg,
          participants,
          text.split("|")[1]
        );
      } catch (err) {
        logger("error", "SAVEKONTAKV3", err);
        replyCommand(err);
      }
      break;
  }
};
