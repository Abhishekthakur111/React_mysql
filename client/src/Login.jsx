import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { axiosInstance } from "./Config";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(regex.test(email) ? "" : "Invalid email format");
  };

  const validatePassword = (password) => {
    setPasswordError(
      password.length >= 6 ? "" : "Password must be at least 6 characters long"
    );
  };

  const handleChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!emailError && !passwordError) {
      try {
        const response = await axiosInstance.post("/login", { email, password });
  
        localStorage.setItem("token", response.data.body.token);
        navigate("/dashboard", {
          state: { message: "Admin logged in successfully" },
        });
        toast.success("Login successful!");
      } catch (error) {
        if (error.response) {
       
          toast.error(error.response.data.message || "Invalid email or password");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      }
    }
  };
  
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="bg-gray-200">
        <main className="main-content mt-0">
          <div
            className="page-header align-items-start min-vh-100"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            }}
          >
            <span className="mask opacity-6"></span>
            <div className="container my-auto">
              <div className="row">
                <div className="col-lg-4 col-md-8 col-12 mx-auto">
                  <div className="card z-index-0 fadeIn3 fadeInBottom">
                    <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                      <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                        <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                          Sign in
                        </h4>
                        <div className="row mt-3">
                          <div className="col-2 text-center ms-auto">
                            <Link className="btn btn-link px-3" to="">
                              <i className="fab fa-facebook text-white text-lg"></i>
                            </Link>
                          </div>
                          <div className="col-2 text-center px-1">
                            <Link className="btn btn-link px-3" to="">
                              <i className="fab fa-github text-white text-lg"></i>
                            </Link>
                          </div>
                          <div className="col-2 text-center me-auto">
                            <Link className="btn btn-link px-3" to="">
                              <i className="fab fa-google text-white text-lg"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit} className="text-start">
                        <div className="input-group input-group-outline mb-2">
                          <span className="input-group-text px-2">
                          <span className="material-icons">mail</span>
                          </span>
                          <input
                            type="email"
                            className="form-control ps-2"
                            value={email}
                            onChange={handleChangeEmail}
                            required
                            placeholder="Email"
                          />
                        </div>
                        {emailError && (
                          <small className="text-danger ">{emailError}</small>
                        )}

                        <div className="input-group input-group-outline mb-2 mt-2">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control ps-2"
                            value={password}
                            onChange={handleChangePassword}
                            required
                            placeholder="Password"
                          />
                          <span
                            className="input-group-text px-2 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i
                              className={`fas ${
                                showPassword ? "fa-eye-slash" : "fa-eye"
                              }`}
                            ></i>
                          </span>
                        </div>
                        {passwordError && (
                          <small className="text-danger">{passwordError}</small>
                        )}

                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn bg-gradient-primary w-100 my-4 mb-2"
                          >
                            Sign in
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
