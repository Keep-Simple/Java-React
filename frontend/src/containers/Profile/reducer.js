import { SET_USER, SET_USER_IMG, SET_USERNAME } from './actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
        isAuthorized: Boolean(action.user?.id),
        isLoading: false
      };
    case SET_USER_IMG:
      return {
        ...state,
        user: { ...state.user, image: action.image }
      };
    case SET_USERNAME:
      return {
        ...state,
        user: { ...state.user, username: action.name }
      };
    default:
      return state;
  }
};
