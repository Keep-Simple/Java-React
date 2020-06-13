import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  SET_EXPANDED_POST,
  EDIT_POST,
  SET_EDIT_POST
} from './actionTypes';

const replaceEditedPost = (array, post) => [...array].map(p => {
  if (p.id === post?.id) {
    return post;
  }
  return p;
});

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ALL_POSTS:
      return {
        ...state,
        posts: action.posts,
        hasMorePosts: Boolean(action.posts.length)
      };
    case LOAD_MORE_POSTS:
      return {
        ...state,
        posts: [...(state.posts || []), ...action.posts],
        hasMorePosts: Boolean(action.posts.length)
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.post, ...state.posts]
      };
    case EDIT_POST:
      return {
        ...state,
        posts: replaceEditedPost(state.posts, action.post)
      };
    case SET_EDIT_POST:
      return {
        ...state,
        editPost: action.post
      };
    case SET_EXPANDED_POST:
      return {
        ...state,
        expandedPost: action.post
      };
    default:
      return state;
  }
};
