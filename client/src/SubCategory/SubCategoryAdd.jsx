import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    category_id: "",
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
      setErrors((prev) => ({
        ...prev,
        category_id: "Error fetching categories",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png"];

      if (!validTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Only JPG and PNG images are allowed.",
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
      const trimmed = value.trimStart();
      const nameRegex = /^[A-Za-z][A-Za-z0-9\s@#&!()_\-.,]{2,19}$/;

      if (!trimmed) {
        setErrors((prev) => ({
          ...prev,
          name: "Please enter subcategory name.",
        }));
      } else if (!nameRegex.test(trimmed)) {
        setErrors((prev) => ({
          ...prev,
          name:
            "Name must start with a letter, be 3–20 characters, and can include letters, numbers, spaces, @#&!()_-.,",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          name: "",
        }));
      }

      setData((prev) => ({
        ...prev,
        [name]: trimmed,
      }));
    } else if (name === "price") {
      const priceNum = Number(value);

      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          price: "Please enter price.",
        }));
      } else if (isNaN(priceNum) || priceNum <= 0) {
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
    } else if (name === "category_id") {
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          category_id: "Please select a category.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          category_id: "",
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
    const nameRegex = /^[A-Za-z][A-Za-z0-9\s@#&!()_\-.,]{2,19}$/;
    let isValid = true;
    let tempErrors = { ...errors };

    if (!name) {
      tempErrors.name = "Please enter subcategory name.";
      isValid = false;
    } else if (!nameRegex.test(name)) {
      tempErrors.name =
        "Name must start with a letter, be 3–20 characters, and contain valid characters.";
      isValid = false;
    } else {
      tempErrors.name = "";
    }

    if (!price) {
      tempErrors.price = "Please enter price.";
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      tempErrors.price = "Price must be a valid positive number.";
      isValid = false;
    } else {
      tempErrors.price = "";
    }

    if (!image) {
      tempErrors.image = "Please upload an image.";
      isValid = false;
    } else {
      tempErrors.image = "";
    }

    if (!category_id) {
      tempErrors.category_id = "Please select a category.";
      isValid = false;
    } else {
      tempErrors.category_id = "";
    }

    setErrors(tempErrors);
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
        navigate("/subcategorylist");
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: response.data.message || "Update failed",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Request failed",
      }));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-2">
                <div className="d-flex justify-content-between align-items-center px-3 pt-1">
                  <h6 className="text-white text-capitalize">Add New Sub Category</h6>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="form-group col-3">
                  <label htmlFor="name">Image</label>
                  <div className="admin_profile" data-aspect="1/1">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ borderRadius: "10px", width: "240px", height: "200px", marginBottom: "5px" }}
                      />
                    )}
                    <input
                      type="file"
                      name="image"
                      className="form-control"
                      onChange={handleChange}
                      style={{ paddingLeft: "10px", backgroundColor: "#ff8080" }}
                    />
                    {errors.image && <small className="text-danger">{errors.image}</small>}
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
                    style={{ paddingLeft: "10px", backgroundColor: "#ff8080" }}
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
                  {errors.category_id && <small className="text-danger">{errors.category_id}</small>}
                </div>

                <div className="form-group mb-2">
                  <label htmlFor="name">Subcategory Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/^\s+/g, "");
                    }}
                    style={{ paddingLeft: "10px", backgroundColor: "#ff8080" }}
                    placeholder="Enter sub category name"
                  />
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>

                <div className="form-group mb-2">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={data.price}
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/^\s+/g, "");
                    }}
                    style={{ paddingLeft: "10px", backgroundColor: "#ff8080" }}
                    placeholder="Enter price"
                  />
                  {errors.price && <small className="text-danger">{errors.price}</small>}
                </div>

                {errors.submit && <div className="text-danger mb-2">{errors.submit}</div>}
              </div>

              <div className="mx-4 text-end">
                <button type="submit" className="btn btn-primary" style={{ marginRight: "10px" }}>
                  Add
                </button>
                <button type="button" className="btn btn-primary" onClick={() => navigate("/subcategorylist")}>
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryAdd;
