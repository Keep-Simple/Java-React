import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon } from 'semantic-ui-react';

const AddComment = ({
  postId,
  addComment
}) => {
  const [body, setBody] = useState('');

  const handleAddComment = async () => {
    if (!body) {
      return;
    }
    await addComment({ postId, body });
    setBody('');
  };

  return (
    <Form reply onSubmit={handleAddComment}>
      <Form.TextArea
        style={{ border: 'none', height: '8%', fontSize: 'medium' }}
        value={body}
        placeholder="Tweet your reply"
        onChange={ev => setBody(ev.target.value)}
      />
      <Button
        disabled={!body.length}
        primary
        style={{ borderRadius: '30px' }}
        floated="right"
        type="submit"
        size="large"
        animated
      >
        <Button.Content visible><b>Reply</b></Button.Content>
        <Button.Content hidden><Icon name="arrow right" /></Button.Content>
      </Button>
    </Form>
  );
};

AddComment.propTypes = {
  addComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired
};

export default AddComment;
