import {
  ADD_POST,
  DELETE_POST,
  EDIT_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  SET_EDIT_WINDOW,
  SET_EXPANDED_POST
} from './actionTypes';

export const setPostsAction = posts => ({
  type: SET_ALL_POSTS,
  posts
});

export const addMorePostsAction = posts => ({
  type: LOAD_MORE_POSTS,
  posts
});

export const addPostAction = post => ({
  type: ADD_POST,
  post
});

export const setEditWindowAction = modal => ({
  type: SET_EDIT_WINDOW,
  modal
});

export const editPostAction = post => ({
  type: EDIT_POST,
  post
});

export const deletePostAction = id => ({
  type: DELETE_POST,
  id
});

export const setExpandedPostAction = post => ({
  type: SET_EXPANDED_POST,
  post
});
