const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");
const getDateTime = require("./utils/getDateTime");
const { tambahProduk, getKategori, getProdukByKategori } = require("./utils/store");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");
const { fromBuffer } = require("file-type");
const { exec } = require("child_process");
const { jidDecode } = require("@whiskeysockets/baileys");
const unzipper = require("unzipper"); // ✅ untuk ekstrak file ZIP

// Optional: database sementara untuk fitur createweb
let dbCreateWeb = {}; // Bisa diubah pakai file JSON kalau perlu
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
   args,
    afkData,      // ✅ tambahkan ini
    afkPath,
    poinData
) => {
  const from = msg.key.remoteJid
  const sender = msg.key.fromMe ? (reinbot.user.id.split(':')[0]+'@s.whatsapp.net' || reinbot.user.id) : (msg.key.participant || msg.key.remoteJid)
  let groupMetadata;
  let participants;
  switch (command) {
case "menu": {
  try {
    const currentTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const senderNumber = sender.split("@")[0];
    const imagePath = path.join(__dirname, "data", "elaina.jpg");

    if (!fs.existsSync(imagePath)) {
      throw new Error("Gambar 'elaina.jpg' tidak ditemukan di folder ./data");
    }

    const imageBuffer = fs.readFileSync(imagePath);

    const caption = `Hai Kak @${senderNumber}

*㊂ ᴄʀᴇᴀᴛᴏʀ sᴄʀɪᴘᴛ : FAFNIR*
*㊂ ʙᴏᴛ ɴᴀᴍᴇ       : FAFNIR*
*㊂ ᴏᴡɴᴇʀ          : 6283895079009*
*㊂ ᴘᴀʀᴛɴᴇʀ        : XYZ | Sfa*
*🎨 ᴄʀᴇᴅɪᴛ         : CNS & COTE*
*⏰ ᴡᴀᴋᴛᴜ          : ${currentTime}*

*⚙️ ᴍᴇɴᴜ ᴜᴍᴜᴍ*
𖡎 .userinfo
𖡎 .anime
𖡎 .manga
𖡎 .download <url>
𖡎 .ttmp3 <url tiktok>
𖡎 .ytmp3 <link YouTube>
𖡎 .owner

*🖼️ ɢᴀᴍʙᴀʀ*
𖡎 .randomwaifu
𖡎 .ppcouple

*👥 ᴍᴇɴᴜ ɢʀᴏᴜᴘ*
𖡎 .tagall
𖡎 .kick <@tag> 
𖡎 .add <nomor> 
𖡎 .promote <@tag>
𖡎 .warn <@tag>
𖡎 .unwarn <@tag>
𖡎 .mute <@tag>
𖡎 .unmute <@tag>
𖡎 .report <@tag>
𖡎 .report18+ <@tag>
𖡎 .gcopen
𖡎 .gcclose

*👤 ᴏᴛʜᴇʀs*
𖡎 .afk <alasan>
𖡎 .setwelcome <pesan>
𖡎 .sticker <media>
𖡎 .toimg <stiker>
𖡎 .tourl <media>
𖡎 .getpp <@user>

*🌐 ᴡᴇʙsɪᴛᴇ*
https://nhentai

*📝 Note:*
𖡎 Fitur *add member* sedang dalam perbaikan  
𖡎 Fitur *anime & manga* sedang dalam uji coba  
𖡎 Fitur *ppcouple* masih dalam pengembangan  
𖡎 Jika terjadi error, segera hubungi *owner*!`;

    await reinbot.sendMessage(from, {
      text: caption,
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          title: "COTE BOT MENU",
          body: "By FAFNIR",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://RIKKA🥰"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error kirim menu:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal menampilkan menu FAFNIR. Pastikan gambar *elaina.jpg* ada di folder *./data* dan tidak rusak.",
    }, { quoted: msg });
  }

  break;
}
//===================================================================
case 'claim': {
  const { claimReward } = require('./utils/claim');
  const result = claimReward(sender);

  if (result.success) {
    reply(`🎉 Kamu berhasil klaim harian!\n+100 Poin\nTotal Poin: ${result.poin}`);
  } else {
    const ms = result.wait;
    const jam = Math.floor(ms / (1000 * 60 * 60));
    const menit = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((ms % (1000 * 60)) / 1000);
    reply(`⏳ Kamu sudah klaim hari ini.\nCoba lagi dalam ${jam} jam ${menit} menit ${detik} detik.`);
  }
}
break;
case "shop": {
  let shopData = { items: [] };
  try {
    const file = fs.readFileSync(path.join(__dirname, "data","shop.json"));
    shopData = JSON.parse(file);
  } catch (e) {
    return balas("❌ Gagal memuat data shop.");
  }

  if (!shopData.items.length) return balas("📦 Tidak ada produk tersedia di toko.");

  let teks = `🛒 *SHOP - Toko Poin*\n\n`;
  shopData.items.forEach((item, index) => {
    teks += `🔹 *${item.name}*\n📦 ID: ${item.id}\n💰 Harga: ${item.price.toLocaleString()} poin\n\n`;
  });
  teks += `Ketik *.buy <id>* untuk membeli.\nContoh: *.buy am_prem_1th*`;

  await reinbot.sendMessage(from, { text: teks }, { quoted: msg });
  break;
}
case "buy": {
  if (!args[0]) return await reply("❌ Masukkan ID produk yang ingin dibeli.\nContoh: .buy am_prem_1th");
  const idProduk = args[0].toLowerCase();

  // Baca data shop
  let shopData = { items: [] };
  try {
    const file = fs.readFileSync(path.join(__dirname, "data", "shop.json"));
    shopData = JSON.parse(file);
  } catch {
    return await reply("❌ Gagal memuat data toko.");
  }

  const item = shopData.items.find(p => p.id === idProduk);
  if (!item) return await reply("❌ Produk tidak ditemukan.");

  // Baca poin user
  const poinPath = path.join(__dirname, "data", "poin.json");
  let poinData = {};
  try {
    poinData = JSON.parse(fs.readFileSync(poinPath));
  } catch {}

  const saldo = poinData[sender] || 0;
  if (saldo < item.price) {
    return await reply(`❌ Poin kamu tidak cukup.\nSaldo: ${saldo} Poin\nHarga: ${item.price} Poin`);
  }

  // Kurangi poin
  poinData[sender] -= item.price;
  fs.writeFileSync(poinPath, JSON.stringify(poinData, null, 2));

  // Kirim notifikasi ke user
  await reply(`✅ Pembelian berhasil!\nKamu membeli: *${item.name}*\n💰 Sisa Poin: ${poinData[sender]} Poin`);

  // Kirim notifikasi ke admin
  const adminJid = "6285921967820@s.whatsapp.net";
  const userNomor = sender.split("@")[0];
  const notifText = `📩 *Pembelian Baru*\n👤 User: wa.me/${userNomor}\n🛒 Produk: ${item.name}`;

  await reinbot.sendMessage(adminJid, { text: notifText });

  break;
}
          //===========================================================
 case "logchat": {
  try {
    const logPath = path.join(__dirname, "data", "logchat.json");

    // Buat file log jika belum ada
    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, JSON.stringify({ active: false, logs: [] }, null, 2));
    }

    const db = JSON.parse(fs.readFileSync(logPath));
    const opsi = args[0]?.toLowerCase();

    if (opsi === "on") {
      db.active = true;
      fs.writeFileSync(logPath, JSON.stringify(db, null, 2));
      await reinbot.sendMessage(from, { text: "✅ Log chat grup telah *diaktifkan*." }, { quoted: msg });
    } else if (opsi === "off") {
      db.active = false;
      fs.writeFileSync(logPath, JSON.stringify(db, null, 2));
      await reinbot.sendMessage(from, { text: "❌ Log chat grup telah *dimatikan*." }, { quoted: msg });
    } else {
      await reinbot.sendMessage(from, { text: "ℹ️ Gunakan:\n• `.logchat on`\n• `.logchat off`" }, { quoted: msg });
    }
  } catch (err) {
    console.error("❌ Error di perintah logchat:", err);
    await reinbot.sendMessage(from, { text: "⚠️ Terjadi kesalahan saat mengatur log chat." }, { quoted: msg });
  }
  break;

case "logget": {
  const logPath = path.join(__dirname, "data","logchat.json");

  if (!fs.existsSync(logPath)) {
    return reinbot.sendMessage(from, { text: "❌ Belum ada log chat tersimpan." }, { quoted: msg });
  }

  const db = JSON.parse(fs.readFileSync(logPath));
  const logs = db.logs;

  if (!logs || logs.length === 0) {
    return reinbot.sendMessage(from, { text: "📭 Log chat masih kosong." }, { quoted: msg });
  

  // Ambil 10 log terakhir
  const recent = logs.slice(-10).reverse();
  let logText = "📑 *10 Log Chat Terakhir:*\n\n";

  for (let i = 0; i < recent.length; i++) {
    const log = recent[i];
    logText += `🔹 *${log.name || "-"}*\n📱 ${log.user}\n💬 ${log.message}\n🕒 ${log.time}\n\n`;
  

  await reinbot.sendMessage(from, { text: logText.trim() }, { quoted: msg });
  break;
}
case "logclear": {
  try {
    const logPath = path.join(__dirname, "data", "logchat.json");

    if (!fs.existsSync(logPath)) {
      return await reinbot.sendMessage(from, { text: "⚠️ File log belum ada." }, { quoted: msg });
    

    const db = JSON.parse(fs.readFileSync(logPath));
    db.logs = [];

    fs.writeFileSync(logPath, JSON.stringify(db, null, 2));
    await reinbot.sendMessage(from, { text: "🗑️ Semua log chat berhasil dihapus!" }, { quoted: msg });
  } catch (err) {
    console.error("❌ Gagal menghapus log:", err);
    await reinbot.sendMessage(from, { text: "❌ Gagal menghapus log chat." }, { quoted: msg });
  }
  break;

//============================================================
          case "intro": {
  const listIntro = `🎬 *DAFTAR INTRO COTE FAMILY*\n
Silakan pilih salah satu:
1. .intro1
2. .intro2
3. .intro3

Ketik perintah sesuai angka di atas.`;
  
  await reinbot.sendMessage(from, {
    text: listIntro
  }, { quoted: msg });

  break;

case "intro1": {
  try {
    const videoPath = path.join(__dirname, "data", "intro1.mp4"); // Video harus disimpan di ./data
    const imagePath = path.join(__dirname, "data", "elaina.jpg"); // Thumbnail
    const videoUrl = "https://bit.ly/introCOTE1";

    // Cek file video
    if (!fs.existsSync(videoPath)) {
      return await reinbot.sendMessage(from, {
        text: "⚠️ File *intro1.mp4* tidak ditemukan di folder /data.",
      }, { quoted: msg });
    }

    const videoBuffer = fs.readFileSync(videoPath);
    const imageBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

    const caption = `🎬 *COTE Family INTRO 1*\n\n📥 Download:\n${videoUrl}\n\nPowered by *COTE BOT*`;

    await reinbot.sendMessage(from, {
      video: videoBuffer,
      caption: caption,
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: "COTTE Family INTRO 1",
          body: "Klik untuk unduh versi HD",
          mediaType: 2,
          thumbnail: imageBuffer,
          mediaUrl: videoUrl,
          sourceUrl: videoUrl
        }
      
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Gagal kirim video intro1:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Terjadi kesalahan saat mengirim video Intro 1.",
    }, { quoted: msg });
  }

  break;
}
case "intro2": {
  try {
    const videoPath = path.join(__dirname, "data", "intro2.mp4"); // Video harus disimpan di ./data
    const imagePath = path.join(__dirname, "data", "elaina.jpg"); // Thumbnail
    const videoUrl = "https://bit.ly/introCOTE2";

    // Cek file video
    if (!fs.existsSync(videoPath)) {
      return await reinbot.sendMessage(from, {
        text: "⚠️ File *intro1.mp4* tidak ditemukan di folder /data.",
      }, { quoted: msg });
    }

    const videoBuffer = fs.readFileSync(videoPath);
    const imageBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

    const caption = `🎬 *COTE Family INTRO 2*\n\n📥 Download:\n${videoUrl}\n\nPowered by *COTE BOT*`;

    await reinbot.sendMessage(from, {
      video: videoBuffer,
      caption: caption,
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: "COTTE Family INTRO 2",
          body: "Klik untuk unduh versi HD",
          mediaType: 2,
          thumbnail: imageBuffer,
          mediaUrl: videoUrl,
          sourceUrl: videoUrl
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Gagal kirim video intro1:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Terjadi kesalahan saat mengirim video Intro 1.",
    }, { quoted: msg });
  }

  break;
}
case "intro3": {
  try {
    const videoPath = path.join(__dirname, "data", "intro3.mp4"); // Video harus disimpan di ./data
    const imagePath = path.join(__dirname, "data", "elaina.jpg"); // Thumbnail
    const videoUrl = "https://bit.ly/introCOTE3";

    // Cek file video
    if (!fs.existsSync(videoPath)) {
      return await reinbot.sendMessage(from, {
        text: "⚠️ File *intro1.mp4* tidak ditemukan di folder /data.",
      }, { quoted: msg });
    }

    const videoBuffer = fs.readFileSync(videoPath);
    const imageBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

    const caption = `🎬 *COTE Family INTRO 3*\n\n📥 Download:\n${videoUrl}\n\nPowered by *COTE BOT*`;

    await reinbot.sendMessage(from, {
      video: videoBuffer,
      caption: caption,
      mimetype: 'video/mp4',
      contextInfo: {
        externalAdReply: {
          title: "COTTE Family INTRO 1",
          body: "Klik untuk unduh versi HD",
          mediaType: 2,
          thumbnail: imageBuffer,
          mediaUrl: videoUrl,
          sourceUrl: videoUrl
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Gagal kirim video intro1:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Terjadi kesalahan saat mengirim video Intro 1.",
    }, { quoted: msg });
  }

  break;

case "preset": {
  try {
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

    const text = `🎭 *COTE PRESET LIST*\n
Silakan pilih preset:

1. .presetcollab`;

    await reinbot.sendMessage(from, {
      text,
      contextInfo: {
        externalAdReply: {
          title: "Daftar Preset - COTE",
          body: "Klik salah satu preset di atas",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://wa.me/6283895079009"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Gagal kirim preset list:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal menampilkan daftar preset. Pastikan file *elaina.jpg* tersedia di folder *./data*.",
    }, { quoted: msg });
  }

  break;
}
case "presetcollab": {
  try {
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

    const caption = `🤝 *COTE COLLAB MENU*\n
Preset by Admin!

📌 Fitur-fitur yang tersedia:

1. .collab v1
2. .collab v2
3. .collab v3

📝 Ketik salah satu perintah di atas.`;

    await reinbot.sendMessage(from, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: "PRESET COLLAB",
          body: "Menu kolaborasi interaktif",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://wa.me/6283895079009" // bisa diganti dengan URL kamu
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Gagal kirim presetcollab:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal menampilkan menu collab. Pastikan file *elaina.jpg* tersedia.",
    }, { quoted: msg });
  }

  break;
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mulai case rapat
case 'rapat': {
  try {
    const isGroup = msg.key.remoteJid.endsWith('@g.us');
    if (!isGroup) {
      return reinbot.sendMessage(from, {
        text: "❌ Fitur ini hanya bisa digunakan dalam grup."
      }, { quoted: msg });
    }

    const metadata = await reinbot.groupMetadata(from);
    const groupAdmins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);
    const isAdmin = groupAdmins.includes(sender);
    const senderNumber = sender.split('@')[0];

    if (!isAdmin) {
      return reinbot.sendMessage(from, {
        text: "❌ Hanya admin yang bisa menggunakan fitur ini.",
      }, { quoted: msg });
    }

    const isiRapat = text || "📢 Tidak ada isi rapat yang ditulis.";
    const caption = `📢 *UNDANGAN RAPAT GRUP*

📝 *Dari*: @${senderNumber}
📍 *Tempat*: Grup ini
⏰ *Waktu*: Silakan disesuaikan

💬 *Isi Rapat*:
${isiRapat}

📩 Mohon semua anggota hadir tepat waktu.`;

    // Ambil gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    if (!fs.existsSync(imagePath)) {
      throw new Error("Gambar 'elaina.jpg' tidak ditemukan di folder ./data");
    }

    const imageBuffer = fs.readFileSync(imagePath);

    // Ambil nomor bot
    const botNumber = reinbot.user.id;

    // Kirim pesan pribadi ke semua member (kecuali bot)
    for (const participant of metadata.participants) {
      const userJid = participant.id;

      if (userJid === botNumber) continue;

      await reinbot.sendMessage(userJid, {
        text: caption,
        contextInfo: {
          mentionedJid: [sender],
          externalAdReply: {
            title: "📢 UNDANGAN RAPAT",
            body: "Silakan dibaca & konfirmasi ke admin",
            mediaType: 1,
            thumbnail: imageBuffer,
            renderLargerThumbnail: true,
            sourceUrl: "https://fafnirpayment.vercel.app/" + senderNumber // bisa diganti ke link grup atau website
          }
        }
      });

      await delay(1000); // jeda 1 detik per kirim
    }

    // Balasan ke grup
    await reinbot.sendMessage(from, {
      text: "✅ Undangan rapat telah dikirim ke semua anggota secara pribadi.",
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error fitur rapat:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengirim undangan rapat. Pastikan gambar *elaina.jpg* ada di folder *./data* dan tidak rusak.",
    }, { quoted: msg });
  }

  break;
}
//============================================================
// ==================== [ Fitur Umum ]=========================
     case "profile": {
  const name = msg.pushName || "Tidak diketahui";
  const nomor = sender.split("@")[0];
  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  const isGroup = msg.key.remoteJid.endsWith("@g.us");
  const groupMetadata = isGroup ? await reinbot.groupMetadata(from) : null;
  const groupName = isGroup ? groupMetadata.subject : "-";

  // 🔹 Deteksi apakah user adalah admin
  let tipeUser = "Private User";
  if (isGroup) {
    const participants = groupMetadata.participants || [];
    const isAdmin = participants.some(p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    const isOwner = participants.some(p => p.id === sender && p.admin === 'superadmin');
    if (isOwner) tipeUser = "Owner Group";
    else if (isAdmin) tipeUser = "Admin Group";
    else tipeUser = "Member Group";
  }

  // 🔹 Status: simulasi dari trigger pesan
  const status = "🟢 Online";

  // 🔹 Platform: perkiraan dari key.id
  let platform = "-";
  if (msg.key.id?.startsWith("3A")) platform = "📱 Android";
  else if (msg.key.id?.startsWith("3E")) platform = "🖥️ Web";
  else if (msg.key.id?.startsWith("3D")) platform = "📱 iOS";
  else platform = "📦 Tidak Diketahui";

  // 🔹 Foto profil
  let profilePicUrl;
  try {
    profilePicUrl = await reinbot.profilePictureUrl(sender, "image");
  } catch (e) {
    profilePicUrl = "https://i.ibb.co/7yz1Rdf/default-pfp.png";
  }

  // 🔹 Ambil poin langsung dari file
  let poinUser = 0;
  try {
    const poinData = JSON.parse(fs.readFileSync(path.join(__dirname, "data","poin.json")));
    poinUser = poinData[sender] || 0;
  } catch (e) {
    poinUser = 0;
  }

  const teks = `
╭──⭓ *『 USER PROFILE 』*
│
│ 🧷 *Nama*        : ${name}
│ ☎️ *Nomor*       : wa.me/${nomor}
│ 💠 *Tipe User*   : ${tipeUser}
│ 🟢 *Status*      : ${status}
│ 🏷️ *Asal Grup*   : ${groupName}
│ 🌐 *Sumber*      : ${isGroup ? "Group Chat" : "Private Chat"}
│ 📱 *Platform*    : ${platform}
│ 🕰️ *Akses Waktu* : ${waktu}
│ 💰 *Total Poin*  : ${poinUser} Poin
│
╰───────⭓`;

  await reinbot.sendMessage(from, {
    text: teks.trim(),
    contextInfo: {
      mentionedJid: [sender],
      externalAdReply: {
        title: `${name}`,
        body: `Informasi Pengguna WhatsApp`,
        thumbnailUrl: profilePicUrl,
        sourceUrl: `https://wa.me/${nomor}`,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    }
  }, { quoted: msg });

  break;
}
      case "download": {
        console.log("✅ MASUK KE CASE DOWNLOAD");
        try {
          const url = args[0];
          if (!url) return replyCommand("❌ Silakan kirim URL TikTok.");
          if (!url.includes("tiktok.com")) return replyCommand("❌ Link harus berasal dari TikTok.");

          replyCommand("🛠️ Mengunduh dari TikTok, mohon tunggu...");

          let resolvedUrl = url;

          if (url.includes("vt.tiktok.com")) {
            const response = await axios.get(url, {
              maxRedirects: 0,
              validateStatus: (status) => status >= 200 && status < 400,
            }).catch(err => err.response);

            if (!response || !response.headers?.location) {
              return replyCommand("❌ Gagal resolve link pendek TikTok.");
            }

            resolvedUrl = response.headers.location;
            console.log("🔁 Redirected to:", resolvedUrl);
          }

          const { data } = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(resolvedUrl)}`);

          if (!data || !data.data || !data.data.play) {
            return replyCommand("❌ Gagal mendapatkan link video dari TikTok.");
          }

          await reinbot.sendMessage(from, {
            video: { url: data.data.play },
            caption: "📥 Berikut media dari URL yang kamu kirim",
          }, { quoted: msg });

        } catch (err) {
          console.error("❌ Gagal download:", err);
          replyCommand("⚠️ Terjadi kesalahan saat mengunduh.");
        }
        break;
      }
          case "ttmp3": {
  try {
    if (!text) return reinbot.sendMessage(from, { text: "❗ Masukkan link TikTok.\nContoh: .ttmp3 https://www.tiktok.com/@..." }, { quoted: msg });

    const fetch = require("node-fetch");
    const api = `https://tikwm.com/api/?url=${encodeURIComponent(text)}&hd=0`;

    const res = await fetch(api);
    const json = await res.json();

    if (!json || !json.data || !json.data.music) {
      return reinbot.sendMessage(from, { text: "❌ Gagal mengambil audio. Pastikan link TikTok benar dan tidak private." }, { quoted: msg });
    }

    const audioUrl = json.data.music;

    await reinbot.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mp4",
      ptt: false
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error saat ambil ttmp3:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Terjadi kesalahan saat mengambil audio TikTok."
    }, { quoted: msg });
  }

  break;
}

case "ytmp3": {
  try {
    if (!text) {
      return reinbot.sendMessage(from, {
        text: "❌ Harap masukkan link atau judul video YouTube.\nContoh: .ytmp3 never gonna give you up"
      }, { quoted: msg });
    }

    const fetch = require("node-fetch");

    // Gunakan API YouTube-to-MP3 dari pihak ketiga
    const apikey = "YOUR_API_KEY"; // Ganti dengan API milikmu
    const url = `https://api.lolhuman.xyz/api/ytmusic?apikey=${apikey}&query=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 200) {
      return reinbot.sendMessage(from, {
        text: "❌ Gagal mengambil audio. Pastikan link/judul valid."
      }, { quoted: msg });
    }

    const result = data.result;

    // Kirim informasi dulu
    await reinbot.sendMessage(from, {
      text: `🎵 *Judul:* ${result.title}\n📥 *Mengunduh MP3...*`,
      contextInfo: {
        externalAdReply: {
          title: result.title,
          body: "Klik untuk buka YouTube",
          thumbnailUrl: result.thumbnail,
          mediaType: 1,
          mediaUrl: result.link,
          sourceUrl: result.link
        }
      }
    }, { quoted: msg });

    // Kirim audio
    await reinbot.sendMessage(from, {
      audio: { url: result.link },
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error fitur ytmp3:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Terjadi kesalahan saat mengambil audio dari YouTube."
    }, { quoted: msg });
  }

  break;
}
      case "anime": {
        if (!args.length) return replyCommand("❌ Masukkan judul anime!\nContoh: .anime naruto");

        const query = args.join(" ");
        const axios = require("axios");

        try {
          const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
          const anime = res.data.data[0];

          if (!anime) return replyCommand("❌ Anime tidak ditemukan!");

          const caption = `*📺 Judul:* ${anime.title} (${anime.title_japanese})
      *🎬 Tipe:* ${anime.type}
      *📅 Tayang:* ${anime.aired.string}
      *⏱️ Durasi:* ${anime.duration}
      *⭐ Skor:* ${anime.score}
      *🎭 Genre:* ${anime.genres.map(g => g.name).join(', ')}

      *📖 Sinopsis:*
      ${anime.synopsis}`;

          await reinbot.sendMessage(from, {
            image: { url: anime.images.jpg.image_url },
            caption,
          }, { quoted: msg });

        } catch (err) {
          console.error("❌ Gagal fetch anime:", err);
          replyCommand("⚠️ Gagal mencari anime.");
        }
        break;
      }
      case "manga": {
        if (!args.length) return replyCommand("❌ Masukkan judul manga!\nContoh: .manga one piece");

        const query = args.join(" ");
        const axios = require("axios");

        try {
          const res = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`);
          const manga = res.data.data[0];

          if (!manga) return replyCommand("❌ Manga tidak ditemukan!");

          const caption = `*📚 Judul:* ${manga.title} (${manga.title_japanese})
      *✍️ Tipe:* ${manga.type}
      *📅 Tanggal Terbit:* ${manga.published.string || "Tidak diketahui"}
      *🧾 Chapter:* ${manga.chapters || "?"}
      *📖 Volume:* ${manga.volumes || "?"}
      *⭐ Skor:* ${manga.score || "?"}
      *🎭 Genre:* ${manga.genres.map(g => g.name).join(', ')}

      *📖 Sinopsis:*
      ${manga.synopsis}`;

          await reinbot.sendMessage(from, {
            image: { url: manga.images.jpg.image_url },
            caption,
          }, { quoted: msg });

        } catch (err) {
          console.error("❌ Gagal fetch manga:", err);
          replyCommand("⚠️ Gagal mencari manga.");
        }
        break;
      }

      // ===============================================================
    //  ==================== [Gambar & Profile]=========================
          case "randomwaifu": {
  try {
    // Ambil gambar dari API waifu.pics
    const res = await fetch("https://api.waifu.pics/sfw/waifu");
    const data = await res.json();

    if (!data.url) throw new Error("Gagal mengambil gambar.");

    // Kirim gambar ke user
    await reinbot.sendMessage(from, {
      image: { url: data.url },
      caption: `Here’s your random waifu 💖`,
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error fitur randomwaifu:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengambil waifu. Coba lagi nanti.",
    }, { quoted: msg });
  }
  break;
}
case "ppcouple": {
  try {
    // Pakai proxy agar data bisa di-parse dengan baik
    const res = await fetch("https://gist.githubusercontent.com/muhrizkiy/1aa82fa31c3e30d6ef7ccf108abe7c88/raw/kopel.json");
    const text = await res.text();

    const data = JSON.parse(text);
    const couple = data[Math.floor(Math.random() * data.length)];

    await reinbot.sendMessage(from, {
      image: { url: couple.male },
      caption: "🧑 Foto profil cowoknya nih!",
    }, { quoted: msg });

    await reinbot.sendMessage(from, {
      image: { url: couple.female },
      caption: "👩 Dan ini buat ceweknya!",
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error fitur ppcouple:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengambil pp couple. Coba lagi nanti.",
    }, { quoted: msg });
  }
  break;
}
    // =================================================================
    // ==================== [Store Menu]================================
      case 'payment': {
  const senderNumber = sender.split("@")[0];
  const paymentText = `Hai Kak @${senderNumber}

╭───❖ 「 *💳 PAYMENT BY FAFNIR* 」 ❖────
📌 *QRIS* : Belum, buat 🗿
├─────────────────────────────┤
🔹 *GoPay*      : \`083895079009\` (RAHMAD PRASETIYO)
🔹 *Website*        : https://fafnirpayment.vercel.app/
├─────────────────────────────┤
✅ *Pastikan transfer sesuai nominal!*
📩 *Konfirmasi ke admin setelah pembayaran.*
🚀 *Terima kasih telah bertransaksi dengan Lx!*
╰────────────────────────────╯`;

  try {
    const imagePath = path.join(__dirname, "data", "elaina.jpg");

    if (!fs.existsSync(imagePath)) {
      throw new Error("Gambar 'elaina.jpg' tidak ditemukan di folder ./data");
    }

    const imageBuffer = fs.readFileSync(imagePath);

    await reinbot.sendMessage(from, {
      text: paymentText,
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          title: "💳 INFO PEMBAYARAN",
          body: "Klik untuk konfirmasi ke Admin",
          mediaType: 1,
          thumbnail: imageBuffer,
          renderLargerThumbnail: true,
          sourceUrl: "https://wa.me/6283895079009" // Ganti dengan URL konfirmasi/admin-mu
        }
      }
    }, { quoted: msg });

  } catch (error) {
    console.error("❌ Error sending payment message:", error);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal menampilkan info pembayaran. Pastikan gambar *elaina.jpg* ada di folder *./data* dan tidak rusak.",
    }, { quoted: msg });
  }

  break;
}
      case "store": {
        console.log("✅ MASUK KE CASE STORE");
        try {
          const teks = `╭────❖ 「 *FITUR STORE* 」 ❖────╮

      📦 *Store Menu*:
      1. *add* - Tambah produk ke store
      2. *produk* - Lihat daftar produk

      📌 *Contoh penggunaan:*
      - Ketik *add* untuk menambahkan produk
      - Ketik *produk* untuk melihat daftar produk

      ╰────────────────────────────╯`;

          await reinbot.sendMessage(from, {
            text: teks
          }, { quoted: msg });
        } catch (error) {
          console.error("❌ Gagal mengirim pesan store:", error);
        }
        break;
      }
      case "add": {
        console.log("✅ MASUK KE CASE ADD");
        try {
          const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
          const input = body.split(" ").slice(1).join(" "); // Hapus kata "add"
          const [nama, harga, jumlah, image, kategori] = input.split(",");

          if (!nama || !harga || !jumlah || !image || !kategori) {
            const errorMsg = `❌ *Format salah!*

      📌 *Contoh penggunaan yang benar:*
      .add Nama Produk,10000,5,https://example.com/gambar.jpg,Makanan

      🔍 Format:
      .add <nama>,<harga>,<jumlah>,<link gambar>,<kategori>`;

            await reinbot.sendMessage(from, { text: errorMsg }, { quoted: msg });
            break;
          }

          const produk = {
            nama: nama.trim(),
            harga: parseInt(harga.trim()),
            jumlah: parseInt(jumlah.trim()),
            image: image.trim(),
            kategori: kategori.trim().toLowerCase()
          };

          tambahProduk(produk);

          await reinbot.sendMessage(from, {
            text: `✅ *Produk berhasil ditambahkan!*\n\n📦 Nama: ${produk.nama}\n💰 Harga: Rp${produk.harga}\n📦 Stok: ${produk.jumlah}\n📁 Kategori: ${produk.kategori}`
          }, { quoted: msg });

        } catch (error) {
          console.error("❌ Gagal menambahkan produk:", error);
          await reinbot.sendMessage(from, {
            text: `❌ Gagal menambahkan produk. Coba lagi nanti.`
          }, { quoted: msg });
        }
        break;
      }

      case "produk": {
        const args = msgText.split(" ").slice(1).join(" ").trim();

        // Tanpa argumen: tampilkan daftar kategori
        if (!args) {
          const kategoriList = getKategori();

          if (kategoriList.length === 0) {
            await reinbot.sendMessage(from, {
              text: `📦 Belum ada produk dalam store.`
            }, { quoted: msg });
            break;
          }

          const list = kategoriList.map((k, i) => `${i + 1}. ${k}`).join("\n");

          await reinbot.sendMessage(from, {
            text: `📂 *Daftar Kategori Produk:*\n\n${list}\n\n📌 Ketik *.produk <kategori>* untuk melihat produk dari kategori tersebut.`
          }, { quoted: msg });

        } else {
          // Dengan argumen: tampilkan produk dari kategori tertentu
          const produkList = getProdukByKategori(args.toLowerCase());

          if (produkList.length === 0) {
            await reinbot.sendMessage(from, {
              text: `❌ Tidak ada produk ditemukan dalam kategori *${args}*.`
            }, { quoted: msg });
            break;
          }

          // Kirim produk satu per satu sebagai gambar dengan caption
          for (const [i, p] of produkList.entries()) {
            await reinbot.sendMessage(from, {
              image: { url: p.image },
              caption: `📌 *${i + 1}. ${p.nama}*\n💰 Harga: Rp${p.harga}\n📦 Stok: ${p.jumlah}`
            }, { quoted: msg });
          }
        }

        break;
      }
      case "saweria": {
        console.log("✅ MASUK KE CASE SAWERIA");
        try {
          const teks = `╭──────❖ 「 *DONASI DUKUNG BOT* 」 ❖──────╮

      📌 *Platform:* [Saweria](https://saweria.co/rhmd)

      💬 *Pesan:* Dukung pengembangan & operasional bot ini dengan donasi sukarela.

      🔗 Klik link di bawah untuk donasi:
      🌐 https://saweria.co/rhmd

      🙏 Terima kasih atas dukunganmu!

      ╰──────────────────────────────╯`;

          await reinbot.sendMessage(from, {
            text: teks
          }, { quoted: msg });
        } catch (error) {
          console.error("❌ Gagal mengirim pesan saweria:", error);
        }
        break;
      }
case 'proses': {
          try {
              // Ambil input dari pengguna
              const args = text.split(",");
              if (args.length < 8) {
                  return reply('⚠️ *Format salah!* Gunakan format berikut:\n\n.proses +628123456789,Nama Pembeli,ID,Username,Link,Nama Barang,Jumlah,Total Harga,Garansi\n\nContoh:\n.proses +628123456789,Rahmad Prasetiyo,ID123456,@rahmad_p,wa.me/628123456789,Paket Premium Bot,1,150000,✅ (Garansi 7 Hari)');
              }

              // Parsing data dari input
              const targetNumber = args[0].trim().replace(/\D/g, '') + '@s.whatsapp.net';
              const transaksi = {
                  nama: args[1].trim(),
                  id_pembeli: args[2].trim(),
                  username: args[3].trim(),
                  link: args[4].trim(),
                  nama_barang: args[5].trim(),
                  jumlah: parseInt(args[6].trim()),
                  total_harga: parseInt(args[7].trim()),
                  garansi: args[8].trim()
              };

              // Dapatkan waktu saat transaksi diproses
              const waktu = new Date();

              // Format pesan untuk user dengan nota transaksi + peraturan
              const pesanUser = `📦 *NOTA TRANSAKSI*  
      ━━━━━━━━━━━━━━━━━━━  
      👤 *Nama:* ${transaksi.nama}  
      🆔 *ID Pembeli:* ${transaksi.id_pembeli}  
      🔗 *Username:* ${transaksi.username}  
      🌐 *Link :* ${transaksi.link}  
      📦 *Barang:* ${transaksi.nama_barang}  
      📦 *Jumlah:* ${transaksi.jumlah}x  
      💰 *Total Harga:* Rp${transaksi.total_harga.toLocaleString()}  
      🛡️ *Garansi:* ${transaksi.garansi}  
      ⏰ *Waktu:* ${waktu.toLocaleString()}  
      ━━━━━━━━━━━━━━━━━━━  
      ⏳ *Pesanan sedang diproses! Mohon tunggu sebentar...*

      *𝙋𝙚𝙧𝙖𝙩𝙪𝙧𝙖𝙣*  
      1. Akun jangan di privat / privasi. Harus bersifat publik.  
      2. Username jangan diganti selama pesanan belum Success.  
      3. Postingan target jangan dihapus atau diarsipkan.  
      4. Jangan batasi umur, postingan, mentions, tagar, dan komentar.  
      5. Jika targetnya berupa link, pastikan link tersebut bisa diakses via browser tanpa login ke aplikasi.  
      6. Melanggar hal di atas = No Refund.`;

              await reinbot.sendMessage(targetNumber, { text: pesanUser });

              // Pesan ke admin sebagai notifikasi
              const adminJid = "6283895079009@s.whatsapp.net";
              const pesanAdmin = `📢 *Notifikasi Pesanan Baru*  

      🔹 *Nomor Pemesan:* ${transaksi.link}  
      🔹 *Nama:* ${transaksi.nama}  
      🔹 *ID Pembeli:* ${transaksi.id_pembeli}  
      🔹 *Username:* ${transaksi.username}  
      🔹 *Barang:* ${transaksi.nama_barang}  
      🔹 *Jumlah:* ${transaksi.jumlah}  
      🔹 *Total Harga:* Rp${transaksi.total_harga.toLocaleString()}  
      🔹 *Garansi:* ${transaksi.garansi}  
      🔹 *Waktu:* ${waktu.toLocaleString()}  

      🚀 Segera tangani agar tidak terjadi keterlambatan!`;

              await reinbot.sendMessage(adminJid, { text: pesanAdmin, contextInfo: { forwardingScore: 9999, isForwarded: true } });

              // Konfirmasi ke pengguna yang mengirim perintah
              await reply(`📩 *Nota transaksi berhasil dikirim ke* ${transaksi.link}`);

          } catch (error) {
              console.error("Error processing order:", error);
              reply('❌ *Terjadi kesalahan saat mengirim pesan.*');
          }
      }
      break;
       case "tunda": {
          try {
              // Ambil input dari pengguna
              const args = text.split(",");
              if (args.length < 2) {
                  return reply('⚠️ *Format salah!* Gunakan format berikut:\n\n.tunda +628123456789,Alasan Pending\n\nContoh:\n.tunda +628123456789,Stok barang sedang habis, mohon bersabar.');
              }

              // Parsing data dari input
              const targetNumber = args[0].trim().replace(/\D/g, '') + '@s.whatsapp.net';
              const alasan = args.slice(1).join(",").trim();

              // Generate Nomor Transaksi Otomatis
              const now = new Date();
              const formattedDate = now.toISOString().split("T")[0].replace(/-/g, "");
              const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, "");
              const nomorTransaksi = `TRX-${formattedDate}-${formattedTime}`;

              // Format pesan untuk user
              const pesanUser = `🚨 *PESANAN ANDA SEDANG PENDING*  
      ━━━━━━━━━━━━━━━━━━━  
      🆔 *Nomor Transaksi:* ${nomorTransaksi}  
      ⏳ *Status:* Pending  
      📝 *Alasan:* ${alasan}  
      ━━━━━━━━━━━━━━━━━━━  
      🙏 Mohon bersabar, pesanan Anda akan segera diproses kembali. Terima kasih atas pengertiannya!`;

              await reinbot.sendMessage(targetNumber, { text: pesanUser });

              // Pesan ke admin sebagai notifikasi
              const adminJid = "6283895079009@s.whatsapp.net";
              const pesanAdmin = `📢 *Notifikasi Transaksi Pending*  
      ━━━━━━━━━━━━━━━━━━━  
      🔹 *Nomor Transaksi:* ${nomorTransaksi}  
      🔹 *Nomor Pemesan:* wa.me/${targetNumber.replace("@s.whatsapp.net", "")}  
      🔹 *Status:* Pending  
      🔹 *Alasan:* ${alasan}  
      ━━━━━━━━━━━━━━━━━━━  
      🚀 Harap segera menindaklanjuti pesanan ini!`;

              await reinbot.sendMessage(adminJid, { text: pesanAdmin, contextInfo: { forwardingScore: 9999, isForwarded: true } });

              // Konfirmasi ke pengguna yang mengirim perintah
              await reply(`📩 *Pesanan dengan nomor* ${nomorTransaksi} *telah ditandai sebagai pending*.\n📢 *Pemberitahuan telah dikirim ke pembeli dan admin.*`);

          } catch (error) {
              console.error("Error processing pending order:", error);
              reply('❌ *Terjadi kesalahan saat mengirim pesan.*');
          }
      }
      break;

case "tutorial": {
const text12 = `*TUTORIAL BISA TONTON LINK DI BAWAH*
https://youtu.be/A0k_FN_Pvxc?si=k5AHm95eiqYxFwwi`
reply(text12)
}
break
    case "batal": {
        try {
            // Ambil input dari pengguna
            const args = text.split(",");
            if (args.length < 2) {
                return reply('⚠️ *Format salah!* Gunakan format berikut:\n\n.batal +628123456789,Alasan Pembatalan\n\nContoh:\n.batal +628123456789,Pembeli tidak merespon selama 24 jam.');
            }

            // Parsing data dari input
            const targetNumber = args[0].trim().replace(/\D/g, '') + '@s.whatsapp.net';
            const alasan = args.slice(1).join(",").trim();

            // Format pesan untuk user
            const pesanUser = `❌ *TRANSAKSI DIBATALKAN*  
    ━━━━━━━━━━━━━━━━━━━  
    ✨ *Status:* Dibatalkan  
    📝 *Alasan:* ${alasan}  
    ━━━━━━━━━━━━━━━━━━━  
    🙏 Jika ada kesalahan atau ingin mengajukan ulang transaksi, silakan hubungi admin.`;

            await reinbot.sendMessage(targetNumber, { text: pesanUser });

            // Pesan ke admin sebagai notifikasi
            const adminJid = "6283895079009@s.whatsapp.net";
            const pesanAdmin = `📢 *Notifikasi Pembatalan Transaksi*  
    ━━━━━━━━━━━━━━━━━━━  
    🔹 *Nomor Pemesan:* wa.me/${targetNumber.replace("@s.whatsapp.net", "")}  
    🔹 *Status:* Dibatalkan  
    🔹 *Alasan:* ${alasan}  
    ━━━━━━━━━━━━━━━━━━━  
    🛑 Harap pastikan pembatalan ini sudah sesuai prosedur.`;

            await reinbot.sendMessage(adminJid, { text: pesanAdmin, contextInfo: { forwardingScore: 9999, isForwarded: true } });

            // Konfirmasi ke pengguna yang mengirim perintah
            await reply(`📩 *Pesanan telah dibatalkan*.\n📢 *Pemberitahuan telah dikirim ke pembeli dan admin.*`);

        } catch (error) {
            console.error("Error processing cancellation:", error);
            reply('❌ *Terjadi kesalahan saat mengirim pesan.*');
        }
    }
    break;

      case 'done': {
          try {
              // Memisahkan input berdasarkan koma
              let args = text.split(",");
              if (args.length < 4) {
                  return reply(`⚠️ *Format salah!*\n\nGunakan format berikut:\n.done +628123456789,Nama Pelanggan,Barang,Nominal\n\nContoh:\n.done +628123456789,Budi,Handphone Rp2.000.000`);
              }

              // Parsing data
              const targetNumber = args[0].trim().replace(/\D/g, '') + '@s.whatsapp.net';
              const namaPelanggan = args[1].trim();
              const barang = args[2].trim();
              const nominal = args[3].trim();

              // Pesan untuk pelanggan
              const pesanUser = `🎉 *TRANSAKSI BERHASIL*  
      ━━━━━━━━━━━━━━━━━━━  
      ✅ *Nama Pelanggan:* ${namaPelanggan}  
      📦 *Barang:* ${barang}  
      💰 *Nominal:* Rp${nominal}  
      🏪 *Nama Store:* Lx Store  
      ━━━━━━━━━━━━━━━━━━━  
      🙏 Terima kasih telah berbelanja di *Lx Store*!  
      Jangan lupa order lagi ya! 😊`;

              await reinbot.sendMessage(targetNumber, { text: pesanUser });

              // Notifikasi ke admin
              const adminJid = "6283895079009@s.whatsapp.net";
              const pesanAdmin = `📢 *Notifikasi Transaksi Selesai*  
      ━━━━━━━━━━━━━━━━━━━  
      🔹 *Nama Pelanggan:* ${namaPelanggan}  
      🔹 *Barang:* ${barang}  
      🔹 *Nominal:* Rp${nominal}  
      🔹 *Status:* Sukses  
      ━━━━━━━━━━━━━━━━━━━  
      🚀 Pastikan pesanan telah dikirim dengan baik!`;

              await reinbot.sendMessage(adminJid, { text: pesanAdmin, contextInfo: { forwardingScore: 9999, isForwarded: true } });

              // Konfirmasi ke pengguna yang mengirim perintah
              await reply(`✅ *Transaksi berhasil diproses!*\n📩 *Notifikasi telah dikirim ke pelanggan dan admin.*`);

          } catch (error) {
              console.error("Error processing done:", error);
              reply('❌ *Terjadi kesalahan saat mengirim pesan.*');
          }
      }
      break;
      // =================================================================
      // ==================== [ Others ]==================================
  case 'cweb':
case 'createweb': {
  if (!isCreator && !isSellerWeb) return balas(mesg.slr);
  if (!text) return example('<namaWeb>')
  if (!qmsg || !/zip|html/.test(qmsg.mimetype)) return balas('Reply file .zip atau .html')

  const webName = text.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
  const domainCheckUrl = `https://${webName}.vercel.app`

  try {
  await reactLoading(m);
    const check = await fetch(domainCheckUrl)
    if (check.status === 200) return balas(`[ x ] Nama web *${webName}* sudah digunakan. Silakan gunakan nama lain.`)
  } catch (e) {}

  const quotedFile = await neo.downloadMediaMessage(qmsg)
  const filesToUpload = []

  if (qmsg.mimetype.includes('zip')) {
    const unzipper = require('unzipper')
    const zipBuffer = Buffer.from(quotedFile)
    const directory = await unzipper.Open.buffer(zipBuffer)

    for (const file of directory.files) {
      if (file.type === 'File') {
        const content = await file.buffer()
        const filePath = file.path.replace(/^\/+/, '').replace(/\\/g, '/')
        filesToUpload.push({
          file: filePath,
          data: content.toString('base64'),
          encoding: 'base64'
        })
      }
    }

    if (!filesToUpload.some(x => x.file.toLowerCase().endsWith('index.html'))) {
      return balas('File index.html tidak ditemukan dalam struktur ZIP.')
    }

  } else if (qmsg.mimetype.includes('html')) {
    filesToUpload.push({
      file: 'index.html',
      data: Buffer.from(quotedFile).toString('base64'),
      encoding: 'base64'
    })
  } else {
    return balas('File tidak dikenali. Kirim file .zip atau .html.')
  }

  const headers = {
    Authorization: `Bearer ${global.vercelToken}`,
    'Content-Type': 'application/json'
  }

  await fetch('https://api.vercel.com/v9/projects', {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: webName })
  }).catch(() => {})

  const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: webName,
      project: webName,
      files: filesToUpload,
      projectSettings: { framework: null }
    })
  })

  const deployData = await deployRes.json().catch(() => null)
  if (!deployData || !deployData.url) {
    console.log('Deploy Error:', deployData)
    return balas(`Gagal deploy ke Vercel:\n${JSON.stringify(deployData)}`)
  }

  balas(`[ ✓ ] Website berhasil dibuat!\n\n🌐 URL: https://${webName}.vercel.app`)
}
break;
case "addsellerweb": { 
    if (!isCreator) return balas(mesg.own);
    if (!args[0]) return example(`6285659202292`)
   let prrkek = q.split("|")[0].replace(/[^0-9]/g, '')
    let ceknya = await neo.onWhatsApp(prrkek) // Mengecek Apkah Nomor ${prrkek} Terdaftar Di WhatsApp 
    if (ceknya.length == 0) return reply(`Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`)
    swebnumber.push(prrkek)
    fs.writeFileSync("./database/sellerweb.json", JSON.stringify(swebnumber))
    balas(`Successfully Added ${prrkek} To Seller Web`)
}
break;
    case "owner": {
  try {
    const number = "6285921967820"; // Ganti dengan nomor owner kamu
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Lux Ard
ORG:Bot Creator;
TEL;type=CELL;type=VOICE;waid=${number}:${number}
END:VCARD`;

    // Path ke gambar
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    let thumbnail = null;
    if (fs.existsSync(imagePath)) {
      thumbnail = fs.readFileSync(imagePath);
    }

    // Kirim pesan teks dengan externalAdReply
    await reinbot.sendMessage(from, {
      text: "👑 Ini kak nomor ownerku, silakan hubungi jika ada keperluan ya.",
      contextInfo: {
        externalAdReply: {
          title: "Kontak Owner Bot",
          body: "Klik untuk menyimpan atau menghubungi",
          thumbnail: thumbnail,
          mediaType: 1,
          sourceUrl: "https://wa.me/" + number,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: msg });

    // Kirim kontak vcard
    await reinbot.sendMessage(from, {
      contacts: {
        displayName: "Lux Ard",
        contacts: [{ vcard }],
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error .owner:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengirim kontak owner.",
    }, { quoted: msg });
  }

  break;
}
     case "sticker": {
  try {
    let mediaMessage, mimeType;

    if (msg.quoted && (msg.quoted.mimetype || msg.quoted.type)) {
      // Jika membalas gambar/video
      mediaMessage = msg.quoted;
      mimeType = msg.quoted.mimetype || msg.quoted.type;
    } else {
      // Jika langsung kirim gambar/video dengan caption .sticker
      const type = Object.keys(msg.message || {})[0];
      if (type === "imageMessage" || type === "videoMessage") {
        mediaMessage = msg.message[type];
        mimeType = mediaMessage.mimetype;
      }
    }

    if (mediaMessage && /image|video/.test(mimeType)) {
      const stream = await downloadContentFromMessage(mediaMessage, mimeType.split('/')[0]);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const sticker = new Sticker(buffer, {
        pack: "FAFNIR",
        author: "Xyz",
        type: StickerTypes.FULL,
        quality: 80,
      });

      await reinbot.sendMessage(from, await sticker.toMessage(), { quoted: msg });

    } else {
      await reinbot.sendMessage(from, {
        text: "❌ Mohon *balas* gambar/video atau *kirim dengan caption* `.sticker` (maks 10 detik)."
      }, { quoted: msg });
    }

  } catch (error) {
    console.error("❌ Gagal membuat sticker:", error);
    await reinbot.sendMessage(from, {
      text: "⚠️ Terjadi kesalahan saat membuat sticker."
    }, { quoted: msg });
  }

  break;
}
 case "afk": {
        console.log("✅ MASUK KE CASE AFK");
        try {
          const reason = args.join(" ") || "Tanpa alasan";

          // Simpan AFK ke file
          afkData[sender] = {
            reason,
            time: Date.now(),
          };
          fs.writeFileSync(afkPath, JSON.stringify(afkData, null, 2));

          const teks = `🚧 Kamu sekarang sedang *AFK*\n📋 Alasan: ${reason}`;
          await reinbot.sendMessage(from, {
            text: teks
          }, { quoted: msg });

        } catch (error) {
          console.error("❌ Gagal mengatur AFK:", error);
        }
        break;
      }
      case "setwelcome": {
        if (!isGroup) return onlyGroup();
        const groupMetadata = await reinbot.groupMetadata(id);
        const groupAdmins = groupMetadata.participants.filter(p => p.admin);
        const isAdmin = groupAdmins.find(p => p.id === userId);

        if (!isAdmin) return replyCommand("Perintah ini hanya untuk admin grup.");

        if (!text.trim()) return replyCommand("Kirim pesan welcome baru setelah perintah ini.\n\nContoh:\n.setwelcome Selamat datang @user di grup @group!");

        // Simpan pesan welcome baru
        const fs = require("fs");
        const path = require("path");
        const welcomePath = path.join(__dirname, "./data/welcome.json");

        let welcomeData = {};
        try {
          welcomeData = JSON.parse(fs.readFileSync(welcomePath));
        } catch {
          welcomeData = {};
        }

        welcomeData[id] = text.trim();

        fs.writeFileSync(welcomePath, JSON.stringify(welcomeData, null, 2));
        await replyCommand("Pesan welcome berhasil diatur untuk grup ini.");
        break;
      }  
  case "toimg": {
  try {
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
    const sticker = quotedMsg?.quotedMessage?.stickerMessage;

    if (!sticker) {
      return reinbot.sendMessage(from, {
        text: "⚠️ Reply ke stiker dulu kak.",
      }, { quoted: msg });
    }

    const mediaStream = await downloadContentFromMessage(sticker, "sticker");
    let mediaBuffer = Buffer.from([]); // ✅ ubah jadi let, bukan const

    for await (const chunk of mediaStream) {
      mediaBuffer = Buffer.concat([mediaBuffer, chunk]);
    }

    const tempDir = path.join(__dirname, "temp"); // ⬅️ tetap di folder bot
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const inputFile = path.join(tempDir, `${Date.now()}.webp`);
    const outputFile = inputFile.replace(".webp", ".png");

    fs.writeFileSync(inputFile, mediaBuffer);

    const { exec } = require("child_process");
    exec(`ffmpeg -i ${inputFile} ${outputFile}`, async (err) => {
      if (err) {
        console.error("❌ Gagal convert sticker ke gambar:", err);
        return reinbot.sendMessage(from, {
          text: "⚠️ Gagal konversi ke gambar.",
        }, { quoted: msg });
      }

      const result = fs.readFileSync(outputFile);
      await reinbot.sendMessage(from, {
        image: result,
        caption: "✅ Ini hasil dari stiker!",
      }, { quoted: msg });

      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
    });

  } catch (err) {
    console.error("❌ Error .toimg:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Terjadi error saat mengubah stiker ke gambar.",
    }, { quoted: msg });
  }

  break;
}
case "tourl": {
  try {
    if (!quoted || !quoted.message) {
      return reinbot.sendMessage(from, {
        text: "⚠️ Reply media (gambar/video) dulu kak."
      }, { quoted: msg });
    }

    const mediaMessage = await downloadContentFromMessage(
      quoted.message.imageMessage || quoted.message.videoMessage,
      quoted.message.imageMessage ? "image" : "video"
    );

    let mediaBuffer = Buffer.from([]);
    for await (const chunk of mediaMessage) {
      mediaBuffer = Buffer.concat([mediaBuffer, chunk]);
    }

    const fileType = await FileType.fromBuffer(mediaBuffer);
    if (!fileType) throw new Error("Media tidak valid.");

    const form = new FormData();
    form.append("file", mediaBuffer, {
      filename: `upload.${fileType.ext}`,
      contentType: fileType.mime,
    });

    const res = await axios.post("https://telegra.ph/upload", form, {
      headers: form.getHeaders(),
    });

    const imageUrl = "https://telegra.ph" + res.data[0].src;
    await reinbot.sendMessage(from, {
      text: `✅ Berhasil upload ke URL:\n${imageUrl}`
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error .tourl:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal upload ke telegra.ph. Pastikan medianya valid."
    }, { quoted: msg });
  }

  break;
}
case "getpp": {
  try {
    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      return reinbot.sendMessage(from, {
        text: "⚠️ Tag seseorang terlebih dahulu.\nContoh: .getpp @628xxxx"
      }, { quoted: msg });
    }

    const target = mentioned[0];

    let profilePic;
    try {
      profilePic = await reinbot.profilePictureUrl(target, "image");
    } catch {
      profilePic = "https://i.ibb.co/7yz1Rdf/default-pfp.png"; // default jika gagal
    }

    await reinbot.sendMessage(from, {
      image: { url: profilePic },
      caption: `📸 Foto profil @${target.split("@")[0]}`,
      mentions: [target]
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error .getpp:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengambil foto profil."
    }, { quoted: msg });
  }

  break;
}
      // =================================================================
      // ==================== [Game Menu]================================
      case 'tebakkata': {
  const soalList = JSON.parse(fs.readFileSync('./data/tebakkata.json'));
  const soal = soalList[Math.floor(Math.random() * soalList.length)];
  const scrambled = soal.jawaban;

  const gameData = JSON.parse(fs.readFileSync('./data/gameData.json'));
  gameData[from] = {
    type: 'tebakkata',
    jawaban: soal.soal.toLowerCase()
  };
  fs.writeFileSync('./data/gameData.json', JSON.stringify(gameData, null, 2));

  await reinbot.sendMessage(from, {
    text: `🧠 *TEBAK KATA*\n\nSusun kata ini:\n➤ *${scrambled.toUpperCase()}*\n\nBalas pesan ini dengan jawabanmu!`,
  }, { quoted: msg });

  break;
}
      // ==================== [Group Menu]================================
case "gcopen":
case "gcclose": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      return reinbot.sendMessage(from, {
        text: "❌ Fitur ini hanya bisa digunakan di grup."
      }, { quoted: msg });
    }

    const metadata = await reinbot.groupMetadata(from);
    const senderAdmin = metadata.participants.find(p => p.id === sender && p.admin);
    if (!senderAdmin) {
      return reinbot.sendMessage(from, {
        text: "❌ Hanya admin grup yang bisa menggunakan perintah ini."
      }, { quoted: msg });
    }

    const { jidDecode } = require("@whiskeysockets/baileys");
    const botNumberDecoded = jidDecode(reinbot.user.id);
    const botNumber = botNumberDecoded ? botNumberDecoded.user + "@s.whatsapp.net" : reinbot.user.id;

    const botAdmin = metadata.participants.find(p => p.id === botNumber && p.admin);
    if (!botAdmin) {
      return reinbot.sendMessage(from, {
        text: "❌ Bot bukan admin grup. Tidak dapat mengubah pengaturan grup."
      }, { quoted: msg });
    }

    const settingType = command === "open" ? "not_announcement" : "announcement";
    await reinbot.groupSettingUpdate(from, settingType);

    // Ambil gambar thumbnail
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    let thumbnail = null;
    if (fs.existsSync(imagePath)) {
      thumbnail = fs.readFileSync(imagePath);
    }

    const isOpen = command === "open";
    const notifText = isOpen
      ? "✅ Grup telah *dibuka*. Sekarang semua anggota dapat mengirim pesan."
      : "✅ Grup telah *ditutup*. Sekarang hanya admin yang dapat mengirim pesan.";

    await reinbot.sendMessage(from, {
      text: notifText,
      contextInfo: {
        externalAdReply: {
          title: isOpen ? "Grup Dibuka" : "Grup Ditutup",
          body: metadata.subject,
          thumbnail: thumbnail,
          mediaType: 1,
          sourceUrl: "https://chat.whatsapp.com/", // bisa diganti link grup
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error fitur open/close:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengubah pengaturan grup."
    }, { quoted: msg });
  }

  break;
}
case "warn": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      return reinbot.sendMessage(from, { text: "❌ Fitur ini hanya bisa digunakan di grup." }, { quoted: msg });
    }

    const admin = metadata.participants.find(p => p.id === sender && p.admin);
    if (!admin) {
      return reinbot.sendMessage(from, { text: "❌ Hanya admin yang bisa memberi peringatan." }, { quoted: msg });
    }

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      return reinbot.sendMessage(from, { text: "🚫 Tag member yang ingin diberi peringatan.\nContoh: .warn @628xxx" }, { quoted: msg });
    }

    const target = mentioned[0];
    const groupId = from;

    // Load warn data
    const warnPath = "./data/warn.json";
    const warnData = JSON.parse(fs.readFileSync(warnPath));

    if (!warnData[groupId]) warnData[groupId] = {};
    if (!warnData[groupId][target]) warnData[groupId][target] = 0;

    warnData[groupId][target] += 1;
    const warnCount = warnData[groupId][target];

    // Simpan perubahan
    fs.writeFileSync(warnPath, JSON.stringify(warnData, null, 2));

    // Tindakan berdasarkan jumlah warn
    if (warnCount >= 3) {
      await reinbot.groupParticipantsUpdate(groupId, [target], "remove");
      await reinbot.sendMessage(from, {
        text: `❌ @${target.split("@")[0]} telah menerima 3 peringatan dan dikeluarkan dari grup.`,
        contextInfo: { mentionedJid: [target] }
      }, { quoted: msg });

      delete warnData[groupId][target];
      fs.writeFileSync(warnPath, JSON.stringify(warnData, null, 2));
    } else {
      await reinbot.sendMessage(from, {
        text: `⚠️ @${target.split("@")[0]} telah diberi peringatan ke-${warnCount}.`,
        contextInfo: { mentionedJid: [target] }
      }, { quoted: msg });
    }

  } catch (err) {
    console.error("❌ Error fitur warn:", err);
    await reinbot.sendMessage(from, { text: "⚠️ Gagal memberikan peringatan." }, { quoted: msg });
  }

  break;
}
case "unwarn": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      return reinbot.sendMessage(from, {
        text: "❌ Fitur ini hanya bisa digunakan di grup."
      }, { quoted: msg });
    }

    const metadata = await reinbot.groupMetadata(from);
    const isAdmin = metadata.participants.some(p => p.id === sender && p.admin);
    if (!isAdmin) {
      return reinbot.sendMessage(from, {
        text: "❌ Hanya admin yang bisa mengurangi peringatan."
      }, { quoted: msg });
    }

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      return reinbot.sendMessage(from, {
        text: "🚫 Tag member yang ingin dikurangi peringatannya.\nContoh: .unwarn @628xxx"
      }, { quoted: msg });
    }

    const target = mentioned[0];
    const groupId = from;

    // Load warn.json
    const warnPath = "./data/warn.json";
    let warnData = {};
    if (!fs.existsSync(warnPath)) fs.writeFileSync(warnPath, "{}");
    const fileContent = fs.readFileSync(warnPath, "utf-8").trim();
    warnData = fileContent ? JSON.parse(fileContent) : {};

    // Ambil gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    if (!fs.existsSync(imagePath)) throw new Error("Gambar elaina.jpg tidak ditemukan.");
    const imageBuffer = fs.readFileSync(imagePath);

    if (warnData[groupId] && warnData[groupId][target] && warnData[groupId][target] > 0) {
      warnData[groupId][target] -= 1;

      await reinbot.sendMessage(from, {
        text: `✅ @${target.split("@")[0]} dikurangi peringatannya. Sekarang tersisa ${warnData[groupId][target]}.`,
        contextInfo: {
          mentionedJid: [target],
          externalAdReply: {
            title: `Peringatan Dikurangi`,
            body: `Tersisa ${warnData[groupId][target]} Peringatan`,
            thumbnail: imageBuffer,
            mediaType: 1,
            sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
          }
        }
      }, { quoted: msg });

      if (warnData[groupId][target] <= 0) {
        delete warnData[groupId][target];
      }

      fs.writeFileSync(warnPath, JSON.stringify(warnData, null, 2));
    } else {
      await reinbot.sendMessage(from, {
        text: `ℹ️ @${target.split("@")[0]} tidak memiliki peringatan.`,
        contextInfo: {
          mentionedJid: [target],
          externalAdReply: {
            title: "Tidak Ada Peringatan",
            body: "Member ini belum pernah diperingatkan.",
            thumbnail: imageBuffer,
            mediaType: 1,
            sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
          }
        }
      }, { quoted: msg });
    }

  } catch (err) {
    console.error("❌ Error fitur unwarn:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengurangi peringatan. Pastikan file *elaina.jpg* tersedia.",
    }, { quoted: msg });
  }

  break;
}
case "mute": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      return reinbot.sendMessage(from, {
        text: "❌ Fitur ini hanya bisa digunakan di grup."
      }, { quoted: msg });
    }

    const metadata = await reinbot.groupMetadata(from);
    const isAdmin = metadata.participants.some(p => p.id === sender && p.admin);
    if (!isAdmin) {
      return reinbot.sendMessage(from, {
        text: "❌ Hanya admin yang bisa membisukan member."
      }, { quoted: msg });
    }

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      return reinbot.sendMessage(from, {
        text: "🚫 Tag member yang ingin dibisukan.\nContoh: .mute @628xxx"
      }, { quoted: msg });
    }

    const target = mentioned[0];

    // Ambil gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    if (!fs.existsSync(imagePath)) throw new Error("Gambar elaina.jpg tidak ditemukan.");
    const imageBuffer = fs.readFileSync(imagePath);

    await reinbot.sendMessage(from, {
      text: `🔇 @${target.split("@")[0]} telah dibisukan (sementara tidak bisa mengirim pesan).`,
      contextInfo: {
        mentionedJid: [target],
        externalAdReply: {
          title: "Member Dibisukan",
          body: "Gunakan .unmute untuk membatalkan",
          thumbnail: imageBuffer,
          mediaType: 1,
          sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
        }
      }
    }, { quoted: msg });

    // Tambahkan sistem mute sesuai kebutuhan (misalnya simpan ke mute.json)
    
  } catch (err) {
    console.error("❌ Error fitur mute:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal membisukan member.",
    }, { quoted: msg });
  }

  break;
}
case "unmute": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      return reinbot.sendMessage(from, {
        text: "❌ Fitur ini hanya bisa digunakan di grup."
      }, { quoted: msg });
    }

    const metadata = await reinbot.groupMetadata(from);
    const isAdmin = metadata.participants.some(p => p.id === sender && p.admin);
    if (!isAdmin) {
      return reinbot.sendMessage(from, {
        text: "❌ Hanya admin yang bisa membuka mute member."
      }, { quoted: msg });
    }

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      return reinbot.sendMessage(from, {
        text: "🚫 Tag member yang ingin di-*unmute*.\nContoh: .unmute @628xxx"
      }, { quoted: msg });
    }

    const target = mentioned[0];
    const groupId = from;

    // Ambil gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    if (!fs.existsSync(imagePath)) throw new Error("Gambar elaina.jpg tidak ditemukan.");
    const imageBuffer = fs.readFileSync(imagePath);

    // Load file mute.json
    const mutePath = "./data/mute.json";
    let muteData = {};
    try {
      if (!fs.existsSync(mutePath)) fs.writeFileSync(mutePath, "{}");
      const fileContent = fs.readFileSync(mutePath, "utf-8").trim();
      muteData = fileContent ? JSON.parse(fileContent) : {};
    } catch (e) {
      console.error("❗File mute.json rusak, reset ulang.");
      muteData = {};
      fs.writeFileSync(mutePath, "{}");
    }

    // Hapus status mute
    if (muteData[groupId] && muteData[groupId][target]) {
      delete muteData[groupId][target];
      fs.writeFileSync(mutePath, JSON.stringify(muteData, null, 2));

      await reinbot.sendMessage(from, {
        text: `✅ @${target.split("@")[0]} telah di-*unmute*.`,
        contextInfo: {
          mentionedJid: [target],
          externalAdReply: {
            title: "Mute Dihapus",
            body: "Pengguna sekarang dapat mengirim pesan.",
            thumbnail: imageBuffer,
            mediaType: 1,
            sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
          }
        }
      }, { quoted: msg });

    } else {
      await reinbot.sendMessage(from, {
        text: `ℹ️ @${target.split("@")[0]} tidak sedang dalam status *mute*.`,
        contextInfo: {
          mentionedJid: [target],
          externalAdReply: {
            title: "Tidak dalam Status Mute",
            body: "Tidak ditemukan data mute pada user ini.",
            thumbnail: imageBuffer,
            mediaType: 1,
            sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
          }
        }
      }, { quoted: msg });
    }

  } catch (err) {
    console.error("❌ Error fitur unmute:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal membuka mute member.",
    }, { quoted: msg });
  }

  break;
}
case "report": {
  try {
    if (!msg.key.remoteJid.endsWith("@g.us")) return;

    const metadata = await reinbot.groupMetadata(from);
    const groupAdmins = metadata.participants.filter(p => p.admin).map(p => p.id);
    const groupName = metadata.subject;
    const senderNumber = sender.split("@")[0];
    const currentTime = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    const contextInfo = msg.message?.extendedTextMessage?.contextInfo || {};
    const reportedUser = contextInfo.participant || contextInfo.mentionedJid?.[0];

    if (!reportedUser) {
      return reinbot.sendMessage(from, {
        text: "⚠️ Mohon balas atau tag pengguna yang ingin dilaporkan.",
      }, { quoted: msg });
    }

    const alasan = "Perilaku tidak pantas";

    const reportMessage = `⚠️ *LAPORAN PENGGUNA DI GRUP*

👥 *Grup:* ${groupName}
🕒 *Waktu:* ${currentTime}
🙋‍♂️ *Pelapor:* @${senderNumber}
🚫 *Dilaporkan:* @${reportedUser.split("@")[0]}
📄 *Alasan:* ${alasan}

📌 Mohon dicek oleh admin.`;

    // Kirim ke semua admin
    for (const adminId of groupAdmins) {
      await reinbot.sendMessage(adminId, {
        text: reportMessage,
        contextInfo: {
          mentionedJid: [sender, reportedUser]
        }
      });
    }

    // Ambil gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    await reinbot.sendMessage(from, {
      text: "✅ Laporan kamu telah dikirim ke admin grup.",
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          title: "Laporan Dikirim",
          body: "Admin akan segera memeriksa laporan kamu.",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error fitur report:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengirim laporan.",
    }, { quoted: msg });
  }
  break;
}
case "report18+": {
  try {
    if (!msg.key.remoteJid.endsWith("@g.us")) return;

    const metadata = await reinbot.groupMetadata(from);
    const groupAdmins = metadata.participants.filter(p => p.admin).map(p => p.id);
    const groupName = metadata.subject;
    const senderNumber = sender.split("@")[0];
    const currentTime = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    const contextInfo = msg.message?.extendedTextMessage?.contextInfo || {};
    const reportedUser = contextInfo.participant || contextInfo.mentionedJid?.[0];

    if (!reportedUser) {
      return reinbot.sendMessage(from, {
        text: "⚠️ Mohon balas atau tag pengguna yang ingin dilaporkan.",
      }, { quoted: msg });
    }

    const alasan = "Konten 18+";

    const reportMessage = `🔞 *LAPORAN KONTEN 18+ DI GRUP*

👥 *Grup:* ${groupName}
🕒 *Waktu:* ${currentTime}
🙋‍♂️ *Pelapor:* @${senderNumber}
🚫 *Dilaporkan:* @${reportedUser.split("@")[0]}
📄 *Alasan:* ${alasan}

📌 Mohon segera ditindak oleh admin.`;

    for (const adminId of groupAdmins) {
      await reinbot.sendMessage(adminId, {
        text: reportMessage,
        contextInfo: {
          mentionedJid: [sender, reportedUser]
        }
      });
    }

    // Tambahkan gambar elaina.jpg dari data
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    await reinbot.sendMessage(from, {
      text: "✅ Laporan konten 18+ telah dikirim ke admin grup.",
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          title: "Laporan 18+ Terkirim",
          body: "Mohon tunggu tindakan dari admin grup.",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error fitur report18+:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengirim laporan konten 18+.",
    }, { quoted: msg });
  }
  break;
}
      case "admin": {
        try {
          const isGroup = msg.key.remoteJid.endsWith("@g.us");
          const groupMetadata = isGroup ? await reinbot.groupMetadata(from) : {};
          const participants = isGroup ? groupMetadata.participants : [];
          const senderId = msg.key.participant || msg.key.remoteJid;
          const isAdmin = isGroup ? participants.find(p => p.id === senderId)?.admin !== null : false;
          const isOwner = groupMetadata.owner === senderId;

          if (!isAdmin && !isOwner) {
            await reinbot.sendMessage(from, {
              text: "❌ Fitur ini hanya bisa digunakan oleh admin grup."
            }, { quoted: msg });
            break;
          }

          const teks = `👮 *Menu Admin Grup*\n
      🔊 *.tagall* – Mention semua member
      ➕ *.add 628xxxx* – Tambah member
      ❌ *.kick @user* – Kick member
      📈 *.promote @user* – Promote jadi admin

      📌 Gunakan perintah sesuai yang tertera di atas.`;

          await reinbot.sendMessage(from, { text: teks }, { quoted: msg });

        } catch (err) {
          console.error("❌ Error menu admin:", err);
          await reinbot.sendMessage(from, {
            text: "⚠️ Gagal menampilkan menu admin."
          }, { quoted: msg });
        }

        break;
      }
      case "tagall": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya bisa digunakan di dalam grup."
      }, { quoted: msg });
      break;
    }

    const groupMetadata = await reinbot.groupMetadata(from);
    const participants = groupMetadata.participants;
    const senderId = msg.key.participant || msg.key.remoteJid;

    const isAdmin = participants.find(p => p.id === senderId)?.admin !== null;
    const isOwner = groupMetadata.owner === senderId;

    if (!isAdmin && !isOwner) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya bisa digunakan oleh admin grup."
      }, { quoted: msg });
      break;
    }

    const mentions = participants.map(p => p.id);
    const listTag = mentions.map((jid, i) => `${i + 1}. @${jid.split("@")[0]}`).join("\n");

    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    await reinbot.sendMessage(from, {
      text: `📣 *Tag All by Admin*\n\n${listTag}`,
      mentions: mentions,
      contextInfo: {
        mentionedJid: mentions,
        externalAdReply: {
          title: "TAG SEMUA ANGGOTA",
          body: "Admin memanggil semua anggota grup",
          thumbnail: imageBuffer,
          mediaType: 1,
          sourceUrl: "https://facebook.com/YourPageID"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error di fitur tagall:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal menjalankan tagall."
    }, { quoted: msg });
  }

  break;
}
case "kick": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya bisa digunakan di dalam grup."
      }, { quoted: msg });
      break;
    }

    const groupMetadata = await reinbot.groupMetadata(from);
    const participants = groupMetadata.participants;
    const senderId = msg.key.participant || msg.key.remoteJid;
    const isAdmin = participants.find(p => p.id === senderId)?.admin !== null;
    const isOwner = groupMetadata.owner === senderId;

    if (!isAdmin && !isOwner) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya untuk admin grup."
      }, { quoted: msg });
      break;
    }

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      await reinbot.sendMessage(from, {
        text: "⚠️ Format salah!\n\nContoh: *.kick @user* (tag user yang ingin dikeluarkan)"
      }, { quoted: msg });
      break;
    }

    const target = mentioned[0];
    if (target === senderId) {
      await reinbot.sendMessage(from, {
        text: "❌ Kamu tidak bisa mengeluarkan dirimu sendiri."
      }, { quoted: msg });
      break;
    }

    // Proses keluarkan user dulu
    await reinbot.groupParticipantsUpdate(from, [target], "remove");

    // Ambil gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    // Kirim pesan konfirmasi dikeluarkan
    await reinbot.sendMessage(from, {
      text: `✅ Sukses mengeluarkan @${target.split("@")[0]}`,
      mentions: [target],
      contextInfo: {
        mentionedJid: [target],
        externalAdReply: {
          title: "Anggota Telah Dikeluarkan",
          body: "Dikelola oleh Admin",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error kick:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal mengeluarkan anggota. Mungkin karena bot bukan admin atau target adalah admin juga."
    }, { quoted: msg });
  }

  break;
}
case "addmember": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya bisa digunakan di dalam grup."
      }, { quoted: msg });
      break;
    }

    const groupMetadata = await reinbot.groupMetadata(from);
    const participants = groupMetadata.participants;
    const senderId = msg.key.participant || msg.key.remoteJid;

    const isAdmin = participants.find(p => p.id === senderId)?.admin !== null;
    const isOwner = groupMetadata.owner === senderId;

    if (!isAdmin && !isOwner) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya untuk admin grup."
      }, { quoted: msg });
      break;
    }

    const args = msgText.split(" ");
    if (args.length < 2) {
      await reinbot.sendMessage(from, {
        text: "⚠️ Format salah!\n\nContoh: *.add 6281234567890*"
      }, { quoted: msg });
      break;
    }

    const number = args[1].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await reinbot.groupParticipantsUpdate(from, [number], "add");

    // Kirim pesan dengan gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    await reinbot.sendMessage(from, {
      text: `✅ Berhasil menambahkan @${args[1]}`,
      mentions: [number],
      contextInfo: {
        externalAdReply: {
          title: "Anggota Baru Ditambahkan",
          body: "Disambut oleh Admin",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Gagal menambahkan anggota:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal menambahkan anggota. Pastikan nomor benar dan tidak mengatur privasi undangan grup."
    }, { quoted: msg });
  }

  break;
}
case "promote": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya bisa digunakan di dalam grup."
      }, { quoted: msg });
      break;
    }

    const groupMetadata = await reinbot.groupMetadata(from);
    const participants = groupMetadata.participants;
    const senderId = msg.key.participant || msg.key.remoteJid;
    const isAdmin = participants.find(p => p.id === senderId)?.admin !== null;
    const isOwner = groupMetadata.owner === senderId;

    if (!isAdmin && !isOwner) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya untuk admin grup."
      }, { quoted: msg });
      break;
    }

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      await reinbot.sendMessage(from, {
        text: "⚠️ Format salah!\n\nContoh: *.promote @user*"
      }, { quoted: msg });
      break;
    }

    const target = mentioned[0];
    await reinbot.groupParticipantsUpdate(from, [target], "promote");

    // Gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    await reinbot.sendMessage(from, {
      text: `✅ Berhasil menjadikan @${target.split("@")[0]} sebagai admin.`,
      mentions: [target],
      contextInfo: {
        externalAdReply: {
          title: "PROMOTE MEMBER",
          body: "Sekarang dia adalah admin",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error promote:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal promote. Pastikan bot adalah admin."
    }, { quoted: msg });
  }

  break;
}
case "demote": {
  try {
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    if (!isGroup) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya bisa digunakan di dalam grup."
      }, { quoted: msg });
      break;
    }

    const groupMetadata = await reinbot.groupMetadata(from);
    const participants = groupMetadata.participants;
    const senderId = msg.key.participant || msg.key.remoteJid;
    const isAdmin = participants.find(p => p.id === senderId)?.admin !== null;
    const isOwner = groupMetadata.owner === senderId;

    if (!isAdmin && !isOwner) {
      await reinbot.sendMessage(from, {
        text: "❌ Perintah ini hanya untuk admin grup."
      }, { quoted: msg });
      break;
    }

    const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      await reinbot.sendMessage(from, {
        text: "⚠️ Format salah!\n\nContoh: *.demote @user*"
      }, { quoted: msg });
      break;
    }

    const target = mentioned[0];
    await reinbot.groupParticipantsUpdate(from, [target], "demote");

    // Gambar elaina.jpg
    const imagePath = path.join(__dirname, "data", "elaina.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    await reinbot.sendMessage(from, {
      text: `✅ Berhasil menurunkan @${target.split("@")[0]} dari admin.`,
      mentions: [target],
      contextInfo: {
        externalAdReply: {
          title: "DEMOTE MEMBER",
          body: "Bukan admin lagi sekarang",
          mediaType: 1,
          thumbnail: imageBuffer,
          sourceUrl: "https://www.facebook.com/YourPageIDOrLink"
        }
      }
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Error demote:", err);
    await reinbot.sendMessage(from, {
      text: "⚠️ Gagal unpromote. Pastikan bot adalah admin."
    }, { quoted: msg });
  }

  break;
}
      // ============================================================
     
    default:
      require("./features/users")(
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
      );
      require("./features/groups")(
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
      );
      require("./features/contacts")(
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
      );
      require("./features/broadcast")(
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
      );
      require("./features/pushkontak")(
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
      );
      require("./features/setting")(
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
      );
      require("./features/lainnya")(
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
      );
      break;
  }
};
