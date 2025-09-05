import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { axiosInstance, BASE_URL } from "../Config";
import { toast } from "react-toastify";

const Navbar = ({ toggleSidebar, closeSidebar }) => {
  const location = useLocation();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axiosInstance.get(`/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.body) {
          const { image, name } = response.data.body;
          setImage(`${BASE_URL}/${image}`);
          setName(name);
        }
      } catch (error) {
        toast.error("Error fetching profile data", error);
      }
    };

    fetchProfile();

    if (location.state?.updated) {
      fetchProfile();
    }
  }, [location.state]);

  const logout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#788000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/logout`);
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {}
    }
  };

  const pathToTitleMap = {
    "/dashboard": "Dashboard",
    "/userlist": "Users",
    "/lenderlist": "Lenders",
    "/categorylist": "Categories",
    "/privacypolicy": "Privacy Policy",
    "/aboutus": "About Us",
    "/termsconditions": "Terms&Conditions",
    "/changepassword": "Change Password",
    "/profile": "Profile",
    "/contactlist": "Contacts",
    "/categoryadd": "Add Category",
    "/productlist": "Products",
    "/bookinglist": "Bookings",
    "/transactionlist": "Transactions",
    "/ratinglist": "Ratings",
  };

  const currentPath = location.pathname;
  const currentTitle =
    pathToTitleMap[currentPath] ||
    (currentPath.startsWith("/userDetail")
      ? "User Details"
      : currentPath.startsWith("/lenderdetail")
      ? "Lender Details"
      : currentPath.startsWith("/categoryDetail")
      ? "Category Details"
      : currentPath.startsWith("/updatecategory")
      ? "Edit Category"
      : currentPath.startsWith("/productdetail/")
      ? "Product Details"
      : currentPath.startsWith("/contactDetail/")
      ? "Contact Details"
      : currentPath.startsWith("/bookingdetail/")
      ? "Booking Details"
      : currentPath.startsWith("/categoryadd")
      ? "Add Category"
      : currentPath.startsWith("/transactiondetail/")
      ? "Transaction Details"
      : currentPath.startsWith("/ratingdetail/")
      ? "Rating Details"
      : "");

  const handleLinkClick = () => {
    closeSidebar();
  };

  return (
    <nav
      className="navbar navbar-main navbar-expand-lg px-0 mx-4 mt-3 shadow-none border-radius-xl"
      id="navbarBlur"
      data-scroll="true"
      style={{ backgroundColor: "#788000" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <button
          onClick={toggleSidebar}
          className="navbar-toggler d-xl-none"
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
          }}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div aria-label="breadcrumb">
          <h3 className="font-weight-bolder mb-0 d-none d-lg-block">
            {currentTitle}
          </h3>
        </div>

        <ul className="navbar-nav navbar-right d-flex align-items-center">
          <li className="d-flex align-items-center ms-auto">
            <h6 className="mb-0">{name}</h6>
            <div className="dropdown" ref={dropdownRef}>
              <Link
                to="#"
                onClick={toggleDropdown}
                className="nav-link nav-link-lg nav-link-user d-flex align-items-center"
                style={{ position: "relative" }}
              >
                <img
                  alt="avatar"
                  src={image || "default_avatar.png"}
                  style={{ height: "30px", width: "30px", cursor: "pointer" }}
                  className="rounded-circle mr-1"
                />
              </Link>
              {dropdownOpen && (
                <div
                  className={`dropdown-menu dropdown-menu-end ${
                    dropdownOpen ? "show" : ""
                  }`}
                  style={{
                    position: "absolute",
                    top: "15px",
                    borderRadius: "0.5rem",
                    minWidth: "130px",
                    zIndex: 1000,
                  }}
                >
                  <Link
                    to="/profile"
                    className="dropdown-item has-icon text-success"
                    onClick={() => {
                      closeDropdown();
                      handleLinkClick();
                    }}
                  >
                    <i className="far fa-user" /> Profile
                  </Link>
                  <Link
                    to="/changepassword"
                    className="dropdown-item has-icon text-info"
                    onClick={() => {
                      closeDropdown();
                      handleLinkClick();
                    }}
                  >
                    <i className="fas fa-cogs" /> Change Password
                  </Link>
                  <Link
                    to="#"
                    className="dropdown-item has-icon text-danger"
                    onClick={logout}
                  >
                    <i className="fas fa-sign-out-alt" /> Log out
                  </Link>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
