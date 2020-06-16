import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';

const EditWindow = ({ modal, toggleEdit, togglePush }) => {
  const [body, setBody] = useState(modal.body);
  return (
    <Modal centered basic size="tiny" dimmer="blurring" open onClose={() => toggleEdit()}>
      <Form reply onSubmit={() => togglePush({ ...modal, body })}>
        <TextareaAutosize
          value={body}
          onChange={ev => setBody(ev.target.value)}
        />
        <Button size="tiny" color="google plus" onClick={() => setBody('')} type="reset">Clear</Button>
        <Button size="large" floated="right" color="linkedin" type="submit">Submit</Button>
        <Button size="tiny" color="teal" type="reset" onClick={() => setBody(modal.body)}>Restore</Button>
      </Form>
    </Modal>
  );
};

EditWindow.propTypes = {
  modal: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleEdit: PropTypes.func.isRequired,
  togglePush: PropTypes.func.isRequired
};

export default EditWindow;
