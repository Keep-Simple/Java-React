import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  SET_EXPANDED_POST,
  EDIT_POST,
  SET_EDIT_WINDOW,
  DELETE_POST,
  EDIT_COMMENT
} from './actionTypes';

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
        posts: state.posts.map(p => (p.id === action.post?.id ? action.post : p))
      };
    case EDIT_COMMENT:
      return {
        ...state,
        expandedPost: {
          ...state.expandedPost,
          comments: [...state.expandedPost.comments].map(c => (c.id === action.comment.id ? action.comment : c))
        }
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(p => p.id !== action.id)
      };
    case SET_EDIT_WINDOW:
      return {
        ...state,
        editWindow: action.modal
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
