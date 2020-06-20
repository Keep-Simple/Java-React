import callWebApi from 'src/helpers/webApiHelper';

export const login = async request => {
  const response = await callWebApi({
    endpoint: '/api/auth/login',
    type: 'POST',
    request
  });
  return response.json();
};

export const registration = async request => {
  const response = await callWebApi({
    endpoint: '/api/auth/register',
    type: 'POST',
    request
  });
  return response.json();
};

export const getCurrentUser = async () => {
  try {
    const response = await callWebApi({
      endpoint: '/api/user',
      type: 'GET'
    });
    return response.json();
  } catch (e) {
    return null;
  }
};

export const setUserNameById = async (id, username) => {
  const response = await callWebApi({
    endpoint: '/api/user/setName',
    type: 'POST',
    request: { id, username }
  });
  return response.json();
};

export const setUserImgById = async (userId, imageId) => {
  await callWebApi({
    endpoint: '/api/user/setAvatar',
    type: 'POST',
    request: { userId, imageId }
  });
};

export const setUserStatusById = async (userId, status) => {
  await callWebApi({
    endpoint: '/api/user/setStatus',
    type: 'POST',
    request: { userId, status }
  });
};
