import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import omit from 'lodash/omit';

// Import actions.
import * as authActions from '../actions/authActions';

// Components
import Spinner from '../components/Spinner';
import ProfileForm from '../components/ProfileForm';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

class ProfileEdit extends Component {
  static propTypes = {
    authActions: PropTypes.shape({
      registration: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      profile: {},
      forms: [],
    };
  }

  componentDidMount() {
    const { authActions } = this.props;

    authActions.fetchProfile().then((profile) => {
      this.setState({
        profile,
        fetching: false,
        forms: profile.fields,
      });
    });
  }

  handleSave = (values) => {
    const { profile } = this.state;
    const { authActions, componentId } = this.props;
    if (values) {
      authActions.updateProfile(profile.user_id, values, componentId);
    }
  };

  render() {
    const { fetching, forms } = this.state;

    if (fetching) {
      return (
        <View style={styles.container}>
          <Spinner visible />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ProfileForm
          fields={omit(forms, 'B')}
          isEdit
          onSubmit={(values) => this.handleSave(values)}
        />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.auth,
  }),
  (dispatch) => ({
    authActions: bindActionCreators(authActions, dispatch),
  }),
)(ProfileEdit);