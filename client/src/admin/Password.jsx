import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { axiosInstance } from '../Config';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Password = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

const reset = async (e) => {
  e.preventDefault();

  if (newPassword.length < 5 || newPassword.length > 50) {
    toast.error("New password must be between 5 and 50 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("New password and confirm password do not match");
    return;
  }

  if (password === newPassword) {
    toast.error("New password cannot be the same as the old password");
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("No token found. Please log in again.");
    return;
  }

  try {
    const response = await axiosInstance.post(
      `/updatepassword`,
      { password, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      localStorage.setItem('token', response.data.body.token);
      toast.success("Your password was reset successfully");
      navigate("/");
    } else {
      toast.error(response.data.message || "Password reset failed");
    }
  } catch (error) {
    toast.error((error.response?.data?.message || error.message));
  }
};


  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-3 pb-2">
                  <h6 className="text-white text-capitalize ps-3">Change Password</h6>
                </div>
              </div>
              <form onSubmit={reset} className="mt-4">
                <div className="form-group mx-3 mb-3">
                  <label htmlFor="password">Old Password</label>
                  <div className="input-group">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      minLength={5}
                      maxLength={50}
                      style={{backgroundColor:'#fd7a7f', paddingLeft:"10px"}}
                      placeholder='Enter old password'
                    />
                    <span className="input-group-text mx-3" onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="form-group mx-3 mb-2">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-group">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="form-control"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      required
                      minLength={5}
                      maxLength={50}
                      style={{backgroundColor:'#fd7a7f', paddingLeft:"10px"}}
                      placeholder='Enter new password'
                    />
                    <span className="input-group-text mx-3" onClick={toggleShowNewPassword} style={{ cursor: 'pointer' }}>
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="form-group mx-3 mb-4">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-group">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      minLength={5}
                      maxLength={50}
                      style={{backgroundColor:'#fd7a7f', paddingLeft:"10px"}}
                       placeholder='Enter confirom password'
                    />
                    <span className="input-group-text mx-3" onClick={toggleShowConfirmPassword} style={{ cursor: 'pointer' }}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-start mx-3">
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Password;
