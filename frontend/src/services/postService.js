import callWebApi from 'src/helpers/webApiHelper';

export const getAllPosts = async filter => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'GET',
    query: filter
  });
  return response.json();
};

export const addPost = async request => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'POST',
    request
  });
  return response.json();
};

export const getPost = async id => {
  const response = await callWebApi({
    endpoint: `/api/posts/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const editPost = async ({ body, id, user: { id: userId } }) => {
  await callWebApi({
    endpoint: '/api/posts/update',
    type: 'PUT',
    request: { body, id, userId }
  });
};

const likeHelper = async (postId, userId, isLike) => {
  const response = await callWebApi({
    endpoint: '/api/postreaction',
    type: 'PUT',
    request: {
      postId,
      userId,
      isLike
    }
  });
  return response.json();
};

export const likePost = async ({ id, user: { id: userId } }) => likeHelper(id, userId, true);

export const dislikePost = async ({ id, user: { id: userId } }) => likeHelper(id, userId, false);

// should be replaced by approppriate function
export const getPostByHash = async hash => getPost(hash);
