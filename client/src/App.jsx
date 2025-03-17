import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from "react-router-dom";
import Login from "./admin/Login";
import Layout from "./common/Layout";
import Dashboard from "./Dashboard";
import UserList from "./admin/UserList";
import CategoryList from "./Category/CategoryList";
import Profile from "./admin/Profile";
import Privacy from "./admin/Privacy";
import AboutUs from "./admin/AboutUs";
import Terms from "./admin/Terms";
import Password from "./admin/Password";
import AddCategory from "./Category/AddCategory";
import ListView from "./admin/ListView";
import CategoryView from "./Category/CategoryView";
import SubCategoryList from "./SubCategory/SubCategoryList";
import SubCategoryView from "./SubCategory/SubCategoryView";
import SubCategoryAdd from "./SubCategory/SubCategoryAdd";
import BookingList from "./Booking/BookingList";
import BookingView from "./Booking/BookingView";
import PrivateRoute from "./PrivateRoute"; 
import CategoryEdit from './Category/CategoryEdit';
import SubCategoryEdit from './SubCategory/SubCategoryEdit';
import ContactList from './Contact/ContactList';
import ContactView from './Contact/ContactView';



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
            <Route path="/privacypolicy" element={<PrivateRoute element={<Privacy />} />} />
            <Route path="/aboutus" element={<PrivateRoute element={<AboutUs />} />} />
            <Route path="/terms&conditions" element={<PrivateRoute element={<Terms />} />} />
            <Route path="/changepassword" element={<PrivateRoute element={<Password />} />} />
            <Route path="/subcategoryList" element={<PrivateRoute element={<SubCategoryList />} />} />
            <Route path="/subcategoryDetail/:id" element={<PrivateRoute element={<SubCategoryView />} />} />
            <Route path="/subcategoryadd" element={<PrivateRoute element={<SubCategoryAdd />} />} />
            <Route path="/updatesubcategory/:id" element={<PrivateRoute element={<SubCategoryEdit/>}/>}/>
            <Route path="/bookinglist" element={<PrivateRoute element={<BookingList />} />} />
            <Route path="/bookingDetail/:id" element={<PrivateRoute element={<BookingView />} />} />
            <Route path='/contactlist' element={<PrivateRoute element={<ContactList/>}/>}/>
            <Route path='/contactDetail/:id' element={<PrivateRoute element={<ContactView/>}/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
