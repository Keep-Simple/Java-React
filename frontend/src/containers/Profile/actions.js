import * as authService from 'src/services/authService';
import { SET_USER, SET_USER_IMG, SET_USER_STATUS, SET_USERNAME } from './actionTypes';

const setToken = token => localStorage.setItem('token', token);

const setUser = user => async dispatch => dispatch({
  type: SET_USER,
  user
});

const setAuthData = (user = null, token = '') => (dispatch, getRootState) => {
  setToken(token); // token should be set first before user
  setUser(user)(dispatch, getRootState);
};

const handleAuthResponse = authResponsePromise => async (dispatch, getRootState) => {
  const { user, token } = await authResponsePromise;
  setAuthData(user, token)(dispatch, getRootState);
};

export const login = request => handleAuthResponse(authService.login(request));

export const register = request => handleAuthResponse(authService.registration(request));

export const logout = () => setAuthData();

export const loadCurrentUser = () => async (dispatch, getRootState) => {
  const user = await authService.getCurrentUser();
  setUser(user)(dispatch, getRootState);
};

export const setUserName = (id, name) => async dispatch => {
  const response = await authService.setUserNameById(id, name);
  // eslint-disable-next-line no-unused-expressions
  response.username === name && dispatch({ type: SET_USERNAME, name });

  return response.username;
};

export const setUserImg = (id, image) => async dispatch => {
  await authService.setUserImgById(id, image.id);
  dispatch({ type: SET_USER_IMG, image });
};

export const setUserStatus = (id, status) => async dispatch => {
  await authService.setUserStatusById(id, status);
  dispatch({ type: SET_USER_STATUS, status });
};
