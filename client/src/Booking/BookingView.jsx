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
                  <h6 className="text-white text-capitalize">Booking Details</h6>
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
                          value={booking?.user?.name || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Category Name</label>
                        <input
                          type="text"
                          id="carName"
                          className="form-control"
                          value={booking?.products?.cat?.name || ""}
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
                          id="userName"
                          className="form-control"
                          value={booking?.products?.name || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>location</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          value={booking?.location || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Booking Date</label>
                        <input
                          type="text"
                          id="noOfBooking"
                          className="form-control"
                          value={booking?.bookingDate || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Return Date</label>
                        <input
                          type="text"
                          id="returnDate"
                          className="form-control"
                          value={booking?.returnDate || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group ">
                        <label>Price</label>
                        <input
                          type="text"
                          id="amount"
                          className="form-control"
                          value={`$${booking?.price || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group ">
                        <label>Payment</label>
                        <input
                          type="text"
                          id="paymentStatus"
                          className="form-control"
                          value={
                            booking?.paymentStatus == "0"
                              ? "Pending"
                              : booking?.paymentStatus == "1"
                              ? "Completed"
                              : ""
                          }
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>

                      <div className="form-group ">
                        <label>Status</label>
                        <input
                          type="text"
                          id="status"
                          className="form-control"
                          value={
                            booking?.status == "0"
                              ? "Ordered"
                              : booking?.status == "1"
                              ? "Received"
                              : booking?.status == "2"
                              ? "Returned"
                              : ""
                          }
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
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
