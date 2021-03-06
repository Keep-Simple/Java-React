/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as imageService from 'src/services/imageService';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import SharedPostLink from 'src/components/SharedPostLink';
import { Checkbox, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import {
  loadPosts,
  loadMorePosts,
  likePost,
  dislikePost,
  toggleExpandedPost,
  addPost,
  toggleEditPost,
  deletePost
} from './redux/actionCreators';

import styles from './styles.module.scss';
import EditPost from '../EditPost';
import EditComment from '../EditComment';

const postsFilter = {
  userId: undefined,
  from: 0,
  count: 10,
  inverted: false, //  fetch every post with != userId if TRUE
  isLikeFilter: false // toggle filtering by likes on posts
};

const Thread = ({
  userId,
  loadPosts: load,
  loadMorePosts: loadMore,
  posts = [],
  expandedPost,
  editWindow,
  hasMorePosts,
  addPost: createPost,
  likePost: like,
  dislikePost: dislike,
  deletePost: del,
  toggleExpandedPost: toggle,
  toggleEditPost: toggleEdit
}) => {
  const [sharedPostId, setSharedPostId] = useState(undefined);
  const [showOwnPosts, setShowOwnPosts] = useState(false);
  const [hideOwnPosts, setHideOwnPosts] = useState(false);
  const [showLikedByMe, setShowLikedByMe] = useState(false);

  const toggleShowOwnPosts = () => {
    if (hideOwnPosts || showLikedByMe) return;
    postsFilter.userId = showOwnPosts ? undefined : userId;
    setShowOwnPosts(!showOwnPosts);
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count;
  };

  const toggleHideOwnPosts = () => {
    if (showOwnPosts || showLikedByMe) return;
    postsFilter.userId = hideOwnPosts ? undefined : userId;
    postsFilter.inverted = !hideOwnPosts;
    setHideOwnPosts(!hideOwnPosts);
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count;
  };

  const toggleShowLiked = () => {
    if (showOwnPosts || hideOwnPosts) return;
    postsFilter.userId = showLikedByMe ? undefined : userId;
    postsFilter.isLikeFilter = !showLikedByMe;
    setShowLikedByMe(!showLikedByMe);
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count;
  };

  const getMorePosts = () => {
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };

  const sharePost = id => {
    setSharedPostId(id);
  };

  const uploadImage = file => imageService.uploadImage(file);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm} style={{}}>
        <AddPost addPost={createPost} uploadImage={uploadImage} />
      </div>
      <div className={styles.toolbar} style={{ float: 'left', width: '33%', textAlign: 'center' }}>
        <Checkbox
          slider
          label="Show only my posts"
          checked={showOwnPosts}
          onChange={toggleShowOwnPosts}
        />
      </div>
      <div className={styles.toolbar} style={{ float: 'left', width: '33%', textAlign: 'center' }}>
        <Checkbox
          slider
          label="Hide my posts"
          checked={hideOwnPosts}
          onChange={toggleHideOwnPosts}
        />
      </div>
      <div className={styles.toolbar} style={{ float: 'left', width: '33%', textAlign: 'center' }}>
        <Checkbox
          slider
          label="Liked by me"
          checked={showLikedByMe}
          onChange={toggleShowLiked}
        />
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={getMorePosts}
        hasMore={hasMorePosts}
        loader={<Loader active inline="centered" key={0} />}
      >
        {posts.map(post => (
          <Post
            post={post}
            likePost={like}
            dislikePost={dislike}
            deletePost={del}
            toggleEditPost={toggleEdit}
            toggleExpandedPost={toggle}
            sharePost={sharePost}
            key={post.id}
            currentUserId={userId}
          />
        ))}
      </InfiniteScroll>
      {expandedPost && <ExpandedPost sharePost={sharePost} userId={userId} />}
      {(editWindow?.commentCount >= 0 && <EditPost />) || (editWindow && <EditComment />)}
      {sharedPostId && <SharedPostLink postId={sharedPostId} close={() => setSharedPostId(undefined)} />}
    </div>
  );
};

Thread.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  hasMorePosts: PropTypes.bool,
  expandedPost: PropTypes.objectOf(PropTypes.any),
  userId: PropTypes.string,
  loadPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  editWindow: PropTypes.objectOf(PropTypes.any),
  toggleExpandedPost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired
};

Thread.defaultProps = {
  posts: [],
  hasMorePosts: true,
  expandedPost: undefined,
  editWindow: undefined,
  userId: undefined
};

const mapStateToProps = rootState => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  editWindow: rootState.posts.editWindow,
  userId: rootState.profile.user.id
});

const actions = {
  loadPosts,
  loadMorePosts,
  likePost,
  dislikePost,
  deletePost,
  toggleEditPost,
  toggleExpandedPost,
  addPost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
