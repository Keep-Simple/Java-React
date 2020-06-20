import React from 'react';
import PropTypes from 'prop-types';
import { Comment as CommentUI } from 'semantic-ui-react';
import moment from 'moment';

import styles from './styles.module.scss';
import PopupReactionInfo from '../PopupReactionInfo';
import { getUserImgLink } from '../../helpers/imageHelper';

const Comment = ({ comment, currentUserId, toggleEdit, softDeleteComment, like, dislike }) => (
  <CommentUI className={styles.comment}>
    <CommentUI.Avatar src={getUserImgLink(comment.user.image)} />
    <CommentUI.Content>
      <CommentUI.Author as="a">
        {comment.user.username}
      </CommentUI.Author>
      {comment.user.status && <CommentUI.Metadata content={`${comment.user.status} — `} />}
      <CommentUI.Metadata content={moment(comment.createdAt).fromNow()} />
      <CommentUI.Text>
        {comment.body}
      </CommentUI.Text>
      <CommentUI.Actions>
        <PopupReactionInfo
          isPostReaction={false}
          reactionsCount={comment.likeCount}
          forLikes
          applyReaction={like}
          postOrComment={comment}
        />
        <PopupReactionInfo
          isPostReaction={false}
          reactionsCount={comment.dislikeCount}
          forLikes={false}
          applyReaction={dislike}
          postOrComment={comment}
        />
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
