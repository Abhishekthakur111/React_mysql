import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../Config";

const BookingView = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/bookingdetail/${id}`);
        if (response.data.success) {
          setBooking(response.data.body.data);
        } else {
          setError("Failed to fetch booking data.");
        }
      } catch (err) {
        setError("Error fetching booking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
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
                  <h6 className="text-white text-capitalize">Booking Detail</h6>
                </div>
              </div>
            </div>
            <div className="section-body">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="form-group mb-2">
                        <label>Customer</label>
                        <input
                          type="text"
                          id="userName"
                          className="form-control"
                          value={booking.user?.name || "Unknown"}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            backgroundColor: "#ff8080",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Category </label>
                        <input
                          type="text"
                          id="carName"
                          className="form-control"
                          value={booking.category?.name || "Unknown"}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            backgroundColor: "#ff8080",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Sub Category</label>
                        <input
                          type="text"
                          id="serviceName"
                          className="form-control"
                          value={booking.subCategory?.name || "Unknown"}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            backgroundColor: "#ff8080",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Booking Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="bookingCode"
                          value={booking.booking_code || "N/A"}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            backgroundColor: "#ff8080",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>No of Booking</label>
                        <input
                          type="text"
                          id="noOfBooking"
                          className="form-control"
                          value={booking.no_of_booking || "N/A"}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            backgroundColor: "#ff8080",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Location</label>
                        <input
                          type="text"
                          id="location"
                          className="form-control"
                          value={booking.location || "N/A"}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            backgroundColor: "#ff8080",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Description</label>
                        <textarea
                          id="description"
                          className="form-control"
                          value={booking.description || "N/A"}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            backgroundColor: "#ff8080",
                          }}
                        />
                      </div>
                      <div className="form-group ">
                        <label>Amount</label>
                        <input
                          type="text"
                          id="amount"
                          className="form-control"
                          value={`$${booking.amount || "N/A"}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            backgroundColor: "#ff8080",
                          }}
                        />
                      </div>
                    </div>

                    <div className="mx-4 d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate("/bookinglist")}
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

export default BookingView;
