const logger = require("./logger");
const readUsers = require("./readUsers");
const getDateTime = require("./getDateTime");
const { writeFileSync } = require("fs");
const { writeFile } = require("fs/promises");
const { join } = require("path");

module.exports = async (reinbot, msg, participants, text, msgType, media) => {
  const setting = require("../setting.js");
  let { data } = await readUsers();
  let index = 0;

  const sendMessage = async () => {
    try {
      if (msgType === "imageMessage") {
        const outputImage = join(__dirname, "../data/pk.jpeg");
        await writeFile(outputImage, media);
        await reinbot.sendMessage(participants[index], {
          image: { url: outputImage },
          caption: text,
        });
        logger(
          "success",
          `PUSHKONTAK ${index + 1}`,
          `\x1b[1mPesan telah berhasil dikirim ke ${
            participants[index].split("@")[0]
          }\x1b[0m`
        );
      } else {
        await reinbot.sendMessage(participants[index], { text: text });
        logger(
          "success",
          `PUSHKONTAK ${index + 1}`,
          `\x1b[1mPesan telah berhasil dikirim ke ${
            participants[index].split("@")[0]
          }\x1b[0m`
        );
      }
    } catch (err) {
      logger("error", "PUSHKONTAK", err);
      logger(
        "error",
        `PUSHKONTAK ${index + 1}`,
        `\x1b[1mPesan gagal dikirim ke ${
          participants[index].split("@")[0]
        }\x1b[0m`
      );
      if (err === "Connection Closed") {
        process.exit();
      }
    }

    data = data.filter((user) => user != participants[index]);
    writeFileSync(join(__dirname, "../data/users.json"), JSON.stringify(data));
    index++;

    const loopSendMessage = setTimeout(() => {
      sendMessage();
    }, setting.features.pushContacts.jeda);

    if (
      index >= participants.length ||
      index >= setting.features.pushContacts.limit
    ) {
      clearTimeout(loopSendMessage);
      logger(
        "primary",
        "PUSHKONTAK",
        `*BOT BY AJO*\n\x20\x20\x1b[1mPUSH KONTAK BERHASIL\x1b[0m\n\x20\x20\x1b[1mPesan telah berhasil dikirim ke ${index} pengguna\x1b[0m\x20🔥`
      );
      return reinbot.sendMessage(
        msg.key.remoteJid,
        {
          text: `*BOT BY AJO\x20ヅ*\x20|\x20*PUSH KONTAK*\n\n🎉\x20*PUSH KONTAK BERHASIL BANG AJO*\n*Pesan telah berhasil dikirim ke ${index} pengguna*\x20🔥\n`,
        },
        { quoted: msg }
      );
    }
  };
  sendMessage();
};
