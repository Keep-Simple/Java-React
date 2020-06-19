import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon, CardMeta } from 'semantic-ui-react';
import moment from 'moment';

import styles from './styles.module.scss';
import PopupReactionInfo from '../PopupReactionInfo';
import { getUserImgLink } from '../../helpers/imageHelper';

const Post = ({
  post, likePost, dislikePost, deletePost, toggleEditPost, toggleExpandedPost, sharePost, currentUserId
}) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;
  const date = moment(createdAt)
    .fromNow();

  return (
    <Card color="grey" style={{ width: '100%', borderRadius: '15px' }}>
      <Card.Content>
        <CardMeta>
          <Label as="a" image style={{ borderRadius: '17px' }}>
            <Image style={{ borderRadius: '17px' }} centered src={getUserImgLink(user.image)} />
            <span />
            {user.username}
          </Label>
          <span className="date">
            added post
            {' - '}
            {date}
          </span>
        </CardMeta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <div>
        {image && <Image src={image.link} />}
      </div>
      <Card.Content extra>
        <PopupReactionInfo
          isPostReaction
          forLikes
          postOrComment={post}
          reactionsCount={likeCount}
          applyReaction={likePost}
        />
        <PopupReactionInfo
          isPostReaction
          forLikes={false}
          postOrComment={post}
          reactionsCount={dislikeCount}
          applyReaction={dislikePost}
        />
        <Label basic as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
          <Icon name="comments outline" />
          {commentCount}
        </Label>
        <span style={{ float: 'right' }}>
          <Label
            basic
            style={{ opacity: 0.55 }}
            as="a"
            className={styles.toolbarBtn}
            onClick={() => sharePost(id)}
          >
            <Icon name="share alternate" />
            Share
          </Label>
          {
            currentUserId === user.id
              ? (
                <span>
                  <Label
                    style={{ opacity: 0.55 }}
                    basic
                    as="a"
                    className={styles.toolbarBtn}
                    onClick={() => toggleEditPost(post)}
                  >
                    <Icon name="pencil alternate" />
                    Edit
                  </Label>
                  <Label
                    style={{ opacity: 0.45, color: 'red' }}
                    basic
                    as="a"
                    className={styles.toolbarBtn}
                    onClick={() => deletePost(id)}
                  >
                    <Icon name="archive" />
                    Delete
                  </Label>
                </span>
              )
              : null
          }
        </span>
      </Card.Content>
    </Card>
  );
};

Post.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUserId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired
};

export default Post;
