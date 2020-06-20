import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Form, FormButton,
  Grid, Icon,
  Image, Input,
  Message
} from 'semantic-ui-react';
import { setUserImg, setUserName } from './actions';
import CropPhoto from '../../components/CropPhoto';
import * as imageService from '../../services/imageService';
import { getUserImgLink } from '../../helpers/imageHelper';
import { loadPosts } from '../Thread/actions';

const Profile = ({
  user,
  setUserName: setName,
  setUserImg: applyAvatarToUser,
  loadPosts: reloadPosts
}) => {
  // == state == //
  const [body, setBody] = useState(user.username);
  const [failedNameUpdate, setFailedName] = useState(undefined);
  const [src64, setSrc64] = useState(undefined);
  const [imgBlob, setImgBlob] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [crop, setCrop] = useState({ unit: 'percent', aspect: 1 });
  // == end == //

  // == functions == //
  const upImage = (file, cropProps) => imageService.uploadImage(file, cropProps);

  const onSelectFile = ({ target }) => {
    if (target.files && target.files.length > 0) {
      setIsUploading(true);
      setImgBlob(target.files[0]);
      try {
        const reader = new FileReader();
        reader.addEventListener('load', () => setSrc64(reader.result));
        reader.readAsDataURL(target.files[0]);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleNewAvatar = async () => {
    setIsSaving(true);
    const image = await upImage(imgBlob, [crop.x, crop.y, crop.width])
      .finally(() => setIsSaving(false));

    setImgBlob(undefined);
    applyAvatarToUser(user.id, image);
    reloadPosts();
  };

  const handleNameChange = async () => {
    const resultName = await setName(user.id, body);
    if (resultName !== body) {
      setFailedName(true);
      setBody(user.username);
    } else {
      setFailedName(false);
    }
    reloadPosts();
  };
  // == end == //

  return (
    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column width="7">
        <Image centered size="medium" circular src={getUserImgLink(user.image)} />
        {(src64 && imgBlob) && (
          <span>
            <br />
            <br />
            <CropPhoto src={src64} crop={crop} setCrop={setCrop} />
          </span>
        )}
        <br />
        <br />
        <Button
          inverted
          color="blue"
          style={{ borderRadius: '15px' }}
          animated="vertical"
          as="label"
          loading={isUploading}
          disabled={isUploading}
        >
          <Button.Content visible>
            <Icon name="image" />
            Upload
            <input name="image" type="file" onChange={onSelectFile} hidden />
          </Button.Content>
          <Button.Content hidden>
            <Icon name="arrow up" />
          </Button.Content>
        </Button>
        <Button
          inverted
          content="Save"
          color="blue"
          style={{ borderRadius: '15px' }}
          onClick={handleNewAvatar}
          loading={isSaving}
          disabled={!imgBlob || !crop.width}
        />
        <Form
          onSubmit={handleNameChange}
          error={failedNameUpdate}
          success={failedNameUpdate === false}
        >
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
            icon="at"
            iconPosition="left"
            value={user.email}
          />
          <Message
            style={{ borderRadius: '30px' }}
            error
            header="Action Forbidden"
            content="Username must be unique"
          />
          <Message
            style={{ borderRadius: '30px' }}
            success
            header="Successfully updated"
            content="Enjoy your new name"
          />
          <br />
          <br />
          <FormButton
            style={{ borderRadius: '30px' }}
            disabled={!body.length || user.username === body}
            type="submit"
          >
            Submit
          </FormButton>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  setUserName: PropTypes.func.isRequired,
  setUserImg: PropTypes.func.isRequired,
  loadPosts: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

export default connect(
  mapStateToProps,
  { setUserName, setUserImg, loadPosts }
)(Profile);
