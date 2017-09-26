import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  View,
  ScrollView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Constants
import {
  BLOCK_BANNERS,
  BLOCK_CATEGORIES,
  BLOCK_PRODUCTS,
} from '../constants';

// Import actions.
import * as notificationsActions from '../actions/notificationsActions';
import * as layoutsActions from '../actions/layoutsActions';

// Components
import Spinner from '../components/Spinner';
import BannerBlock from '../components/BannerBlock';
import ProductBlock from '../components/ProductBlock';
import CategoryBlock from '../components/CategoryBlock';

// links
import { registerDrawerDeepLinks } from '../utils/deepLinks';
import i18n from '../utils/i18n';
import { toArray } from '../utils';
import config from '../config';
import theme from '../theme';

// Styles
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  contentContainer: {
  },
});

const barsImage = require('../assets/icons/bars.png');
const searchImage = require('../assets/icons/search.png');

class Layouts extends Component {
  static propTypes = {
    layoutsActions: PropTypes.shape({
      fetchBlocks: PropTypes.func,
      fetchOrCreate: PropTypes.func,
    }),
    notifications: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object),
    }),
    notificationsActions: PropTypes.shape({
      hide: PropTypes.func,
    }),
    navigator: PropTypes.shape({
      setOnNavigatorEvent: PropTypes.func,
    }),
    layouts: PropTypes.shape({}),
  };

  static navigatorStyle = {
    navBarBackgroundColor: theme.$navBarBackgroundColor,
    navBarButtonColor: theme.$navBarButtonColor,
    navBarButtonFontSize: theme.$navBarButtonFontSize,
    navBarTextColor: theme.$navBarTextColor,
    screenBackgroundColor: theme.$screenBackgroundColor,
  }

  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    const { navigator, layouts } = this.props;
    navigator.setTitle({
      title: config.shopName.toUpperCase(),
    });
    navigator.setButtons({
      leftButtons: [
        {
          id: 'sideMenu',
          icon: barsImage,
        },
      ],
      rightButtons: [
        {
          id: 'cart',
          component: 'CartBtn',
        },
        {
          id: 'search',
          icon: searchImage,
        },
      ],
    });
    if (layouts.layoutId) {
      this.props.layoutsActions.fetchBlocks(layouts.layoutId, 'index.index');
    } else {
      this.props.layoutsActions.fetchOrCreate();
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const { navigator } = nextProps;
    if (nextProps.notifications.items.length) {
      const notify = nextProps.notifications.items[nextProps.notifications.items.length - 1];
      if (notify.closeLastModal) {
        navigator.dismissModal();
      }
      navigator.showInAppNotification({
        screen: 'Notification',
        passProps: {
          dismissWithSwipe: true,
          title: notify.title,
          type: notify.type,
          text: notify.text,
        },
      });
      this.props.notificationsActions.hide(notify.id);
    }
  }

  onNavigatorEvent(event) {
    const { navigator } = this.props;
    registerDrawerDeepLinks(event, navigator);
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'sideMenu') {
        navigator.toggleDrawer({ side: 'left' });
      } else if (event.id === 'search') {
        navigator.showModal({
          screen: 'Search',
          title: i18n.gettext('Search'),
        });
      }
    }
  }

  renderBlock = (block, index) => {
    const { navigator } = this.props;
    const items = toArray(block.content.items);
    switch (block.type) {
      case BLOCK_BANNERS:
        return (
          <BannerBlock
            items={items}
            onPress={(banner) => {
              navigator.handleDeepLink({
                link: banner.url,
                payload: {
                  ...banner,
                }
              });
            }}
            key={index}
          />
        );

      case BLOCK_PRODUCTS:
        return (
          <ProductBlock
            items={items}
            onPress={(product) => {
              navigator.push({
                screen: 'ProductDetail',
                backButtonTitle: '',
                passProps: {
                  pid: product.product_id,
                }
              });
            }}
            key={index}
          />
        );

      case BLOCK_CATEGORIES:
        return (
          <CategoryBlock
            items={items}
            onPress={(category) => {
              navigator.push({
                screen: 'Categories',
                backButtonTitle: '',
                passProps: {
                  category,
                }
              });
            }}
            key={index}
          />
        );

      default:
        return null;
    }
  }

  renderSpinner = () => (
    <Spinner visible mode="content" />
  );

  render() {
    const { layouts } = this.props;
    const blocksList = layouts.blocks.map((block, index) => this.renderBlock(block, index));
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {layouts.fetching ? this.renderSpinner() : blocksList}
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
  notifications: state.notifications,
  layouts: state.layouts,
}),
dispatch => ({
  layoutsActions: bindActionCreators(layoutsActions, dispatch),
  notificationsActions: bindActionCreators(notificationsActions, dispatch),
})
)(Layouts);
