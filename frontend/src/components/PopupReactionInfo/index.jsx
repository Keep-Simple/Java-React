import React, { useState } from 'react';
import { Icon, Image, Label, List, ListContent, ListItem, Loader, Popup, PopupContent } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { getDislikeInfo, getLikeInfo } from '../../services/postService';
import styles from '../Post/styles.module.scss';
import { getUserImg } from '../../helpers/imageHelper';

const PopupReactionInfo = ({
  forLikes,
  setReactionState,
  reactionState,
  post,
  reactionsCount,
  changeReactionColor,
  applyReaction,
  // eslint-disable-next-line react/prop-types
  isLike
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Popup
      position="right center"
      onOpen={async () => {
        setReactionState(forLikes ? await getLikeInfo(post.id) : await getDislikeInfo(post.id));
        setLoaded(true);
      }}
      flowing
      trigger={(
        <Label
          basic
          size="small"
          as="a"
          className={styles.toolbarBtn}
          onClick={() => applyReaction(post, changeReactionColor)}
        >
          {forLikes
            ? <Icon color={isLike ? 'red' : null} name="thumbs up outline" />
            : <Icon color={isLike === false ? 'blue' : null} name="thumbs down outline" />}
          {reactionsCount}
        </Label>
      )}
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {loaded ? reactionState.length
        ? (
          <PopupContent>
            <List horizontal size="small">
              {reactionState.map(i => (
                <ListItem key={i.id}>
                  <Image avatar src={getUserImg(i.imgLink)} />
                  <ListContent>
                    { i.username }
                  </ListContent>
                </ListItem>
              ))}
            </List>
          </PopupContent>
        )
        : <PopupContent content={forLikes ? 'No likes😞' : 'No dislikes😃'} />
        : <Loader size="tiny" active inline="centered" />}
    </Popup>
  );
};

PopupReactionInfo.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  reactionState: PropTypes.arrayOf(PropTypes.object).isRequired,
  forLikes: PropTypes.bool.isRequired,
  reactionsCount: PropTypes.number.isRequired,
  setReactionState: PropTypes.func.isRequired,
  changeReactionColor: PropTypes.func.isRequired,
  applyReaction: PropTypes.func.isRequired
};

export default PopupReactionInfo;
