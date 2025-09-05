import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../Config";

const ProductAdd = () => {
  const [data, setData] = useState({
    category_id: "",
    name: "",
    price: "",
    hour: "",
    day: "",
    week: "",
    secuirtyDeposit: "",
    variants: "",
    description: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categorylist");
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

   if (name === "images" && files && files.length > 0) {
  const validTypes = ["image/jpeg", "image/png"];
  const selectedFiles = Array.from(files);
  const invalidFile = selectedFiles.find(file => !validTypes.includes(file.type));

  if (invalidFile) {
    setErrors(prev => ({
      ...prev,
      images: "Only JPG and PNG images are allowed.",
    }));
    return;
  }

  setErrors(prev => ({ ...prev, images: "" }));
  setData(prev => ({ ...prev, images: selectedFiles }));

  const previews = selectedFiles.map(file => URL.createObjectURL(file));
  setImagePreview(previews);
} else if (name !== "images") {
  const trimmed = value.replace(/^\s+/g, "");
  setData(prev => ({ ...prev, [name]: trimmed }));
}

  };

  const validateForm = () => {
    const {
      name,
      price,
      category_id,
      hour,
      day,
      week,
      secuirtyDeposit,
      variants,
      description,
      image,
    } = data;

    const nameRegex = /^[A-Za-z][A-Za-z0-9\s@#&!()_\-.,]{2,19}$/;
    const newErrors = {};

    if (!name) newErrors.name = "Please enter product name.";
    else if (!nameRegex.test(name))
      newErrors.name =
        "Name must start with a letter, be 3–20 characters, and contain valid characters.";

    if (!hour) newErrors.hour = "Please enter hourly price.";
    else if (isNaN(hour) || Number(hour) < 0)
      newErrors.hour = "Hour must be a non-negative number.";

    if (!day) newErrors.day = "Please enter daily price.";
    else if (isNaN(day) || Number(day) < 0)
      newErrors.day = "Day must be a non-negative number.";

    if (!week) newErrors.week = "Please enter weekly price.";
    else if (isNaN(week) || Number(week) < 0)
      newErrors.week = "Week must be a non-negative number.";

    if (!secuirtyDeposit)
      newErrors.secuirtyDeposit = "Please enter security deposit.";
    else if (isNaN(secuirtyDeposit) || Number(secuirtyDeposit) < 0)
      newErrors.secuirtyDeposit =
        "Security deposit must be a non-negative number.";

    if (!variants) newErrors.variants = "Please enter variants.";

    if (!description)
      newErrors.description = "Please enter product description.";

    if (!category_id) newErrors.category_id = "Please select a category.";

    if (data.images.length === 0)
      newErrors.images = "Please upload at least one image.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formData.append("images[]", file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axiosInstance.post("/createproduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        navigate("/productlist");
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: response.data.message || "Failed to create product.",
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
                  <h6 className="text-white text-capitalize">Add Product</h6>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="card-body">
                <div className="form-group col-6">
                  <label>Images</label>
                  {imagePreview.length > 0 && (
                    <div className="mb-2 d-flex flex-wrap gap-2">
                      {imagePreview.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Preview ${index}`}
                          style={{
                            borderRadius: "10px",
                            width: "150px",
                            height: "120px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    name="images"
                    className="form-control"
                    multiple
                    onChange={handleChange}
                    style={{ paddingLeft: "10px", border: "1px solid #ccc" }}
                  />
                  {errors.images && (
                    <small className="text-danger">{errors.images}</small>
                  )}
                </div>

                <div className="form-group mb-2">
                  <label>Category</label>
                  <select
                    name="category_id"
                    className="form-control"
                    value={data.category_id}
                    onChange={handleChange}
                    style={{ paddingLeft: "10px", border: "1px solid #ccc" }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <small className="text-danger">{errors.category_id}</small>
                  )}
                </div>

                {[
                  { label: "Product Name", name: "name" },
                  { label: "Hour Price", name: "hour", type: "number" },
                  { label: "Day Price", name: "day", type: "number" },
                  { label: "Week Price", name: "week", type: "number" },
                  {
                    label: "Security Deposit Price",
                    name: "secuirtyDeposit",
                    type: "number",
                  },
                  { label: "Variants", name: "variants" },
                  { label: "Description", name: "description" },
                ].map(({ label, name, type = "text" }) => (
                  <div className="form-group mb-2" key={name}>
                    <label>{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={data[name]}
                      onChange={handleChange}
                      style={{ paddingLeft: "10px", border: "1px solid #ccc" }}
                      className="form-control"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                    {errors[name] && (
                      <small className="text-danger">{errors[name]}</small>
                    )}
                  </div>
                ))}

                {errors.submit && (
                  <div className="text-danger mb-2">{errors.submit}</div>
                )}
              </div>

              <div className="mx-4 text-end pb-3">
                <button type="submit" className="btn btn-success me-2">
                  Add
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/subcategorylist")}
                >
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

export default ProductAdd;
