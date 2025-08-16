const logger = require("../utils/logger.js");
const setting = require("../setting.js");

module.exports = async (reinbot, c) => {
  const { id, from, status } = c[0];
  if (status === "offer") {
    logger("info", "CALL", `\x1b[1mFROM:\x20${from.split("@")[0]}\x1b[0m`);
    if (setting.features.antiCall.status) {
      await reinbot.rejectCall(id, from);
      logger(
        "primary",
        "ANTICALL",
        `\x1b[1mREJECT CALL FROM:\x20${from.split("@")[0]}\x1b[0m`
      );
      if (setting.features.antiCall.block) {
        await reinbot.updateBlockStatus(id, "block");
        logger(
          "primary",
          "ANTICALL / BLOCK",
          `\x1b[1mBLOCK USER ${from.split("@")[0]}\x1b[0m`
        );
      }
    }
  }
};
