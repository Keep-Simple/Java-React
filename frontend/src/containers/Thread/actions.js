import * as postService from 'src/services/postService';
import * as commentService from 'src/services/commentService';
import {
  ADD_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  SET_EXPANDED_POST,
  EDIT_POST,
  SET_EDIT_WINDOW,
  DELETE_POST
} from './actionTypes';

const setPostsAction = posts => ({
  type: SET_ALL_POSTS,
  posts
});

const addMorePostsAction = posts => ({
  type: LOAD_MORE_POSTS,
  posts
});

const addPostAction = post => ({
  type: ADD_POST,
  post
});

const setEditWindowAction = modal => ({
  type: SET_EDIT_WINDOW,
  modal
});

const editPostAction = post => ({
  type: EDIT_POST,
  post
});

const deletePostAction = id => ({
  type: DELETE_POST,
  id
});

const setExpandedPostAction = post => ({
  type: SET_EXPANDED_POST,
  post
});

export const loadPosts = filter => async dispatch => {
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts));
};

// == Posts == //

export const loadMorePosts = filter => async (dispatch, getRootState) => {
  const { posts: { posts } } = getRootState();
  const loadedPosts = await postService.getAllPosts(filter);
  const filteredPosts = loadedPosts
    .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
  dispatch(addMorePostsAction(filteredPosts));
};

export const applyPost = postId => async dispatch => {
  const post = await postService.getPost(postId);
  dispatch(addPostAction(post));
};

export const addPost = post => async dispatch => {
  const { id } = await postService.addPost(post);
  const newPost = await postService.getPost(id);
  dispatch(addPostAction(newPost));
};

export const deletePost = id => async dispatch => {
  await postService.softDeletePost(id);
  dispatch(deletePostAction(id));
  dispatch(setExpandedPostAction(undefined));
};

export const togglePushEditedPost = post => async dispatch => {
  dispatch(editPostAction(post));
  dispatch(setEditWindowAction(undefined));
  await postService.editPost(post);
};

export const toggleEditPost = post => async dispatch => {
  dispatch(setEditWindowAction(post));
  dispatch(setExpandedPostAction(undefined));
};

export const toggleExpandedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setExpandedPostAction(post));
};

// == Reactions == //

const likeHelper = async (isLike, post, setReaction, dispatch, getRootState) => {
  let likeDiff;
  let dislikeDiff;
  const result = await (isLike ? postService.likePost(post) : postService.dislikePost(post));

  if (result?.id) {
    if (result.isLike === isLike) {
      likeDiff = (+isLike);
      dislikeDiff = (+!isLike);
      setReaction(isLike);
    } else {
      likeDiff = 0;
      dislikeDiff = 0;
    }
  } else {
    // reaction was deleted
    likeDiff = -(+isLike);
    dislikeDiff = -(+!isLike);
    setReaction(undefined);
  }

  const mapLikes = p => ({
    ...p,
    likeCount: Number(post.likeCount) + likeDiff,
    dislikeCount: Number(post.dislikeCount) + dislikeDiff
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(pst => (pst.id !== post.id ? pst : mapLikes(pst)));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === post.id) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost)));
  }
};

export const likePost = (post, setReaction) => (
  async (dispatch, getRootState) => likeHelper(true, post, setReaction, dispatch, getRootState));

export const dislikePost = (post, setReaction) => (
  async (dispatch, getRootState) => likeHelper(false, post, setReaction, dispatch, getRootState));

// == Comments == //

export const deleteComment = id => async (dispatch, getRootState) => {
  await commentService.softDeleteComment(id);

  const mapComments = post => ({
    ...post,
    commentCount: Number(post.commentCount) - 1,
    comments: [...(post.comments || [])].filter(c => c.id !== id)
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== expandedPost.id ? post : mapComments(post)));

  dispatch(setExpandedPostAction(mapComments(expandedPost)));
  dispatch(setPostsAction(updated));
};

export const togglePushEditedComment = comment => async (dispatch, getRootState) => {
  await commentService.editComment(comment);

  const mapComments = post => ({
    ...post,
    comments: [...(post.comments || [])].map(c => (c.id === comment.id ? comment : c))
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== comment.postId ? post : mapComments(post)));

  dispatch(setEditWindowAction(undefined));
  dispatch(setExpandedPostAction(mapComments(expandedPost)));
  dispatch(setPostsAction(updated));
};

export const addComment = request => async (dispatch, getRootState) => {
  const { id } = await commentService.addComment(request);
  const comment = await commentService.getComment(id);

  const mapComments = post => ({
    ...post,
    commentCount: Number(post.commentCount) + 1,
    comments: [...(post.comments || []), comment]
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== comment.postId ? post : mapComments(post)));

  dispatch(setExpandedPostAction(mapComments(expandedPost)));
  dispatch(setPostsAction(updated));
};

export const toggleEditComment = comment => async dispatch => {
  dispatch(setEditWindowAction(comment));
};

const commentLikeHelper = async (isLike, comment, dispatch, getRootState) => {
  let likeDiff;
  let dislikeDiff;
  const result = await (isLike ? commentService.likeComment(comment) : commentService.dislikeComment(comment));

  if (result?.id) {
    if (result.isLike === isLike) {
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

  const apply = C => ({
    ...C,
    likeCount: Number(C.likeCount) + likeDiff,
    dislikeCount: Number(C.dislikeCount) + dislikeDiff
  });

  const { posts: { expandedPost } } = getRootState();

  expandedPost.comments.map(c => (
    c.id === comment.id ? apply(c) : c
  ));

  dispatch(setExpandedPostAction({
    ...expandedPost,
    comments: expandedPost.comments.map(c => (
      c.id === comment.id ? apply(c) : c
    ))
  }));
};

export const likeComment = comment => (
  async (dispatch, getRootState) => commentLikeHelper(true, comment, dispatch, getRootState));

export const dislikeComment = comment => (
  async (dispatch, getRootState) => commentLikeHelper(false, comment, dispatch, getRootState));

