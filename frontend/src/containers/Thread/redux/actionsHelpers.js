export const reactionsDiffFunc = (reaction, isLike) => {
  let likeDiff;
  let dislikeDiff;

  if (reaction?.id) {
    if (reaction.isLike === isLike) {
      likeDiff = (+isLike);
      dislikeDiff = (+!isLike);
    } else {
      likeDiff = 0;
      dislikeDiff = 0;
    }
  } else {
    // reaction was deleted
    likeDiff = -(+isLike);
    dislikeDiff = -(+!isLike);
  }

  const mapReactions = postOrCom => ({
    ...postOrCom,
    likeCount: Number(postOrCom.likeCount) + likeDiff,
    dislikeCount: Number(postOrCom.dislikeCount) + dislikeDiff
  });

  return mapReactions;
};
