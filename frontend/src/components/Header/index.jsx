import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { Header as HeaderUI, Image, Grid, Icon, Button, Input, Popup } from 'semantic-ui-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { setUserStatus } from '../../containers/Profile/redux/actions';
import { loadPosts } from '../../containers/Thread/redux/actionCreators';

const Header = ({
  user,
  logout,
  loadPosts: reloadPosts,
  setUserStatus: applyStatusToUser
}) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    setStatus(user.status || '');
  }, [user.status]);

  const handleStatusChange = async () => {
    if (user.status !== status) {
      await applyStatusToUser(user.id, status);
      reloadPosts();
    }
  };

  return (
    <div className={styles.headerWrp}>
      <Grid columns="equal">
        <NavLink exact to="/">
          <Grid.Column>
            {user && (
              <Image size="tiny" circular src={getUserImgLink(user.image)} />
            )}
          </Grid.Column>
        </NavLink>
        <Grid.Column>
          <NavLink exact to="/">
            <HeaderUI>
              {user.username}
            </HeaderUI>
          </NavLink>
          {user
          && (
            <Input
              transparent
              placeholder="Add status..."
              onChange={ev => setStatus(ev.target.value)}
              value={status}
            >
              <input
                onChange={ev => setStatus(ev.target.value)}
                value={status}
              />
              <Button
                disabled={status === user.status}
                basic
                circular
                style={{ border: 'none', boxShadow: 'none' }}
                icon="pencil"
                onClick={handleStatusChange}
              />
            </Input>
          ) }
        </Grid.Column>
        <Grid.Column verticalAlign="middle" textAlign="right">
          <NavLink exact activeClassName="active" to="/profile" className={styles.menuBtn}>
            <Popup
              position="bottom center"
              inverted
              style={{ padding: '8px', borderRadius: '20px' }}
              content="Profile"
              trigger={(
                <Icon name="user" size="large" />
              )}
            />
          </NavLink>
          <Popup
            position="right center"
            inverted
            style={{ padding: '8px', borderRadius: '20px' }}
            content="Log out"
            trigger={(
              <Button basic icon className={`${styles.menuBtn} ${styles.logoutBtn}`} onClick={logout}>
                <Icon name="log out" size="large" />
              </Button>
            )}
          />

        </Grid.Column>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  loadPosts: PropTypes.func.isRequired,
  setUserStatus: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { loadPosts, setUserStatus }, dispatch
);

export default connect(
  null,
  mapDispatchToProps
)(Header);

