import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance, BASE_URL } from "../Config";

const ProductView = () => {
  const { id } = useParams();
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await axiosInstance.get(`/productdetail/${id}`);
        if (response.data.success) {
          setService(response.data.body.data);
        } else {
          setError("Failed to fetch product data.");
        }
      } catch (err) {
        setError("Error fetching product data.");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-12">
          <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-2">
                <div className="d-flex justify-content-between align-items-center px-3 pt-1">
                  <h6 className="text-white text-capitalize">
                    Product Details
                  </h6>
                </div>
              </div>
            </div>
            <div className="section-body">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="form-group mx-auto">
                        {service.images && service.images.length > 0 ? (
                          <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
                            {service.images.map((img, index) => (
                              <img
                                key={img.id || index}
                                src={`${BASE_URL}/${img.image}`}
                                alt={`Product Image ${index + 1}`}
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                  borderRadius: "20%",
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <p>No images available</p>
                        )}
                      </div>
                      <div className="form-group mb-2">
                        <label>Lender</label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          value={service?.lender?.name || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Category</label>
                        <input
                          type="text"
                          id="category"
                          className="form-control"
                          value={service?.category?.name || "Unknown"}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Product Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          value={service?.name || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Hour Price</label>
                        <input
                          type="text"
                          id="hour"
                          className="form-control"
                          value={`$${service?.hour || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Day Price</label>
                        <input
                          type="text"
                          id="day"
                          className="form-control"
                          value={`$${service?.day || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Week Price</label>
                        <input
                          type="text"
                          id="week"
                          className="form-control"
                          value={`$${service?.week || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Secuirty Deposit</label>
                        <input
                          type="text"
                          id="secuirtyDeposit"
                          className="form-control"
                          value={`$${service?.secuirtyDeposit || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Variants</label>
                        <input
                          type="text"
                          id="variants"
                          className="form-control"
                          value={`${service?.variants || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Availablity</label>
                        <input
                          type="text"
                          id="available"
                          className="form-control"
                          value={
                            service?.available == "1"
                              ? "Available"
                              : "Unavailable"
                          }
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Description</label>
                        <textarea
                          id="description"
                          className="form-control"
                          value={service?.description || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                            resize: "none",
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-end mx-4 ">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate("/productlist")}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
