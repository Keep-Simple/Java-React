import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleEditPost, togglePushEditedPost } from '../Thread/actions';
import EditWindow from '../../components/EditWindow';

const EditPost = ({ post: modal, toggleEditPost: toggleEdit, togglePushEditedPost: togglePush }) => (
  EditWindow({ modal, toggleEdit, togglePush })
);

EditPost.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  togglePushEditedPost: PropTypes.func.isRequired
};

export default connect(
  state => ({ post: state.posts.editWindow }),
  { toggleEditPost, togglePushEditedPost }
)(EditPost);
