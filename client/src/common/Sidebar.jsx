import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  {
    to: "/userlist",
    label: "Users",
    icon: "people",
    activePaths: ["/userDetail"],
  },
  {
    to: "/lenderlist",
    label: "Lenders",
    icon: "business",
    activePaths: ["/lenderdetail"],
  },
  {
    to: "/categorylist",
    label: "Categories",
    icon: "grid_view",
    activePaths: ["/categoryadd", "/updatecategory", "/categoryDetail"],
  },
  {
    to: "/productlist",
    label: "Products",
    icon: "list",
    activePaths: ["/productdetail"],
  },
  {
    to: "/bookinglist",
    label: "Bookings",
    icon: "calendar_today",
    activePaths: ["/bookingdetail"],
  },
  {
    to: "/transactionlist",
    label: "Transactions",
    icon: "attach_money",
    activePaths: ["/transactiondetail"],
  },
   {
    to: "/ratinglist",
    label: "Ratings",
    icon: "star",
    activePaths: ["/ratingdetail"],
  },
  {
    to: "/contactlist",
    label: "Contacts",
    icon: "lock",
    activePaths: ["/contactDetail"],
  },
  { to: "/privacypolicy", label: "Privacy Policy", icon: "shield" },
  { to: "/aboutus", label: "About Us", icon: "info" },
  { to: "/termsconditions", label: "Terms&Conditions", icon: "article" },
];

const Sidebar = ({ handleLinkClick }) => {
  const renderNavItem = ({ to, label, icon, activePaths = [] }) => {
    const isActivePath = () =>
      window.location.pathname.startsWith(to) ||
      activePaths.some((path) => window.location.pathname.startsWith(path));

    return (
      <li className="nav-item" key={to}>
        <NavLink
          className={({ isActive }) =>
            `nav-link text-white ${
              isActive || isActivePath() ? "active bg-gradient-primary" : ""
            }`
          }
          to={to}
          onClick={handleLinkClick}
        >
          <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
            <i className="material-icons opacity-10">{icon}</i>
          </div>
          <span className="nav-link-text ms-1">{label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark"
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <i
          className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
        ></i>
        <NavLink className="navbar-brand m-0" to="/dashboard">
          <img
            src="/assets/img/home-decor-3.png"
            className="navbar-brand-img h-100"
            alt="main_logo"
          />
          <span className="ms-1 font-weight-bold text-white">React</span>
        </NavLink>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div
        className="collapse navbar-collapse w-auto"
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">{menuItems.map(renderNavItem)}</ul>
      </div>
    </aside>
  );
};

export default Sidebar;
