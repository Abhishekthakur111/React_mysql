import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../Config";

const AddCategory = () => {
  const [data, setData] = useState({
    name: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const navigate = useNavigate();

  const nameValidation = /^[A-Za-z][A-Za-z0-9\s@#&!()_\-.,]{2,19}$/;
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "image" && files.length > 0) {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/png"];

      if (allowedTypes.includes(file.type)) {
        setData((prevData) => ({
          ...prevData,
          [id]: file,
        }));
        setImagePreview(URL.createObjectURL(file));
        setImageError("");
      } else {
        setImageError("Only JPG and PNG images are allowed.");
        setData((prevData) => ({
          ...prevData,
          [id]: null,
        }));
        setImagePreview(null);
      }
    } else if (id === "name") {
      const trimmedValue = value.trimStart();
      setData((prevData) => ({
        ...prevData,
        [id]: trimmedValue,
      }));

      if (!/^[A-Za-z][A-Za-z0-9\s@#&!()_\-.,]{2,19}$/.test(trimmedValue)) {
        setNameError(
          "Name must start with a letter, be 3–20 characters, and include only letters, numbers, spaces, and @#&!()_-.,"
        );
      } else {
        setNameError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.image) {
      toast.error("Category image is required!");
      return;
    }
    if (!data.name.trim()) {
      toast.error("Category name is required!");
      return;
    }
    if (nameError) {
      toast.error("Please fix the name error before submitting!");
      return;
    }
    if (imageError) {
      toast.error("Please fix the image error before submitting!");
      return;
    }

    const formData = new FormData();
    if (data.image) {
      formData.append("image", data.image);
    }
    formData.append("name", data.name);
    try {
      const response = await axiosInstance.post(`/createcategory`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data.success) {
        toast.success("Category added successfully!");
        setTimeout(() => {
          navigate("/categorylist");
        }, 1000);
      } else {
        toast.error(response.data.message || "Category creation failed.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Request failed: " + error.message);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-2">
                  <div className="d-flex justify-content-between align-items-center px-3 pt-1">
                    <h6 className="text-white text-capitalize">Add Category</h6>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="form-group col-3 mb-2 bg-788000">
                    <label htmlFor="name">Category Image</label>
                    <div className="admin_profile mt-2" data-aspect="1/1">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            borderRadius: "10px",
                            width: "240px",
                            height: "200px",
                            marginBottom: "5px",
                          }}
                        />
                      )}
                      <input
                        type="file"
                        id="image"
                        className="form-control"
                        onChange={handleChange}
                        style={{
                          paddingLeft: "10px",
                          border: "1px solid #ccc",
                        }}
                      />
                      {imageError && (
                        <div style={{ color: "red" }}>{imageError}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={data.name}
                      onChange={handleChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/^\s+/g, "");
                      }}
                      style={{
                        paddingLeft: "10px",
                        border: "1px solid #ccc",
                      }}
                      placeholder="Enter category name"
                    />

                    {nameError && (
                      <div style={{ color: "red" }}>{nameError}</div>
                    )}
                  </div>
                </div>
                <div className="mx-4 text-end">
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ marginRight: "10px" }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/categorylist")}
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
