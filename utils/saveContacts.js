const logger = require("./logger");
const getDateTime = require("./getDateTime");

module.exports = async (reinbot, msg, participants, name) => {
  const setting = require("../setting.js");
  try {
    const bufferVcard = participants
      .map((part, index) => {
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\x20-\x20${
          index + 1
        }\nORG:${setting.name}\nTEL;type=CELL;type=VOICE;waid=${
          part.split("@")[0]
        }:+${part.split("@")[0]}\nEND:VCARD`;
      })
      .join("\n");
    return reinbot.sendMessage(
      msg.key.remoteJid,
      {
        document: Buffer.from(bufferVcard),
        fileName: "Contacts.vcf",
        caption: `*BOT BY AJO*\n\nSUCCES SAVE SILAHKAN PINDAHKAN KE KONTAK`,
        mimetype: "text/vcard",
      },
      { quoted: msg }
    );
  } catch (err) {
    logger(`error`, "SAVEKONTAK", err);
    return reinbot.sendMessage(
      msg.key.remoteJid,
      {
        text: `*BOT BY AJO*\nSAVE SUCCES`,
      },
      { quoted: msg }
    );
  }
};
