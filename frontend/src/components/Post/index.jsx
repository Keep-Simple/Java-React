import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';

import styles from './styles.module.scss';
import PopupReactionInfo from '../PopupReactionInfo';

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
    <Card style={{ width: '100%' }}>
      {image && <Image src={image.link} wrapped ui={false} />}
      <Card.Content>
        <Card.Meta>
          <span className="date">
            posted by
            {' '}
            {user.username}
            {' - '}
            {date}
          </span>
        </Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
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
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
          <Icon name="comments outline" />
          {commentCount}
        </Label>
        <Label
          basic
          style={{ opacity: 0.55 }}
          size="small"
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
                  size="small"
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
                  size="small"
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
