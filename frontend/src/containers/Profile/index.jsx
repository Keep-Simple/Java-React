import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
  Form, FormButton,
  Grid,
  Image, Input,
  Message
} from 'semantic-ui-react';
import { setUserName } from './actions';

// eslint-disable-next-line react/prop-types
const Profile = ({ user, setUserName: setName }) => {
  const [body, setBody] = useState(user.username);
  const [failedNameUpdate, setFailedName] = useState(undefined);

  const handleSubmit = async () => {
    const resultName = await setName(user.id, body);
    if (resultName !== body) {
      setFailedName(true);
      setBody(user.username);
    } else {
      setFailedName(false);
    }
  };

  return (
    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column width="7">
        <Image href={getUserImgLink(user.image)} centered src={getUserImgLink(user.image)} size="medium" circular />
        <Form onSubmit={handleSubmit} error={failedNameUpdate} success={failedNameUpdate === false}>
          <br />
          <br />
          <Input
            icon="user"
            iconPosition="left"
            value={body}
            onChange={ev => setBody(ev.target.value)}
          />
          <br />
          <br />
          <Input
            style={{ width: 'auto', opacity: '1' }}
            icon="at"
            iconPosition="left"
            value={user.email}
          />
          <Message
            error
            header="Action Forbidden"
            content="Username must be unique"
          />
          <Message
            success
            header="Successfully updated"
            content="Enjoy your new name"
          />
          <br />
          <br />
          <FormButton disabled={!body.length || user.username === body} type="submit">Submit</FormButton>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any)
};

Profile.defaultProps = {
  user: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

export default connect(
  mapStateToProps,
  { setUserName }
)(Profile);
