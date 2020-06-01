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

const likeHelper = async (postId, isLike) => {
  const response = await callWebApi({
    endpoint: '/api/postreaction',
    type: 'PUT',
    request: {
      postId,
      isLike
    }
  });
  return response.json();
};

export const likePost = async postId => {
  await likeHelper(postId, true);
};

export const dislikePost = async postId => {
  await likeHelper(postId, false);
};

// should be replaced by approppriate function
export const getPostByHash = async hash => getPost(hash);
