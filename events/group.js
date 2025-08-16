const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger.js");

const welcomePath = path.join(__dirname, "../data/welcome.json");

// Load pesan welcome dari file JSON
let welcomeMessages = {};
try {
  welcomeMessages = JSON.parse(fs.readFileSync(welcomePath));
} catch (e) {
  logger("warn", "GROUP", "Gagal membaca welcome.json, menggunakan default.");
  welcomeMessages = {};
}

module.exports = async (reinbot, g) => {
  const { id, participants, action } = g;
  if (!participants || participants.length === 0) return;

  try {
    const metadata = await reinbot.groupMetadata(id);
    const groupName = metadata.subject;

    for (const user of participants) {
      const username = user.split("@")[0];

      // Ambil URL foto profil
      let profilePicUrl;
      try {
        profilePicUrl = await reinbot.profilePictureUrl(user, "image");
      } catch (e) {
        profilePicUrl = "https://i.ibb.co/7yz1Rdf/default-pfp.png"; // default jika gagal
      }

      if (action === "add") {
        const defaultWelcome = `@${username} bergabung dengan grup *${groupName}*

Selamat datang! Jangan lupa perkenalan ya ~

┏━━━━°⌜ 陰陽 ⌟°━━━━┓

-ˋˏ [] ˎˊ-
𝐌𝐞𝐦𝐛𝐞𝐫 𝐁𝐚𝐫𝐮 𝐈𝐧𝐭𝐫𝐨
╰─▸𝗡𝗮𝗺𝗮 :
╰─▸𝗨𝗺𝘂𝗿 :
╰─▸𝗔𝘀𝗸𝗼𝘁 :
╰─▸𝗪𝗮𝗶𝗳𝘂/𝗵𝘂𝘀𝗯𝘂 :
╰─▸𝗧𝗧/𝗜𝗚 :
╰─▸𝗚𝗲𝗻𝗱𝗲𝗿 :

┗━━━━°⌜ 陰陽  ⌟°━━━━┛`;

        let welcomeText = welcomeMessages[id] || defaultWelcome;
        welcomeText = welcomeText
          .replace(/@user/gi, `@${username}`)
          .replace(/@group/gi, groupName);

        await reinbot.sendMessage(id, {
          text: welcomeText,
          mentions: [user], // ✅ mention WA
          contextInfo: {
            mentionedJid: [user], // 🔧 WA membutuhkan ini agar tag aktif
            externalAdReply: {
              title: `Selamat Datang!`,
              body: `${groupName}`,
              thumbnailUrl: profilePicUrl,
              sourceUrl: "https://chat.whatsapp.com/",
              mediaType: 1,
              renderLargerThumbnail: true,
              showAdAttribution: true
            }
          }
        });

      } else if (action === "remove") {
        const farewellText = `「 𝗣𝗘𝗥𝗣𝗜𝗦𝗔𝗛𝗔𝗡 」

@${username} telah meninggalkan grup *${groupName}*...
Semoga sukses di jalanmu sendiri 🌸`;

        await reinbot.sendMessage(id, {
          text: farewellText,
          mentions: [user], // ✅ memastikan tetap tag
          contextInfo: {
            mentionedJid: [user], // 🔧 WA butuh ini agar @username aktif
            externalAdReply: {
              title: `Selamat Tinggal`,
              body: `${username} keluar dari grup`,
              thumbnailUrl: profilePicUrl,
              sourceUrl: "https://chat.whatsapp.com/",
              mediaType: 1,
              renderLargerThumbnail: true,
              showAdAttribution: true
            }
          }
        });
      }
    }
  } catch (err) {
    logger("error", "GROUP", `Gagal memproses event grup: ${err.message}`);
  }
};