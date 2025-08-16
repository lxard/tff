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
    case "groups":
    case "group":
    case "cekidgc":
      logCommand();
      if (!isMe && !isOwner) {
        return onlyOwner();
      }
      try {
        const allGroups = await reinbot.groupFetchAllParticipating();
        if (
          !allGroups ||
          allGroups.length === 0 ||
          !Object.values(allGroups) ||
          Object.values(allGroups).length === 0
        ) {
          logger(
            "error",
            "GROUP",
            `\x20\x20\x1b[1mData group ${
              allGroups.length || 0
            }\x1b[0m\n\x20\x20\x1b[1mGabung lebih banyak group sekarang\x1b[0m\n\x20\x20\x1b[1mTUTORIAL:\x1b[0m\x20`
          );
          return replyCommand(
            `\x20*Data group ${
              allGroups.length || 0
            }*\nGabung lebih banyak group sekarang\n*TUTORIAL:*\x20`
          );
        } else {
          return replyCommand(
            `*BOT BY AJO*\n\x20*JUMLAH GRUP ANDA:*\x20${
              Object.values(allGroups).length
            }\n\n${Object.values(allGroups)
              .map(
                (group, index) =>
                  `${index + 1}.\x20*Grup name:*\x20${
                    group.subject
                  }\n\x20\x20\x20*Group id:*\x20${
                    group.id
                  }\n\x20\x20\x20*Jumlah member:*\x20${
                    group.participants.length
                  }\n*BY AJO*`
              )
              .join("\n\n")}`
          );
        }
      } catch (err) {
        logger("error", "SHOWGROUPS", err);
        replyCommand(err);
      }
      break;
  }
};
