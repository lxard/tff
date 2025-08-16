
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const { exec } = require("child_process");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const logger = require("../utils/logger.js");
const getDateTime = require("../utils/getDateTime.js");
const setting = require("../setting.js");

const afkPath = path.join(__dirname, "../data/afk.json");
let afkData = {};
try {
  afkData = JSON.parse(fs.readFileSync(afkPath));
} catch {
  afkData = {};
}

const poinPath = path.join(__dirname, "../data/poin.json");
let poinData = {};
try {
  if (fs.existsSync(poinPath)) {
    poinData = JSON.parse(fs.readFileSync(poinPath));
  }
} catch {
  poinData = {};
}

let dbCreateWeb = {};

module.exports = async (reinbot, m) => {
  const msg = m.messages[0];
  if (!msg.message || (msg.key && msg.key.remoteJid === "status@broadcast") || msg.broadcast) return;

  const id = msg.key.remoteJid;
  const isGroup = id.endsWith(".us");
  const userId = isGroup ? msg.key.participant : id;
  const isMe = msg.key.fromMe;
  const isOwner = userId === setting.owner.whatsapp;

  if (setting.features.selfMode && !isMe) return;

  const msgType = Object.keys(msg.message)[0];
  const msgText =
    msgType === "conversation" ? msg.message.conversation :
    msgType === "extendedTextMessage" ? msg.message.extendedTextMessage.text :
    msgType === "videoMessage" ? msg.message.videoMessage.caption :
    msgType === "imageMessage" ? msg.message.imageMessage.caption :
    msgType === "listResponseMessage" ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : "";

  // === LOG CHAT GRUP ===
  try {
    const logPath = path.join(__dirname, "../data/logchat.json");
    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, JSON.stringify({ active: false, logs: [] }, null, 2));
    }

    const db = JSON.parse(fs.readFileSync(logPath));

    if (db.active && isGroup) {
      const logText =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        msg.message?.documentMessage?.caption ||
        "📎 [Media atau sistem]";

      db.logs.push({
        group: id,
        user: userId,
        name: msg.pushName || "-",
        message: logText,
        time: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
      });

      fs.writeFileSync(logPath, JSON.stringify(db, null, 2));
    }
  } catch (e) {
    console.error("❌ Gagal menyimpan log chat:", e);
  }

  let command = "";
  let args = [];

  if (msgType === "listResponseMessage") {
    command = msg.message.listResponseMessage.singleSelectReply.selectedRowId;
  } else {
    if (!msgText.startsWith(".")) return;

    const input = msgText.slice(1).trim().split(/\s+/);
    command = input[0].toLowerCase();
    args = input.slice(1);
  }

  const text = msgText.replace(/.(.+?)\s*\b/i, "");

  function logCommand() { logger("info", "COMMAND", command); }
  async function reply(t) { await reinbot.sendMessage(id, { text: t }, { quoted: msg }); }
  async function replyCommand(t) { await reinbot.sendMessage(id, { text: `*${command.toUpperCase()}*\n\n${t}` }, { quoted: msg }); }

  // 🔧 CREATEWEB
  if (command === "createweb") {
    const nama = args.join(" ").trim();
    if (!nama) return replyCommand("❌ Format salah.\nContoh: .createweb mycoolsite");

    dbCreateWeb[userId] = nama;
    return replyCommand(`✅ Nama situs *${nama}* disimpan!\nSilakan kirim file *.html* atau *.zip*\nGunakan perintah: .createweb ${nama}`);
  }

  // 📂 PROSES FILE HTML/ZIP
  if (msg.message.documentMessage && dbCreateWeb[userId]) {
    const nama = dbCreateWeb[userId];
    const mime = msg.message.documentMessage.mimetype;
    const ext = mime.includes("zip") ? ".zip" : mime.includes("html") ? ".html" : null;
    if (!ext) return replyCommand("❌ Format file harus .html atau .zip");

    const dir = path.join(__dirname, "../temp", nama);
    fs.mkdirSync(dir, { recursive: true });

    const stream = await downloadContentFromMessage(msg.message.documentMessage, "document");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const filePath = path.join(dir, `upload${ext}`);
    fs.writeFileSync(filePath, buffer);

    if (ext === ".zip") {
      try {
        await fs.createReadStream(filePath).pipe(unzipper.Extract({ path: dir })).promise();
      } catch (e) {
        console.error("❌ Error unzip:", e);
        return replyCommand("❌ Gagal mengekstrak file ZIP.");
      }
    }

    await replyCommand("🚀 Deploying ke Vercel...");

    exec(`vercel --prod ${dir} --name ${nama} --token ${setting.vercelToken} --yes`, (err, stdout, stderr) => {
      console.log("📤 VER Output:\n", stdout);
      console.error("📛 VER Error:\n", stderr);

      if (err) {
        return replyCommand("❌ Gagal deploy ke Vercel. Coba cek token atau isi file.");
      }

      const url = stdout.match(/https:\/\/[^\s]+\.vercel\.app/)?.[0];
      if (url) {
        reinbot.sendMessage(id, {
          text: `✅ Website berhasil dibuat!\n🌐 URL: ${url}`
        }, { quoted: msg });
      } else {
        replyCommand("✅ Deploy selesai, tapi URL tidak ditemukan.\nCek log terminal atau dashboard Vercel.");
      }
    });

    return;
  }

  // 🧩 Panggil case handler
  require("../case")(reinbot, msg, id, null, isGroup, userId, id, isMe, isOwner, msgType, msgText, command, text, logCommand, reply, replyCommand, () => {}, () => {}, setting, args, afkData, afkPath,poinData);
};