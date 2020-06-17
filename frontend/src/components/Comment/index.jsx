import React from 'react';
import PropTypes from 'prop-types';
import { Comment as CommentUI, Icon, Popup, PopupContent } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';

import styles from './styles.module.scss';

const Comment = ({ comment, currentUserId, toggleEdit, softDeleteComment, like, dislike }) => (
  <CommentUI className={styles.comment}>
    <CommentUI.Avatar src={getUserImgLink(comment.user.image)} />
    <CommentUI.Content>
      <CommentUI.Author as="a">
        {comment.user.username}
      </CommentUI.Author>
      <CommentUI.Metadata>
        {moment(comment.createdAt)
          .fromNow()}
      </CommentUI.Metadata>
      <CommentUI.Text>
        {comment.body}
      </CommentUI.Text>
      <CommentUI.Actions>
        <CommentUI.Action>
          <Popup trigger={(
            <span onClick={() => like(comment)}>
              <Icon name="thumbs up outline" />
              {comment.likeCount}
            </span>
          )}
          >
            <PopupContent>{comment.user.username}</PopupContent>
          </Popup>
        </CommentUI.Action>
        <CommentUI.Action>
          <span onClick={() => dislike(comment)}>
            <Icon name="thumbs down outline" />
            {comment.dislikeCount}
          </span>
        </CommentUI.Action>
        {
          currentUserId === comment.user.id ? (
            <span>
              <CommentUI.Action>
                <span onClick={() => toggleEdit(comment)}>Edit</span>
              </CommentUI.Action>
              <CommentUI.Action>
                <span onClick={() => softDeleteComment(comment.id)}>Delete</span>
              </CommentUI.Action>
            </span>
          )
            : null
        }
      </CommentUI.Actions>
    </CommentUI.Content>
  </CommentUI>
);

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUserId: PropTypes.string.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  like: PropTypes.func.isRequired,
  dislike: PropTypes.func.isRequired,
  softDeleteComment: PropTypes.func.isRequired
};

export default Comment;
