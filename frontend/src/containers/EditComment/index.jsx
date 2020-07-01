import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EditWindow from '../../components/EditWindow';
import { toggleEditComment, togglePushEditedComment } from '../Thread/redux/actionCreators';

const EditComment = ({ comment: modal, toggleEditComment: toggleEdit, togglePushEditedComment: togglePush }) => (
  EditWindow({ modal, toggleEdit, togglePush })
);

EditComment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleEditComment: PropTypes.func.isRequired,
  togglePushEditedComment: PropTypes.func.isRequired
};

export default connect(
  state => ({ comment: state.posts.editWindow }),
  { toggleEditComment, togglePushEditedComment }
)(EditComment);
