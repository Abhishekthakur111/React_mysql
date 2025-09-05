import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance, BASE_URL } from "../Config";

const RatingDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/ratingdetail/${id}`);
        if (response.data.success) {
          setData(response.data.body);
        } else {
          setError("Failed to fetch rating data.");
        }
      } catch (err) {
        setError("Error fetching rating data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
                  <h6 className="text-white text-capitalize">Rating Details</h6>
                </div>
              </div>
            </div>
            <div className="section-body">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="form-group mb-2 ">
                        <label>Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={data?.ratingby?.name || ""}
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
                          value={data?.ratingbooking?.ratingproduct?.name || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Rating</label>
                        <input
                          type="text"
                          className="form-control"
                          value={`${data?.rating ?? ""} / 5`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Reviews</label>
                        <textarea
                          className="form-control"
                          value={data?.review || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                            resize: "vertical",
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-end mx-4">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate("/ratinglist")}
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

export default RatingDetail;
