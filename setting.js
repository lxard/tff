module.exports = {
  name: "Lx",
  version: "4.1.0",
  number: "",
  owner: {
    name: "Lx",
    number: "628389507909",
    whatsapp: "6283895079009@s.whatsapp.net",
    instagram: "https://instagram.com",
  },
  author: {
    name: "Lx",
    number: "6283895079009",
    whatsapp: "6283895079009@s.whatsapp.net",
    instagram: "https://instagram.com",
  },
  features: {
    antiCall: {
      status: true,
      block: false,
    },
    selfMode: false,
    broadcast: {
      text: "",
      limit: 9999,
      jeda: 500,
      filterContact: false,
    },
    pushContacts: {
      text: "",
      limit: 100000,
      jeda: 500,
      filterContacts: false,
    },
  },

  // 🔑 Tambahkan ini
  vercelToken: "15Epfj8dcHVWPlz5feskgxo8"
};


case "add": {
    let avatar = 'https://files.catbox.moe/nwvkbt.png';
    try {
        avatar = await kyzo.profilePictureUrl(jid, 'image');
    } catch {}

    const imageUrl = `https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(avatar)}&background=https://files.catbox.moe/f1vf5v.jpeg&description=${encodeURIComponent('@' + jid.split('@')[0])}`;

    const introText = `Hai @${jid.split("@")[0]} 👋\nSelamat datang di *${subject}*!\nJangan lupa baca deskripsi grup dan tetap patuhi aturan. 😊✨\n\nSelamat datang! Jangan lupa perkenalan ya ~\n\n┏━━━━°⌜ 陰陽 ⌟°━━━━┓\n\n-ˋˏ [] ˎˊ-\n𝐌𝐞𝐦𝐛𝐞𝐫 𝐁𝐚𝐫𝐮 𝐈𝐧𝐭𝐫𝐨\n╰─▸𝗡𝗮𝗺𝗮 :\n╰─▸𝗨𝗺𝘂𝗿 :\n╰─▸𝗔𝘀𝗸𝗼𝘁 :\n╰─▸𝗪𝗮𝗶𝗳𝘂/𝗵𝘂𝘀𝗯𝘂 :\n╰─▸𝗧𝗧/𝗜𝗚 :\n╰─▸𝗚𝗲𝗻𝗱𝗲𝗿 :\n\n┗━━━━°⌜ 陰陽 ⌟°━━━━┛\n\nKlik link berikut untuk melihat kartu sambutanmu:\n${imageUrl}`;

    await kyzo.sendMessage(id, {
        text: introText,
        contextInfo: {
            mentionedJid: [jid],
            externalAdReply: {
                title: `Welcome to ${subject}!`,
                body: `Klik untuk melihat kartu sambutan 🎉`,
                mediaType: 1,
                thumbnailUrl: imageUrl,
                renderLargerThumbnail: true,
                showAdAttribution: false,
                sourceUrl: imageUrl
            }
        }
    }, {
        ephemeralExpiration: WA_DEFAULT_EPHEMERAL
    });
    break;
}
case "remove": {
    let avatar = 'https://files.catbox.moe/nwvkbt.png';
    try {
        avatar = await kyzo.profilePictureUrl(jid, 'image');
    } catch {}

    const imageUrl = `https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(avatar)}&background=https://files.catbox.moe/f1vf5v.jpeg&description=${encodeURIComponent('@' + jid.split('@')[0])}`;

    const goodbyeText = `Anggota @${jid.split("@")[0]} telah meninggalkan grup *${subject}*.\n\nKami mengucapkan terima kasih atas partisipasi dan kontribusinya. Semoga segala urusan dan langkah ke depannya diberikan kemudahan dan kesuksesan.\n\nHormat kami,\nTim *${subject}*\n\n📎 Kartu perpisahan:\n${imageUrl}`;

    await kyzo.sendMessage(id, {
        text: goodbyeText,
        contextInfo: {
            mentionedJid: [jid],
            externalAdReply: {
                title: `Perpisahan dari ${subject}`,
                body: `Klik untuk melihat kartu perpisahan 👋`,
                mediaType: 1,
                thumbnailUrl: imageUrl,
                renderLargerThumbnail: true,
                showAdAttribution: false,
                sourceUrl: imageUrl
            }
        }
    }, {
        ephemeralExpiration: WA_DEFAULT_EPHEMERAL
    });
    break;
}

