import callWebApi from 'src/helpers/webApiHelper';

export const addComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/comments',
    type: 'POST',
    request
  });
  return response.json();
};

export const getComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/comments/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const editComment = async request => {
  await callWebApi({
    endpoint: '/api/comments/update',
    type: 'PUT',
    request
  });
};

export const softDeleteComment = async id => {
  await callWebApi({
    endpoint: `api/comments/softDelete/${id}`,
    type: 'PUT'
  });
};

const likeHelper = async (commentId, userId, isLike) => {
  const response = await callWebApi({
    endpoint: '/api/commentreaction',
    type: 'PUT',
    request: {
      commentId,
      userId,
      isLike
    }
  });
  return response.json();
};

export const likeComment = async ({ id, user: { id: userId } }) => likeHelper(id, userId, true);

export const dislikeComment = async ({ id, user: { id: userId } }) => likeHelper(id, userId, false);
