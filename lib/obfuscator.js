const obfuscator = require("javascript-obfuscator");
const { readFile, writeFile } = require("fs");
const { join } = require("path");

const files = [
  "index.js",
  "case.js",
  "setting.js",
  "utils/logger.js",
  "utils/question.js",
  "utils/broadcast.js",
  "utils/getDateTime.js",
  "utils/readUsers.js",
  "utils/saveUsers.js",
  "utils/dropUsers.js",
  "utils/pushContacts.js",
  "utils/saveContacts.js",
  "utils/createSticker.js",
  "events/call.js",
  "events/message.js",
  "events/group.js",
  "lib/extra.js",
  "features/users.js",
  "features/groups.js",
  "features/contacts.js",
  "features/broadcast.js",
  "features/pushkontak.js",
  "features/setting.js",
  "features/lainnya.js",
];

function obfuscated(filePath) {
  readFile(join(__dirname, `../${filePath}`), "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const obfuscatedCode = obfuscator
      .obfuscate(data, {
        compact: true,
        renameGlobals: true,
        splitStrings: true,
        unicodeEscapeSequence: true,
      })
      .getObfuscatedCode();
    writeFile(
      join(__dirname, `../encrypting/${filePath}`),
      obfuscatedCode,
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Berhasil encrypt file ${filePath}`);
      }
    );
  });
}

files.forEach((file) => obfuscated(file));
