import React, { useState } from 'react';
import {
  CommentAction,
  Icon,
  Image,
  Label,
  List,
  ListContent,
  ListItem,
  Loader,
  Popup,
  PopupContent
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { getCommentDislikeInfo, getCommentLikeInfo, getDislikeInfo, getLikeInfo } from '../../services/postService';
import styles from '../Post/styles.module.scss';
import { getUserImg } from '../../helpers/imageHelper';

const PopupReactionInfo = ({
  isPostReaction,
  forLikes,
  postOrComment,
  reactionsCount,
  applyReaction
}) => {
  const [loaded, setLoaded] = useState(false);
  const [reactionState, setReactionState] = useState([]);
  return (
    <Popup
      position="bottom left"
      hoverable
      inverted
      onOpen={async () => {
        // eslint-disable-next-line no-nested-ternary
        setReactionState(isPostReaction
          ? forLikes ? await getLikeInfo(postOrComment.id) : await getDislikeInfo(postOrComment.id)
          : forLikes ? await getCommentLikeInfo(postOrComment.id) : await getCommentDislikeInfo(postOrComment.id));
        setLoaded(true);
      }}
      mouseEnterDelay={500}
      mouseLeaveDelay={100}
      on="hover"
      flowing
      style={{ padding: '6px', borderRadius: '15px' }}
      trigger={(isPostReaction
        ? (
          <Label
            basic
            as="a"
            className={styles.toolbarBtn}
            onClick={() => applyReaction(postOrComment)}
          >
            {forLikes
              ? <Icon name="thumbs up outline" />
              : <Icon name="thumbs down outline" />}
            {reactionsCount}
          </Label>
        )
        : (
          <CommentAction>
            <span onClick={() => applyReaction(postOrComment)}>
              {forLikes
                ? <Icon name="thumbs up outline" />
                : <Icon name="thumbs down outline" />}
              {reactionsCount }
            </span>
          </CommentAction>
        )
      )}
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {loaded ? reactionState.length
        ? (
          <PopupContent>
            <List horizontal>
              {reactionState.map(i => (
                <ListItem key={i.id}>
                  <Image avatar src={getUserImg(i.imgLink)} />
                  <ListContent content={i.username} />
                </ListItem>
              ))}
            </List>
          </PopupContent>
        )
        : <PopupContent content={forLikes ? 'No likes😞' : 'No dislikes😃'} />
        : <Loader size="small" active inline="centered" />}
    </Popup>
  );
};

PopupReactionInfo.propTypes = {
  postOrComment: PropTypes.objectOf(PropTypes.any).isRequired,
  forLikes: PropTypes.bool.isRequired,
  isPostReaction: PropTypes.bool.isRequired,
  reactionsCount: PropTypes.number.isRequired,
  applyReaction: PropTypes.func.isRequired
};

export default PopupReactionInfo;
