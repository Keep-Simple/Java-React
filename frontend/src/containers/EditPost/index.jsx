import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Modal } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner';
import { toggleEditPost, togglePushEditedPost } from '../Thread/actions';

const EditPost = ({
  post,
  toggleEditPost: toggleEdit,
  togglePushEditedPost: togglePush
}) => {
  const [body, setBody] = useState(post.body);
  return (
    <Modal centered basic size="tiny" dimmer="blurring" open onClose={() => toggleEdit()}>
      {post
        ? (
          <Form reply onSubmit={() => togglePush({ ...post, body })}>
            <TextareaAutosize
              value={body}
              onChange={ev => setBody(ev.target.value)}
            />
            <Button size="tiny" color="google plus" onClick={() => setBody('')} type="reset">Clear</Button>
            <Button size="large" floated="right" color="linkedin" type="submit">Submit</Button>
            <Button size="tiny" color="teal" type="reset" onClick={() => setBody(post.body)}>Restore</Button>
          </Form>
        )
        : <Spinner />}
    </Modal>
  );
};

EditPost.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  togglePushEditedPost: PropTypes.func.isRequired
};

const mapStateToProps = rootState => ({
  post: rootState.posts.editPost
});

const actions = {
  toggleEditPost,
  togglePushEditedPost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPost);
