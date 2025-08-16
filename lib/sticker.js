const { writeFileSync } = require("fs");
const path = require("path");
const { default: axios } = require("axios");

async function makeSticker(reinbot, msg, quoted) {
  try {
    const mime = (quoted.msg || quoted).mimetype || "";
    if (!mime.includes("image")) {
      return await reinbot.sendMessage(msg.key.remoteJid, { text: "❌ Mohon balas gambar untuk dijadikan sticker." }, { quoted: msg });
    }

    const buffer = await reinbot.downloadMediaMessage(quoted);

    await reinbot.sendMessage(msg.key.remoteJid, {
      sticker: buffer,
      packname: "FAFNIR Stickers",
      author: "Made by Xyz"
    }, { quoted: msg });

  } catch (e) {
    console.error(e);
    await reinbot.sendMessage(msg.key.remoteJid, { text: `❌ Gagal membuat sticker:\n${e.message}` }, { quoted: msg });
  }
}

module.exports = makeSticker;
