// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Form, FormButton,
  Grid, Icon,
  Image, Input,
  Message
} from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { setUserImg, setUserName, setUserStatus } from './actions';
import CropPhoto from '../../components/CropPhoto';
import * as imageService from '../../services/imageService';
import { getUserImgLink } from '../../helpers/imageHelper';
import { loadPosts } from '../Thread/actions';

const Profile = ({
  user,
  setUserName: applyNameToUser,
  setUserImg: applyAvatarToUser,
  setUserStatus: applyStatusToUser,
  loadPosts: reloadPosts
}) => {
  // == state == //
  const [name, setInputName] = useState(user.username);
  const [nameUpdateFailed, setNameUpdateFailed] = useState(undefined);
  const [status, setInputStatus] = useState(user.status);

  const [src64, setSrc64] = useState(undefined);
  const [imgBlob, setImgBlob] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [crop, setCrop] = useState({ unit: 'percent', aspect: 1 });
  // == end == //

  // == functions == //
  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setImgBlob(e.target.files[0]);
      try {
        const reader = new FileReader();
        reader.addEventListener('load', () => setSrc64(reader.result));
        reader.readAsDataURL(e.target.files[0]);
      } finally {
        setIsUploading(false);
        e.target.value = '';
      }
    }
  };

  const upImage = (file, cropProps) => imageService.uploadImage(file, cropProps);

  const handleNewAvatar = async () => {
    setIsSaving(true);
    const image = await upImage(imgBlob, [crop.x, crop.y, crop.width])
      .finally(() => setIsSaving(false));

    setImgBlob(undefined);
    applyAvatarToUser(user.id, image);
    reloadPosts();
  };

  const handleNameChange = async () => {
    if (user.name !== name) {
      const resultName = await applyNameToUser(user.id, name);
      if (resultName !== name) {
        setNameUpdateFailed(true);
        setInputName(user.username);
      } else {
        setNameUpdateFailed(false);
      }
      reloadPosts();
    }
  };

  const handleStatusChange = async () => {
    if (user.status !== status) {
      await applyStatusToUser(user.id, status);
      reloadPosts();
    }
  };
  // == end == //

  return (
    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column width="7">
        <Image centered size="medium" circular src={getUserImgLink(user.image)} />
        {(src64 && imgBlob) && (
          <span>
            <br />
            <CropPhoto src={src64} crop={crop} setCrop={setCrop} />
          </span>
        )}
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
          onSubmit={() => {
            handleNameChange();
            handleStatusChange();
          }}
          error={nameUpdateFailed}
          success={nameUpdateFailed === false}
        >
          <br />
          <br />
          <Input
            icon="user"
            iconPosition="left"
            value={name}
            onChange={ev => setInputName(ev.target.value)}
          />
          <br />
          <br />
          <Input
            icon="user"
            iconPosition="left"
            value={status}
            onChange={ev => setInputStatus(ev.target.value)}
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
            content="Enjoy your changes"
          />
          <br />
          <br />
          <FormButton
            animated
            style={{ borderRadius: '30px' }}
            disabled={!name.length || (user.username === name && user.status === status)}
            inverted
            color="blue"
            type="submit"
          >
            <Button.Content visible>
              Update
            </Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
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
  setUserStatus: PropTypes.func.isRequired,
  loadPosts: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

const actions = { setUserName, setUserImg, loadPosts, setUserStatus };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
