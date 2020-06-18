import React, { useState } from 'react';
import { Button, Form, Icon, Modal } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';

const EditWindow = ({ modal, toggleEdit, togglePush }) => {
  const [body, setBody] = useState(modal.body);
  return (
    <Modal centered dimmer="blurring" open onClose={() => toggleEdit()}>
      <Modal.Header>
        Edit your
        {modal?.commentCount ? ' post ' : ' comment ' }
      </Modal.Header>
      <Modal.Content>
        <Form>
          <TextareaAutosize
            value={body}
            onChange={ev => setBody(ev.target.value)}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group floated="left">
          {' '}
          <Button
            disabled={!body.length}
            color="red"
            onClick={() => setBody('')}
            content="Clear"
          />
          <Button
            disabled={modal.body === body}
            color="green"
            onClick={() => setBody(modal.body)}
            content="Restore"
          />
        </Button.Group>
        <Button
          disabled={!body.length}
          color="blue"
          onClick={() => togglePush({ ...modal, body })}
          type="submit"
          animated
        >
          <Button.Content visible>Submit</Button.Content>
          <Button.Content hidden>
            <Icon name="arrow right" />
          </Button.Content>
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
