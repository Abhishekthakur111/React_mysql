import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../Config";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const [isSearching, setIsSearching] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const statusOptions = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Success" },
  ];

  const getBackgroundColor = (status) => {
    switch (status?.toString()) {
      case "0":
        return "#ea5455";
      case "1":
        return "#99f899";
      default:
        return "#ffffff";
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); 
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);


  useEffect(() => {
    fetchTransactions(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const fetchTransactions = async (page, search = "") => {
    if (transactions.length === 0) {
      setLoading(true); 
    } else {
      setIsSearching(true);
    }

    try {
      const response = await axiosInstance.get(
        `/transactionlist?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`
      );
      if (response.data.success) {
        setTransactions(response.data.body.data);
        setTotalPages(response.data.body.totalPages);
      } else {
        Swal.fire("Error", response.data.message || "Failed to load data", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Error fetching transaction list",
        "error"
      );
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const deleteTransaction = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff8080",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/transactiondelete/${id}`);
        fetchTransactions(currentPage, debouncedSearch);
        Swal.fire("Deleted!", "Transaction has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting transaction",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "Transaction deletion cancelled", "info");
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
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-2">
                  <div className="d-flex justify-content-between align-items-center px-3 pt-1">
                    <h6 className="text-white text-capitalize">Transactions</h6>
                  </div>
                </div>
              </div>
              <div className="section-body">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-end mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by customer, lender, or product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: "250px",
                          border: "1px solid #ccc",
                          paddingLeft: "10px",
                        }}
                      />
                    </div>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <div className="table-responsive position-relative">
                        {isSearching && (
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              left: "0",
                              right: "0",
                              bottom: "0",
                              background: "rgba(255,255,255,0.6)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            Updating results...
                          </div>
                        )}

                        <table className="table text-center">
                          <thead>
                            <tr>
                              <th>Sr. No</th>
                              <th>Customer</th>
                              <th>Lender</th>
                              <th>Product</th>
                              <th>Total Amount</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.length > 0 ? (
                              transactions.map((tx, index) => (
                                <tr key={tx.id}>
                                  <td>{(currentPage - 1) * limit + index + 1}</td>
                                  <td>{tx?.userr?.name || ""}</td>
                                  <td>{tx?.lenderr?.name || ""}</td>
                                  <td>{tx?.booking?.productss?.name || ""}</td>
                                  <td>${tx?.totalAmount || "0"}</td>
                                  <td>
                                    <select
                                      value={tx?.paymentStatus}
                                      disabled
                                      className="form-select text-black"
                                      style={{
                                        backgroundColor: getBackgroundColor(tx?.paymentStatus),
                                        textAlign: "center",
                                        textAlignLast: "center",
                                      }}
                                    >
                                      {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/transactiondetail/${tx.id}`}
                                      className="btn btn-success m-1"
                                      style={{ backgroundColor: "#788000", color: "white" }}
                                      title="View Details"
                                    >
                                      <i className="fas fa-eye" />
                                    </Link>
                                    <button
                                      onClick={() => deleteTransaction(tx.id)}
                                      className="btn m-1"
                                      style={{
                                        backgroundColor: "#ea5455",
                                        borderColor: "#ea5455",
                                        color: "#fff",
                                      }}
                                      title="Delete"
                                    >
                                      <i className="fas fa-trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center text-muted">
                                  No transactions found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <Stack spacing={2} className="d-flex justify-content-center mt-3">
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                      />
                    </Stack>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionList;
