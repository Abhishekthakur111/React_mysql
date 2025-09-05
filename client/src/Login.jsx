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
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(regex.test(email) ? "" : "Invalid email format");
  };

  const validatePassword = (password) => {
    setPasswordError(
      password.length >= 5 ? "" : "Password must be at least 5 characters long."
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

    if (emailError || passwordError || !email || !password || loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.body.token);

      navigate("/dashboard", { replace: true });
      setTimeout(() => {
        toast.success("Login successful!");
      }, 1000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Invalid email or password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
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
              backgroundImage: "url('/assets/img/ezrentus.png')",
            }}
          >
            <span className="mask opacity-6"></span>
            <div className="container my-auto">
              <div className="row">
                <div className="col-lg-6 col-md-8 col-12 mx-auto">
                  <div className="card z-index-0 fadeIn3 fadeInBottom bg-transparent shadow-none">
                    {/* <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                      <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                        <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                        
                        </h4>
                      </div>
                    </div> */}
                    <div className="card-body login-page">
                      <img
                        src="/assets/img/logo.png"
                        alt="logo"
                        className="img-fluid mb-3 m-auto d-block"
                        style={{ maxWidth: "100px" }}
                      />
                      <label
                        className="d-flex justify-content-center"
                        style={{ color: "white", fontSize: "20px" }}
                      >
                        {" "}
                        Welcome to Admin 👋
                      </label>
                      <form onSubmit={handleSubmit} className="text-start">
                        <label className="m-0">E-Mail</label>
                        <div className="input-group input-group-outline mb-2 mt-1">
                          <span className="input-group-text px-2">
                            <span className="material-icons">mail</span>
                          </span>
                          <input
                            type="email"
                            className="form-control ps-2"
                            value={email}
                            onChange={handleChangeEmail}
                            required
                            placeholder="E-mail"
                          />
                        </div>
                        {emailError && (
                          <small className="text-danger">{emailError}</small>
                        )}
                        <label className="m-0">Password</label>
                        <div className="input-group input-group-outline mb-2 mt-1 ">
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
                            disabled={loading}
                          >
                            {loading ? "Signing in..." : "Sign in"}
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
