import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../Config";

const SubCategoryAdd = () => {
  const [data, setData] = useState({
    category_id: "",
    name: "",
    price: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    image: "",
    price: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/categorylist`);
      if (response.data.success) {
        setCategories(response.data.body.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Please select a valid image file .jpg or .png.",
        }));
        return;
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));
      setData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    } else if (name === "name") {
      const regex = /^[A-Za-z\s]+$/;
      if (!value || !regex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "Name must only contain alphabetic characters.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "",
        }));
      }
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "price") {
      if (value <= 0 || isNaN(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          price: "Price must be a positive number.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          price: "",
        }));
      }
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const { name, price, image, category_id } = data;
    let isValid = true;

    if (!name.trim() || errors.name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Subcategory name is required and must be valid.",
      }));
      isValid = false;
    }

    if (!price || price <= 0 || errors.price) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Price must be a positive number.",
      }));
      isValid = false;
    }

    if (!image) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Please upload an image.",
      }));
      isValid = false;
    }

    if (!category_id) {
      toast.error("Please select a category.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    const formData = new FormData();
    formData.append("category_id", data.category_id);
    formData.append("name", data.name);
    formData.append("price", data.price);
    if (data.image) {
      formData.append("image", data.image);
    }  
    try {
      const response = await axiosInstance.post(`/createsubcategory`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success("Subcategory Added successfully!");
        setTimeout(() => {
          navigate("/subcategorylist");
        }, 1000);
      } else {
        toast.error(`Update failed: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Request failed: ${error.message}`);
    }
  };
  

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-2">
                  <div className="d-flex justify-content-between align-items-center px-3 pt-1">
                    <h6 className="text-white text-capitalize">
                      Add New Sub Category
                    </h6>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="form-group col-3">
                    <div className="admin_profile" data-aspect="1/1">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            borderRadius: "10px",
                            width: "290px",
                            height: "200px",
                            marginBottom: "5px",
                          }}
                        />
                      )}
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        onChange={handleChange}
                        style={{
                          paddingLeft: "10px",
                          backgroundColor: "#ff8080",
                        }}
                      />
                      {errors.image && (
                        <small className="text-danger">{errors.image}</small>
                      )}
                    </div>
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="category_id">Category</label>
                    <select
                      name="category_id"
                      id="category_id"
                      className="form-control"
                      value={data.category_id}
                      onChange={handleChange}
                      style={{
                        paddingLeft: "10px",
                        backgroundColor: "#ff8080",
                      }}
                       placeholder="Enter category name"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No Categories Available
                        </option>
                      )}
                    </select>
                  </div>


                  <div className="form-group mb-2">
                    <label htmlFor="name">Subcategory Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={data.name}
                      onChange={handleChange}
                      style={{
                        paddingLeft: "10px",
                        backgroundColor: "#ff8080",
                      }}
                       placeholder="Enter sub category name"
                    />
                    {errors.name && (
                      <small className="text-danger">{errors.name}</small>
                    )}
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={data.price}
                      onChange={handleChange}
                      style={{
                        paddingLeft: "10px",
                        backgroundColor: "#ff8080",
                      }}
                      placeholder="Enter price"
                    />
                    {errors.price && (
                      <small className="text-danger">{errors.price}</small>
                    )}
                  </div>
                </div>

                <div className="mx-4 text-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginRight: "10px" }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/subcategoryList")}
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

export default SubCategoryAdd;
