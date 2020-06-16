import React from 'react';
import PropTypes from 'prop-types';
import { Comment as CommentUI } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';

import styles from './styles.module.scss';

const Comment = ({ comment, currentUserId, toggleEdit, softDeleteComment }) => (
  <CommentUI className={styles.comment}>
    <CommentUI.Avatar src={getUserImgLink(comment.user.image)} />
    <CommentUI.Content>
      <CommentUI.Author as="a">
        {comment.user.username}
      </CommentUI.Author>
      <CommentUI.Metadata>
        {moment(comment.createdAt).fromNow()}
      </CommentUI.Metadata>
      <CommentUI.Text>
        {comment.body}
      </CommentUI.Text>
      {
        currentUserId === comment.user.id ? (
          <CommentUI.Actions>
            <CommentUI.Action>
              <span onClick={() => toggleEdit(comment)}>Edit</span>
            </CommentUI.Action>
            <CommentUI.Action>
              <span onClick={() => softDeleteComment(comment.id)}>Delete</span>
            </CommentUI.Action>
          </CommentUI.Actions>
        )
          : null
      }
    </CommentUI.Content>
  </CommentUI>
);

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUserId: PropTypes.string.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  softDeleteComment: PropTypes.func.isRequired
};

export default Comment;
