import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header } from 'semantic-ui-react';
import moment from 'moment';
import {
  likePost, dislikePost, toggleExpandedPost,
  addComment, toggleEditPost, deletePost, toggleEditComment,
  deleteComment, dislikeComment, likeComment
} from 'src/containers/Thread/redux/actionCreators';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';

const ExpandedPost = ({
  userId,
  post,
  sharePost,
  deletePost: del,
  likePost: like,
  dislikePost: dislike,
  toggleExpandedPost: toggle,
  toggleEditPost: toggleEdit,
  toggleEditComment: toggleEditCom,
  deleteComment: delComment,
  addComment: add,
  likeComment: likeCom,
  dislikeComment: dislikeCom
}) => (
  <Modal
    style={{ padding: '8px', borderRadius: '15px', fontSize: 'medium' }}
    centered={false}
    open
    onClose={() => toggle()}
  >
    <Modal.Content>
      <Post
        post={post}
        likePost={like}
        dislikePost={dislike}
        deletePost={del}
        toggleExpandedPost={toggle}
        toggleEditPost={toggleEdit}
        sharePost={sharePost}
        currentUserId={userId}
      />
      <CommentUI.Group style={{ maxWidth: '100%' }}>
        <Header as="h3" dividing>
          Comments
        </Header>
        {post.comments && post.comments
          .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
          .map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUserId={userId}
              toggleEdit={toggleEditCom}
              softDeleteComment={delComment}
              like={likeCom}
              dislike={dislikeCom}
            />
          ))}
        <AddComment postId={post.id} addComment={add} />
      </CommentUI.Group>
    </Modal.Content>
  </Modal>
);

ExpandedPost.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  toggleEditComment: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  dislikePost: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired
};

const mapStateToProps = rootState => ({ post: rootState.posts.expandedPost });

const actions = {
  likePost,
  dislikePost,
  toggleExpandedPost,
  addComment,
  toggleEditPost,
  deletePost,
  toggleEditComment,
  deleteComment,
  likeComment,
  dislikeComment
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedPost);
