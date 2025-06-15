// General
import NotFound from "../../pages/error/NotFound";
import Dashboard from "../../pages/dashboard/Overview";
import PrivateRoute from "./PrivateRoute.jsx";

// Media
import Media from "../../pages/media/Media.jsx";

// Settings
import Api from "../../pages/settings/Api";
import Email from "../../pages/settings/Email";
import General from "../../pages/settings/General";
import CronJob from "../../pages/settings/CronJob";
import Permalink from "../../pages/settings/Permalink";
import Languages from "../../pages/settings/Languages";
import SocialLogin from "../../pages/settings/SocialLogin";

// Products
import Attribute from "../../pages/products/Attribute";
import AddProduct from "../../pages/products/AddProduct";
import EditProduct from "../../pages/products/EditProduct";
import ManageProduct from "../../pages/products/ManageProduct";

// Orders
import AddOrder from "../../pages/orders/AddOrder";
import ManageOrder from "../../pages/orders/ManageOrder";
import OrderDetail from "../../pages/orders/OrderDetail";

// brand
import AddBrand from "../../pages/brands/AddBrand";
import ManageBrand from "../../pages/brands/ManageBrand";
import EditBrand from "../../pages/brands/EditBrand";

// Customer
import AddCustomer from "../../pages/customers/AddCustomer";
import EditCustomer from "../../pages/customers/EditCustomer";
import ManageCustomer from "../../pages/customers/ManageCustomer";

// Users
import AddUser from "../../pages/users/AddUser";
import EditUser from "../../pages/users/EditUser";
import UserList from "../../pages/users/UserList";

// Venue

// Categories
import AddCategories from "../../pages/categories/AddCategories";
import EditCategories from "../../pages/categories/EditCategories";
import ManageCategories from "../../pages/categories/ManageCategories";

// Reviews
import ManageReviews from "../../pages/reviews/ManageReviews";
import ReviewsDetail from "../../pages/reviews/ReviewsDetail";

// Pages
import AddPage from "../../pages/pages/AddPage";
import EditPage from "../../pages/pages/EditPage";
import ManagePages from "../../pages/pages/ManagePages";

// Payment
import ManageTransactions from "../../pages/payment/ManageTransactions";
import PaymentMethod from "../../pages/payment/PaymentMethod";
import TransactionDetail from "../../pages/payment/TransactionDetail";
import ShippingCharge from "../../pages/pages/shippingChargesPage.jsx";
import AddParentCategory from "../../pages/categories/AddParentCategory.jsx";
import ManageParentCategories from "../../pages/categories/ManageParentCategories.jsx";
import EditParentCategory from "../../pages/categories/EditParentCategory.jsx";
import ManageSales from "../../pages/venue/ManageVenue";
import ViewSales from "../../pages/venue/AddVenue";
import ManageDefaultFields from "../../pages/products/ManageDefaultFields.jsx";
import ManageDefaultFieldsDashboard from "../../pages/dashboard/manageDashboardTexts.jsx";
import LocalDelivery from "../../pages/pages/LocalDelivery.jsx";
import LocalDeliveryPage from "../../pages/pages/LocalDeliverySetting.jsx";
import SoldOutProducts from "../../pages/products/SoldOutProduct.jsx";
import ManageNewsLetter from "../../pages/pages/ManageNewsletter.jsx";
// import AddSubCategory from "../../pages/categories/AddSubCategory.jsx";

// Sorting and Comments

const routes = [
  {
    path: "/",
    element: <PrivateRoute element={<Dashboard />} />,
  },
  {
    path: "/catalog/product/add",
    element: <PrivateRoute element={<AddProduct />} />,
  },
  {
    path: "/catalog/product/manage",
    element: <PrivateRoute element={<ManageProduct />} />,
  },
  {
    path: "/catalog/product/manage/:productId",
    element: <PrivateRoute element={<EditProduct />} />,
  },
  {
    path: "/catalog/product/attribute",
    element: <PrivateRoute element={<Attribute />} />,
  },
  {
    path: "/orders/add",
    element: <PrivateRoute element={<AddOrder />} />,
  },
  {
    path: "/orders/manage",
    element: <PrivateRoute element={<ManageOrder />} />,
  },
  {
    path: "/orders/manage/:orderID",
    element: <PrivateRoute element={<OrderDetail />} />,
  },
  // Catalog Categories
  {
    path: "/catalog/categories/manage",
    element: <ManageCategories />,
  },
  {
    path: "/catalog/categories/:categoryid",
    element: <EditCategories />,
  },
  {
    path: "/catalog/category/add",
    element: <AddCategories />
  },
  {
    path: "/catalog/category/:categoryid",
    element: <EditCategories />
  },{
    path: "/catalog/parent-category/add",
    element: < AddParentCategory/>,
  },
  {
    path: "/catalog/sub-category/manage",
    element: <ManageParentCategories />
  },

  {
    path: "/catalog/sub-category/:id",
    element: <EditParentCategory/>
  },

  {
    path: "/catalog/sold-out",
    element: <SoldOutProducts/>
  },


  // customers
  {
    path: "/customers/add",
    element: <AddCustomer />,
  },
  {
    path: "/customers/manage",
    element: <ManageCustomer />,
  },
  {
    path: "/customers/manage/:customerId",
    element: <EditCustomer />,
  },
  // shipping charges page 
  {
    path: "/shipping-charges/:type",
    element: <ShippingCharge/>
  },
  {
    path: "/delivery/local",
    element: <LocalDelivery/>
  },
  {
    path: "/delivery/local-settings/:shopId",
    element: <LocalDeliveryPage/>
  },
  // brand
  {
    path: "/brands/add",
    element: <AddBrand />,
  },
  {
    path: "/brands/manage",
    element: <ManageBrand />,
  },
  {
    path: "/brands/manage/:brandId",
    element: <EditBrand />,
  },
  {
    path: "/manage/default/product/:type",
    element: <ManageDefaultFields/>,
  },
  {
    path: "/manage/default/dashboard",
    element: <ManageDefaultFieldsDashboard/>
  },
  // Users
  {
    path: "/users/list",
    element: <UserList />,
  },
  {
    path: "/users/add",
    element: <AddUser />,
  },
  {
    path: "/users/list/:userid",
    element: <EditUser />,
  },
  // Venue
  {
    path: "/venue/:saleId",
    element: <ViewSales />,
  },
  {
    path: "/venue/manage",
    element: <ManageSales />,
  },
  {
    path: "/newsletter",
    element: <ManageNewsLetter/>
  },
  // Reviews
  {
    path: "/reviews",
    element: <ManageReviews />,
  },
  {
    path: "/reviews/:reviewid",
    element: <ReviewsDetail />,
  },
  // Pages
  {
    path: "/pages",
    element: <ManagePages />,
  },
  {
    path: "/pages/add",
    element: <AddPage />,
  },
  {
    path: "/pages/:pageId",
    element: <EditPage />,
  },
  // Payment
  {
    path: "/payment/transactions",
    element: <ManageTransactions />,
  },
  {
    path: "/payment/transactions/:transactionId",
    element: <TransactionDetail />,
  },
  {
    path: "/payment/payment-method",
    element: <PaymentMethod />,
  },
  // Media
  {
    path: "/media",
    element: <Media />,
  },
  // Settings
  {
    path: "/setting/general",
    element: <General />,
  },
  {
    path: "/setting/email",
    element: <Email />,
  },
  {
    path: "/setting/cronJob",
    element: <CronJob />,
  },
  {
    path: "/setting/permalink",
    element: <Permalink />,
  },
  {
    path: "/setting/languages",
    element: <Languages />,
  },
  {
    path: "/setting/social-login",
    element: <SocialLogin />,
  },
  {
    path: "/setting/api",
    element: <Api />,
  },
  // Not Found
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;