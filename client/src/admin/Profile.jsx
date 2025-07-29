import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance, BASE_URL } from "../Config";

const Profile = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    address: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      try {
        const response = await axiosInstance.get(`/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.body) {
          setData(response.data.body);
          const imageUrl = response.data.body.image.startsWith("http")
            ? response.data.body.image
            : `${BASE_URL}/${response.data.body.image}`;
          setImagePreview(imageUrl);
        }
      } catch (error) {
        toast.error("Error fetching profile data");
      }
    };

    fetchProfileData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name) return "Name is required";
    if (name.length < 2 || name.length > 20)
      return "Name must be between 2 and 20 characters";
    if (!nameRegex.test(name))
      return "Name must contain only letters and spaces";
    return "";
  };

  const validatePhone = (phonenumber) => {
    const phoneRegex = /^[0-9]+$/;
    if (!phonenumber) return "Phone number is required";
    if (phonenumber.length < 8 || phonenumber.length > 15)
      return "Phone number must be between 8 and 15 digits";
    if (!phoneRegex.test(phonenumber))
      return "Phone number must contain only numbers";
    return "";
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({ ...prevData, name: value }));
    const nameError = validateName(value);
    setErrors((prevErrors) => ({ ...prevErrors, name: nameError }));
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({ ...prevData, phonenumber: value }));
    const phoneError = validatePhone(value);
    setErrors((prevErrors) => ({ ...prevErrors, phonenumber: phoneError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (errors.name || errors.phonenumber) {
      formErrors = { ...formErrors, ...errors };
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phonenumber", data.phonenumber);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axiosInstance.post(`/updateprofile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedData = response.data.body;
      setData(updatedData);
      if (updatedData.image) {
        const imageUrl = updatedData.image.startsWith("http")
          ? updatedData.image
          : `${BASE_URL}/${updatedData.image}`;
        setImagePreview(imageUrl);
      }

      toast.success("Profile updated successfully");
      navigate("/profile", { state: { updated: true } });
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-3 pb-2">
                  <h6 className="text-white text-capitalize ps-3">Profile</h6>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="form-validate"
                noValidate
                encType="multipart/form-data"
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body py-4">
                        <div className="tab-content">
                          <div className="tab-pane active" id="account">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                              }}
                            >
                              <div
                                style={{
                                  flex: "0 0 auto",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    width: "300px",
                                    height: "300px",
                                    borderRadius: "20px",
                                    backgroundColor: "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#555",
                                    fontSize: "1.2rem",
                                    position: "relative",
                                  }}
                                >
                                  {imagePreview ? (
                                    <>
                                      <img
                                        src={imagePreview}
                                        alt="image"
                                        style={{
                                          width: "300px",
                                          height: "300px",
                                          objectFit: "cover",
                                          borderRadius: "20px",
                                        }}
                                      />
                                      <label
                                        htmlFor="image"
                                        style={{
                                          position: "absolute",
                                          bottom: "15px",
                                          right: "10px",
                                          cursor: "pointer",
                                          backgroundColor:
                                            "rgba(255, 255, 255, 0.7)",
                                          borderRadius: "10%",
                                          padding: "5px",
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          icon={faPenNib}
                                          size="lg"
                                          color="black"
                                        />
                                      </label>
                                    </>
                                  ) : (
                                    <span>No Image</span>
                                  )}
                                </div>

                                <input
                                  type="file"
                                  style={{ display: "none" }}
                                  id="image"
                                  onChange={handleImageChange}
                                />
                              </div>

                              <div style={{ flex: "1", marginLeft: "16px" }}>
                                {["name", "phonenumber"].map((field, index) => (
                                  <div
                                    key={index}
                                    style={{ marginBottom: "16px" }}
                                  >
                                    <label htmlFor={field}>
                                      {field === "name"
                                        ? "Name"
                                        : "Phone Number"}
                                    </label>
                                    <input
                                      type="text"
                                      minLength={field === "name" ? 2 : 8}
                                      maxLength={field === "name" ? 20 : 15}
                                      required
                                      placeholder={
                                        field === "name"
                                          ? "Enter Name"
                                          : "Enter Phone Number"
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "4px",
                                        border: "1px solid #ced4da",
                                        backgroundColor: "#fd7a7f",
                                      }}
                                      name={field}
                                      id={field}
                                      value={data[field]}
                                      onChange={
                                        field === "name"
                                          ? handleNameChange
                                          : handlePhoneChange
                                      }
                                    />
                                    {errors[field] && (
                                      <p style={{ color: "red" }}>
                                        {errors[field]}
                                      </p>
                                    )}
                                  </div>
                                ))}

                                <div style={{ marginBottom: "16px" }}>
                                  <label htmlFor="email">Email</label>
                                  <input
                                    type="email"
                                    required
                                    readOnly
                                    style={{
                                      width: "100%",
                                      padding: "8px",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                      backgroundColor: "lightgrey",
                                    }}
                                    name="email"
                                    id="email"
                                    value={data.email}
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
