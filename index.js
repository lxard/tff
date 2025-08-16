const baileys = require("@whiskeysockets/baileys");
const reinbotSocket = baileys.default;
const { useMultiFileAuthState } = baileys;

const Pino = require("pino");
const { join } = require("path");
const NodeCache = require("node-cache");
const { readFileSync } = require("fs");
const qrcode = require("qrcode-terminal"); // Tambahkan untuk handle QR manual

let useCode = false;
let phoneNumber = "";
const iPhoneNumber = process.argv.findIndex((val) =>
  val.startsWith("--number")
);
if (iPhoneNumber >= 0) {
  useCode = true;
  phoneNumber = process.argv[iPhoneNumber]?.split("=")[1];
}

const logger = require("./utils/logger.js");
const extra = require("./lib/extra.js");

let creds;
let browser;

try {
  creds = JSON.parse(readFileSync(join(__dirname, "./data/auth/creds.json")));
} catch (err) {
  creds = null;
}

const msgRetryCounterCache = new NodeCache();

async function runReinbot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    join(__dirname, "./data/auth")
  );

  browser = (!creds || !creds.pairingCode)
    ? (useCode ? ["Chrome (Linux)", "", ""] : ["Google Chrome (Linux)", "", ""])
    : ["Chrome (Linux)", "", ""];

  const reinbot = reinbotSocket({
    logger: Pino({ level: "silent" }),
    auth: state,
    browser,
    generateHighQualityLinkPreview: true,
    defaultQueryTimeoutMs: undefined,
    syncFullHistory: false,
    msgRetryCounterCache,
  });

  extra(reinbot); // Tidak gunakan store, hanya reinbot saja

  if (useCode && !reinbot.user && !reinbot.authState.creds.registered) {
    async function connectReinbotWithPairingCode() {
      if (!phoneNumber) {
        const question = require("./utils/question.js");
        phoneNumber = await question(
          "Masukkan nomor whatsapp anda (Contoh: 628123456789): +"
        );
      }
      try {
        logger("info", "KONEKSI", "𝘞𝘢𝘪𝘵 𝘍𝘪𝘷𝘦 𝘚𝘦𝘤𝘰𝘯𝘥 𝘍𝘰𝘳 𝘛𝘩𝘦 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘊𝘰𝘥𝘦");
        setTimeout(async () => {
          let code = await reinbot.requestPairingCode(phoneNumber);
          code = code?.match(/.{1,4}/g)?.join("-") || code;
          logger("primary", "KONEKSI", `𝘠𝘰𝘶𝘳 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘊𝘰𝘥𝘦: ${code}`);
        }, 5000);
      } catch (err) {
        logger("error", "KONEKSI", err);
      }
    }
    await connectReinbotWithPairingCode();
  }

  reinbot.ev.on("connection.update", async (c) => {
    const { connection, lastDisconnect, qr } = c;

    // Tampilkan QR manual jika tersedia
    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const errorStatusCode = lastDisconnect?.error?.output?.payload?.statusCode;
      const errorMessage = lastDisconnect?.error?.output?.payload?.message;
      if ([515, 500, 428, 408].includes(errorStatusCode)) {
        logger("error", "KONEKSI", errorMessage);
        runReinbot();
      } else if (errorStatusCode === 503 && errorMessage === "Stream Errored (unknown)") {
        logger("error", "KONEKSI", errorMessage);
        process.exit();
      } else if (errorStatusCode === 440) {
        logger("error", "KONEKSI", errorMessage);
        process.exit();
      } else if (errorStatusCode === 401) {
        logger("error", "KONEKSI", errorMessage);
        await reinbot.logout();
        runReinbot();
      }
      console.log(lastDisconnect?.error);
    }

    if (connection === "open") {
      logger("primary", "KONEKSI", `𝘊𝘰𝘯𝘦𝘤𝘵𝘦𝘥 ${reinbot.user.id.split(":")[0]}`);
    }
  });

  reinbot.ev.on("creds.update", saveCreds);
  reinbot.ev.on("call", (c) => require("./events/call.js")(reinbot, c));
  reinbot.ev.on("messages.upsert", (m) =>
    require("./events/message.js")(reinbot, m)
  );
  reinbot.ev.on("group-participants.update", (g) =>
    require("./events/group.js")(reinbot, g)
  );
}

runReinbot();
