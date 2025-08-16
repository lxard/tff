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
  groupMetadata,
  participants,
  logger
) => {
  switch (command) {
    case "anticall":
    case "ac":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      try {
        setting.features.antiCall.status = !setting.features.antiCall.status;
        return replyCommand(
          `*ANTICALL* ${
            setting.features.antiCall.status ? "✅" : "❌"
          }`
        );
      } catch (err) {
        logger("error", "ANTICALL", err);
        replyCommand(err);
      }
      break;
    case "selfmode":
    case "sm":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      try {
        setting.features.selfMode = !setting.features.selfMode;
        return replyCommand(
          `*SELFMODE* ${
            setting.features.selfMode ? "✅" : "❌"
          }`
        );
      } catch (err) {
        logger("error", "ANTICALL", err);
        replyCommand(err);
      }
      break;
    case "setlimitbc":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!text) {
        return replyCommand(
          `Perintah salah gunakan command .setlimitbc 1000`
        );
      }
      if (isNaN(text)) {
        return replyCommand(
          `Perintah salah gunakan command .setlimitbc 1000`
        );
      }
      try {
        setting.features.broadcast.limit = text;
        return replyCommand(
          `*DONE!*\n*_Limit broadcast_* saat ini ${setting.features.broadcast.limit}`
        );
      } catch (err) {
        logger("error", "SETBCLIMIT", err);
        replyCommand(err);
      }
      break;
    case "setjedabc":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!text) {
        return replyCommand(
          `Perintah salah gunakan command .setjedabc 7000`
        );
      }
      if (isNaN(text)) {
        return replyCommand(
          `Perintah salah gunakan command .setjedabc 7000`
        );
      }
      try {
        setting.features.broadcast.jeda = text;
        return replyCommand(
          `*DONE!*\n*_Jeda broadcast_* saat ini ${setting.features.broadcast.jeda}ms`
        );
      } catch (err) {
        logger("error", "SETBCJEDA", err);
        replyCommand(err);
      }
      break;
    case "setlimitpush":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!text) {
        return replyCommand(
          `Perintah salah gunakan command .setlimitpush 1000`
        );
      }
      if (isNaN(text)) {
        return replyCommand(
          `Perintah salah gunakan command .setlimitpush 1000`
        );
      }
      try {
        setting.features.pushContacts.limit = text;
        return replyCommand(
          `*DONE!*\n*_Limit push kontak_* saat ini ${setting.features.pushContacts.limit}`
        );
      } catch (err) {
        logger("error", "SETPKLIMIT", err);
        replyCommand(err);
      }
      break;
    case "setjedapush":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      if (!text) {
        return replyCommand(
          `Perintah salah gunakan command .setjedapush 7000`
        );
      }
      if (isNaN(text)) {
        return replyCommand(
          `Perintah salah gunakan command .setjedapush 7000`
        );
      }
      try {
        setting.features.pushContacts.jeda = text;
        return replyCommand(
          `*DONE!*\n*_Jeda push kontak_* saat ini ${setting.features.pushContacts.jeda}ms`
        );
      } catch (err) {
        logger("error", "SETPKJEDA", err);
        replyCommand(err);
      }
      break;
  }
};
