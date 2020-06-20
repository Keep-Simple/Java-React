import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon, Image, Segment } from 'semantic-ui-react';

import styles from './styles.module.scss';

const AddPost = ({
  addPost,
  uploadImage
}) => {
  const [body, setBody] = useState('');
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddPost = async () => {
    if (!body) {
      return;
    }
    await addPost({ imageId: image?.imageId, body });
    setBody('');
    setImage(undefined);
  };

  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      const { id: imageId, link: imageLink } = await uploadImage(target.files[0]);
      setImage({ imageId, imageLink });
    } finally {
      // TODO: show error
      setIsUploading(false);
    }
  };

  return (
    <Segment style={{ borderRadius: '15px' }}>
      <Form onSubmit={handleAddPost}>
        <Form.TextArea
          style={{ border: 'none' }}
          name="body"
          value={body}
          placeholder="What's happening?"
          onChange={ev => setBody(ev.target.value)}
        />
        {image?.imageLink && (
          <div className={styles.imageWrapper}>
            <Image className={styles.image} src={image?.imageLink} alt="post" />
          </div>
        )}
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
            Attach
            <input name="image" type="file" onChange={handleUploadFile} hidden />
          </Button.Content>
          <Button.Content hidden>
            <Icon name="arrow up" />
          </Button.Content>
        </Button>
        <Button
          disabled={!body.length}
          inverted
          primary
          style={{ borderRadius: '30px' }}
          floated="right"
          type="submit"
          size="large"
          animated
        >
          <Button.Content visible>Tweet</Button.Content>
          <Button.Content hidden><Icon name="arrow right" /></Button.Content>
        </Button>
      </Form>
    </Segment>
  );
};

AddPost.propTypes = {
  addPost: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

export default AddPost;
