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
  const loop = setInterval(async () => {
    if (
      index >= participants.length ||
      index >= setting.features.broadcast.limit
    ) {
      logger(
        "primary",
        "BROADCAST",
        `*BOT BY AJO*\nINFO BOT SUDAH MELAKUKAN TUGAS BROADCAST BANG THOMZ`
      );
      await reinbot.sendMessage(
        msg.key.remoteJid,
        {
          text: `*BOT BY AJO\x20ヅ*\x20|\x20*BROADCAST*\n\n🎉\x20*BROADCAST BERHASIL*\n*Pesan telah berhasil dikirim ke ${index} pengguna*\x20🔥\n`,
        },
        { quoted: msg }
      );
      return clearInterval(loop);
    } else {
      try {
        if (msgType === "imageMessage") {
          const outputImage = join(__dirname, "../data/bc.jpeg");
          await writeFile(outputImage, media);
          await reinbot.sendMessage(participants[index], {
            image: { url: outputImage },
            caption: text,
          });
          logger(
            "success",
            `BROADCAST ${index + 1}`,
            `\x1b[1mPesan telah berhasil dikirim ke ${
              participants[index].split("@")[0]
            }\x1b[0m`
          );
          data = data.filter((user) => user != participants[index]);
          writeFileSync(
            join(__dirname, "../data/users.json"),
            JSON.stringify(data)
          );
          index++;
        } else {
          await reinbot.sendMessage(participants[index], { text: text });
          logger(
            "success",
            `BROADCAST ${index + 1}`,
            `\x1b[1mPesan telah berhasil dikirim ke ${
              participants[index].split("@")[0]
            }\x1b[0m`
          );
          data = data.filter((user) => user != participants[index]);
          writeFileSync(
            join(__dirname, "../data/users.json"),
            JSON.stringify(data)
          );
          index++;
        }
      } catch (err) {
        logger("error", "BROADCAST", err);
        logger(
          "error",
          `BROADCAST ${index + 1}`,
          `\x1b[1mPesan gagal dikirim ke ${
            participants[index].split("@")[0]
          }\x1b[0m`
        );
        if (err === "Connection Closed") {
          process.exit();
        }
      }
    }
  }, setting.features.broadcast.jeda);
};
