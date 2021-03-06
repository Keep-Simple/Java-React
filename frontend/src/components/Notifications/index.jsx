import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

/**
 * Realtime updates for likes/dislikes, new Posts and comments
 * everyone will have up-to-date state without reloading page
 *
 * Comment reactions don't have Realtime feature :(
 */

const Notifications = ({
  user,
  applyPost,
  applyPostReaction,
  applyComment
}) => {
  const [stompClient] = useState(Stomp.over(new SockJS('/ws')));

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    stompClient.debug = () => { };
    stompClient.connect({}, () => {
      const { id } = user;

      stompClient.subscribe('/topic/new_post_reaction', message => {
        const reaction = JSON.parse(message.body);

        // liveUpdate for all users, except sender
        if (reaction?.userId !== id) {
          applyPostReaction(reaction.postId);

          // display notification if this is your post
          if (reaction.postUserId === id) {
            // eslint-disable-next-line no-unused-expressions
            reaction.isLike
              ? NotificationManager.info('Your post was liked😃')
              : NotificationManager.info('Your post was disliked😞');
          }
        }
      });

      stompClient.subscribe('/topic/like/comment', userCommentId => {
        if (userCommentId.body.slice(1, -1) === id) {
          NotificationManager.info('Your comment was liked😃');
        }
      });

      stompClient.subscribe('/topic/dislike/comment', userCommentId => {
        if (userCommentId.body.slice(1, -1) === id) {
          NotificationManager.info('Your comment was disliked😞');
        }
      });

      stompClient.subscribe('/topic/new_comment', message => {
        const comment = JSON.parse(message.body);

        // liveUpdate for all users, except sender
        if (comment.userId !== id) {
          applyComment(comment.commentId);

          // display notification if this is your post
          if (comment.postUserId === id) {
            NotificationManager.info('New comment for you😃');
          }
        }
      });

      stompClient.subscribe('/topic/new_post', message => {
        const post = JSON.parse(message.body);
        if (post.userId !== id) {
          applyPost(post.id);
          NotificationManager.info('New Post😃');
        }
      });
    });

    return () => {
      stompClient.disconnect();
    };
  });

  return <NotificationContainer />;
};

Notifications.defaultProps = {
  user: undefined
};

Notifications.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  applyPost: PropTypes.func.isRequired,
  applyPostReaction: PropTypes.func.isRequired,
  applyComment: PropTypes.func.isRequired
};

export default Notifications;
