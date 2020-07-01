import * as postService from 'src/services/postService';
import * as commentService from 'src/services/commentService';
import moment from 'moment';
import { addMorePostsAction, setPostsAction,
  addPostAction, deletePostAction,
  editPostAction, setEditWindowAction,
  setExpandedPostAction } from './actions';
import { reactionsDiffFunc } from './actionsHelpers';

export const loadPosts = filter => async dispatch => {
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts));
};

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
  dispatch(setExpandedPostAction(null));
};

export const togglePushEditedPost = post => async dispatch => {
  dispatch(editPostAction(post));
  dispatch(setEditWindowAction(null));
  await postService.editPost(post);
};

export const toggleEditPost = post => async dispatch => {
  dispatch(setEditWindowAction(post));
  dispatch(setExpandedPostAction(null));
};

export const toggleExpandedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : null;
  dispatch(setExpandedPostAction(post));
};

const postLikeHelper = (isLike, post) => async (dispatch, getRootState) => {
  const result = await (isLike ? postService.likePost : postService.dislikePost)(post);
  const { posts: { posts, expandedPost } } = getRootState();

  const mapLikes = reactionsDiffFunc(result, isLike);

  const updated = posts.map(pst => (pst.id !== post.id ? pst : mapLikes(pst)));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === post.id) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost)));
  }
};

export const likePost = post => postLikeHelper(true, post);

export const dislikePost = post => postLikeHelper(false, post);

export const applyPostReaction = postId => async (dispatch, getRootState) => {
  const post = await postService.getPost(postId);
  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(pst => (pst.id !== post.id ? pst : post));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === post.id) {
    dispatch(setExpandedPostAction(post));
  }

  return post;
};

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

  const { posts: { expandedPost } } = getRootState();

  dispatch(setEditWindowAction(null));
  dispatch(setExpandedPostAction(mapComments(expandedPost)));
};

export const addComment = (request, justApplyCommentById) => async (dispatch, getRootState) => {
  let comment;

  if (justApplyCommentById) {
    comment = await commentService.getComment(justApplyCommentById);
  } else {
    const { id } = await commentService.addComment(request);
    comment = await commentService.getComment(id);
  }

  const mapComments = post => ({
    ...post,
    commentCount: Number(post.commentCount) + 1,
    comments: [...(post.comments || []), comment]
      .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== comment.postId ? post : mapComments(post)));

  if (expandedPost && expandedPost.id === comment.postId) {
    dispatch(setExpandedPostAction(mapComments(expandedPost)));
  }

  dispatch(setPostsAction(updated));
};

export const applyComment = commentId => addComment(null, commentId);

export const toggleEditComment = comment => async dispatch => {
  dispatch(setEditWindowAction(comment));
};

const commentLikeHelper = (isLike, comment) => async (dispatch, getRootState) => {
  const result = await (isLike ? commentService.likeComment : commentService.dislikeComment)(comment);
  const { posts: { expandedPost } } = getRootState();

  const mapLikes = reactionsDiffFunc(result, isLike);

  const updatedComments = expandedPost.comments
    .map(c => (c.id === comment.id ? mapLikes(c) : c));

  dispatch(setExpandedPostAction({ ...expandedPost, comments: updatedComments }));
};

export const likeComment = comment => commentLikeHelper(true, comment);

export const dislikeComment = comment => commentLikeHelper(false, comment);

