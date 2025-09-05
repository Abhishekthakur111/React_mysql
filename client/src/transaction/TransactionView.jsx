import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../Config";

const TransactionView = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/transactiondetail/${id}`);
        console.log("transactiondetail", response);
        if (response.data.success) {
          setTransaction(response.data.body);
        } else {
          setError("Failed to fetch transaction data.");
        }
      } catch (err) {
        setError("Error fetching transaction data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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
                    Transaction Details
                  </h6>
                </div>
              </div>
            </div>
            <div className="section-body">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="form-group mb-2">
                        <label>Customer Name</label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          value={transaction?.userr?.name || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Lender Name</label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          value={transaction?.lenderr?.name || ""}
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
                          value={transaction?.booking?.productss?.name || ""}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Total Amount</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          value={`$${transaction?.totalAmount || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Admin Fee</label>
                        <input
                          type="text"
                          id="noOfBooking"
                          className="form-control"
                          value={
                            transaction
                              ? `$${(
                                  transaction.adminAmount *
                                  (transaction.adminComission / 100)
                                ).toFixed(2)} (${transaction.adminComission}%)`
                              : ""
                          }
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>

                      <div className="form-group mb-2">
                        <label>Stripe Charge</label>
                        <input
                          type="text"
                          id="returnDate"
                          className="form-control"
                          value={`$${transaction?.stripeCharge || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Lender Amount</label>
                        <input
                          type="text"
                          id="returnDate"
                          className="form-control"
                          value={`$${transaction?.lenderAmount || ""}`}
                          readOnly
                          style={{
                            paddingLeft: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                      <div className="form-group mb-2">
                        <label>Transaction ID</label>
                        <input
                          type="text"
                          id="userName"
                          className="form-control"
                          value={transaction?.trasaction_id || ""}
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
                            transaction?.paymentStatus == "0"
                              ? "Pending"
                              : transaction?.paymentStatus == "1"
                              ? "Success"
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
                        <label>Payment Method</label>
                        <input
                          type="text"
                          id="status"
                          className="form-control"
                          value={
                            transaction?.paymentMethod == "1"
                              ? "Online"
                              : transaction?.paymentMethod == "2"
                              ? "Offile"
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
                        onClick={() => navigate("/transactionlist")}
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

export default TransactionView;
