import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import Cart from './screens/Cart';
import Page from './screens/Page';
import Login from './screens/Login';
import Orders from './screens/Orders';
import Vendor from './screens/Vendor';
import Search from './screens/Search';
import Gallery from './screens/Gallery';
import Profile from './screens/Profile';
import ProfileEdit from './screens/ProfileEdit';
import Layouts from './screens/Layouts';
import WishList from './screens/WishList';
import Discussion from './screens/Discussion';
import Categories from './screens/Categories';
import WriteReview from './screens/WriteReview';
import OrderDetail from './screens/OrderDetail';
import ImagePicker from './screens/ImagePicker';
import VendorDetail from './screens/VendorDetail';
import CheckoutAuth from './screens/CheckoutAuth';
import Registration from './screens/Registration';
import ProductDetail from './screens/ProductDetail';
import Notification from './components/Notification';
import CheckoutPayment from './screens/CheckoutPayment';
import CheckoutComplete from './screens/CheckoutComplete';
import CheckoutShipping from './screens/CheckoutShipping';
import CheckoutDelivery from './screens/CheckoutDelivery';
import SettlementsCompleteWebView from './screens/SettlementsCompleteWebView';
import VendorManageOrders from './screens/VendorManage/Orders';
import VendorManageProducts from './screens/VendorManage/Products';
import VendorManageAddProductStep1 from './screens/VendorManage/AddProductStep1';
import VendorManageAddProductStep2 from './screens/VendorManage/AddProductStep2';
import VendorManageAddProductStep3 from './screens/VendorManage/AddProductStep3';
import VendorManageEditProduct from './screens/VendorManage/EditProduct';
import VendorManagePricingInventory from './screens/VendorManage/PricingInventory';
import VendorManageShippingProperties from './screens/VendorManage/ShippingProperties';
import VendorManageCategoriesPicker from './screens/VendorManage/CategoriesPicker';
import VendorManageOrderDetail from './screens/VendorManage/OrderDetail';
import LanguageSelection from './screens/LanguageSelection';
import CurrencySelection from './screens/CurrencySelection';

const screenList = [
  { name: 'Page', component: Page },
  { name: 'Cart', component: Cart },
  { name: 'Login', component: Login },
  { name: 'Registration', component: Registration },
  { name: 'Search', component: Search },
  { name: 'Vendor', component: Vendor },
  { name: 'Gallery', component: Gallery },
  { name: 'Layouts', component: Layouts },
  { name: 'WishList', component: WishList },
  { name: 'Categories', component: Categories },
  { name: 'VendorDetail', component: VendorDetail },
  { name: 'CheckoutAuth', component: CheckoutAuth },
  { name: 'ProductDetail', component: ProductDetail },
  { name: 'CheckoutDelivery', component: CheckoutDelivery },
  { name: 'CheckoutShipping', component: CheckoutShipping },
  { name: 'CheckoutPayment', component: CheckoutPayment },
  { name: 'WriteReview', component: WriteReview },
  { name: 'CheckoutComplete', component: CheckoutComplete },
  { name: 'Notification', component: Notification },
  { name: 'Discussion', component: Discussion },
  { name: 'SettlementsCompleteWebView', component: SettlementsCompleteWebView },
  { name: 'ProfileEdit', component: ProfileEdit },
  { name: 'Profile', component: Profile },
  { name: 'Orders', component: Orders },
  { name: 'OrderDetail', component: OrderDetail },
  { name: 'VendorManageOrders', component: VendorManageOrders },
  { name: 'VendorManageOrderDetail', component: VendorManageOrderDetail },
  { name: 'VendorManageProducts', component: VendorManageProducts },
  { name: 'VendorManageEditProduct', component: VendorManageEditProduct },
  { name: 'ImagePicker', component: ImagePicker },
  { name: 'LanguageSelection', component: LanguageSelection },
  { name: 'CurrencySelection', component: CurrencySelection },
  {
    name: 'VendorManageAddProductStep1',
    component: VendorManageAddProductStep1,
  },
  {
    name: 'VendorManageCategoriesPicker',
    component: VendorManageCategoriesPicker,
  },
  {
    name: 'VendorManageAddProductStep2',
    component: VendorManageAddProductStep2,
  },
  {
    name: 'VendorManageAddProductStep3',
    component: VendorManageAddProductStep3,
  },
  {
    name: 'VendorManagePricingInventory',
    component: VendorManagePricingInventory,
  },
  {
    name: 'VendorManageShippingProperties',
    component: VendorManageShippingProperties,
  },
];

// register all screens of the app (including internal ones)
export default function registerScreens(store) {
  screenList.map((item) =>
    Navigation.registerComponentWithRedux(
      item.name,
      () => item.component,
      Provider,
      store,
    ),
  );
}
