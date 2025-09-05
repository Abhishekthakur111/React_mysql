import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from "react-router-dom";
import Login from "./Login";
import Layout from "./common/Layout";
import Dashboard from "./Dashboard";
import UserList from "./User/UserList";
import CategoryList from "./Category/CategoryList";
import Profile from "./admin/Profile";
import Password from "./admin/Password";
import AddCategory from "./Category/AddCategory";
import ListView from "./User/ListView";
import CategoryView from "./Category/CategoryView";
import PrivateRoute from "./PrivateRoute"; 
import CategoryEdit from './Category/CategoryEdit';
import ContactList from './Contact/ContactList';
import ContactView from './Contact/ContactView';
import PrivacyPolicy from './Cms/PrivacyPolicy';
import TermsConditions from './Cms/TermsConditions';
import AboutUs from './Cms/AboutUs';
import ProductList from './Product/ProductList';
import ProductAdd from './Product/ProductAdd';
import ProductView from './Product/ProductView';
import LenderList from './Lender/LenderList';
import LenderDetail from './Lender/LenderDetail';
import BookingList from './Booking/BookingList';
import BookingView from './Booking/BookingView';
import TransactionList from './transaction/TransactionList';
import TransactionView from './transaction/TransactionView';
import RatingList from './Rating/RatingList';
import RatingDetail from './Rating/RatingDetail';

const App = () => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}/>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/userlist" element={<PrivateRoute element={<UserList />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/userDetail/:id" element={<PrivateRoute element={<ListView />} />} />
            <Route path="/categorylist" element={<PrivateRoute element={<CategoryList />} />} />
            <Route path="/categoryDetail/:id" element={<PrivateRoute element={<CategoryView />} />} />
            <Route path="/categoryadd" element={<PrivateRoute element={<AddCategory />} />} />
            <Route path='/updatecategory/:id' element={<PrivateRoute element={<CategoryEdit/>}/>}/>
            <Route path="/privacypolicy" element={<PrivateRoute element={<PrivacyPolicy />} />} />
            <Route path="/aboutus" element={<PrivateRoute element={<AboutUs />} />} />
            <Route path="/termsconditions" element={<PrivateRoute element={<TermsConditions />} />} />
            <Route path="/changepassword" element={<PrivateRoute element={<Password />} />} />
            <Route path='/contactlist' element={<PrivateRoute element={<ContactList/>}/>}/>
            <Route path='/contactDetail/:id' element={<PrivateRoute element={<ContactView/>}/>}/>
            <Route path='/productlist' element={<PrivateRoute element={<ProductList/>}/>}/>
            <Route path="/createproduct" element={<PrivateRoute element={<ProductAdd />} />} />
            <Route path="/productdetail/:id" element={<PrivateRoute element={<ProductView />} />} />
            <Route path='/lenderlist' element={<PrivateRoute element={<LenderList/>}/>}/>
            <Route path='/lenderdetail/:id' element={<PrivateRoute element={<LenderDetail/>}/>}/>
            <Route path='/bookinglist' element={<PrivateRoute element={<BookingList/>}/>}/>
            <Route path='/bookingdetail/:id' element={<PrivateRoute element={<BookingView/>}/>}/>
            <Route path='/transactionlist' element={<PrivateRoute element={<TransactionList/>}/>}/>
            <Route path='/transactiondetail/:id' element={<PrivateRoute element={<TransactionView/>}/>}/>
            <Route path='/ratinglist' element={<PrivateRoute element={<RatingList/>}/>}/>
            <Route path='/ratingdetail/:id' element={<PrivateRoute element={<RatingDetail/>}/>}/>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} >
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
