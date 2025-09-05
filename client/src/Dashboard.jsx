import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ApexChart from "./ApexChart";
import { axiosInstance } from "./Config";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [users, setUsers] = useState(0);
  const [lenderCount, setLenderCount] = useState(0);
  const [categories, setCategories] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing");
        navigate("/");
        return;
      }

      const response = await axiosInstance.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const body = response.data.body;
        setUsers(body.userCount || 0);
        setLenderCount(body.lenderCount || 0);
        setCategories(body.categories || 0);
        setProductCount(body.productCount || 0);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (location.state?.message) {
      toast.success(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <ToastContainer />
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <Link to="/userlist">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">person</i>
                  </div>
                  <div className="text-end ">
                    <h4>Users</h4>
                    <h4>{users}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <Link to="/lenderlist">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">business</i>
                  </div>
                  <div className="text-end pt-1">
                    <h4>Lenders</h4>
                    <h4>{lenderCount}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 ">
            <Link to="/categorylist">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-success shadow-success text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">grid_view</i>
                  </div>
                  <div className="text-end ">
                    <h4>Categories</h4>
                    <h4>{categories}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-3 col-sm-6 ">
            <Link to="/productlist">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-info shadow-info text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">list</i>
                  </div>
                  <div className="text-end pt-1">
                    <h4>Products</h4>
                    <h4>{productCount}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row d-flex">
          <div className="col-6">
            <ApexChart />
          </div>
          <div className="col-6"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
