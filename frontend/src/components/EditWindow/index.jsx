import React, { useState } from 'react';
import { Button, Form, Icon, Modal } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';

const EditWindow = ({ modal, toggleEdit, togglePush }) => {
  const [body, setBody] = useState(modal.body);
  return (
    <Modal
      style={{ borderRadius: '15px', padding: '5px' }}
      centered
      dimmer="blurring"
      open
      onClose={() => toggleEdit()}
    >
      <Modal.Header>
        Edit your
        {modal.commentCount === undefined ? ' comment ' : ' post ' }
      </Modal.Header>
      <Modal.Content>
        <Form>
          <TextareaAutosize
            style={{ border: 'none', fontSize: 'medium' }}
            value={body}
            onChange={ev => setBody(ev.target.value)}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group floated="left">
          <Button
            style={{ borderRadius: '30px' }}
            animated="fade"
            disabled={!body.length}
            onClick={() => setBody('')}
          >
            <Button.Content visible>Clear</Button.Content>
            <Button.Content hidden>field</Button.Content>
          </Button>
          <Button.Or />
          <Button
            style={{ borderRadius: '30px' }}
            animated="fade"
            positive
            disabled={modal.body === body}
            onClick={() => setBody(modal.body)}
          >
            <Button.Content visible>Restore</Button.Content>
            <Button.Content hidden>original</Button.Content>
          </Button>
        </Button.Group>
        <Button
          style={{ borderRadius: '30px' }}
          disabled={modal.body === body || !body.length}
          color="blue"
          onClick={() => togglePush({ ...modal, body })}
          type="submit"
          animated
        >
          <Button.Content visible>Submit</Button.Content>
          <Button.Content hidden><Icon name="arrow right" /></Button.Content>
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

EditWindow.propTypes = {
  modal: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleEdit: PropTypes.func.isRequired,
  togglePush: PropTypes.func.isRequired
};

export default EditWindow;
