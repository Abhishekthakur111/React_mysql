import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../Config";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusOptions] = useState([
    { value: "0", label: "Pending" },
    { value: "1", label: "Ongoing" },
    { value: "2", label: "Completed" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/bookinglist?page=${currentPage}&limit=${limit}`
      );
      if (response.data.success) {
        setBookings(response.data.body.data);
        setTotalPages(response.data.body.totalPages);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to load bookings",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
        "An error occurred while fetching the booking list",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.booking_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteUser = async (id) => {
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
        await axiosInstance.delete(`/bookingdelete/${id}`);
        const updatedBookings = bookings.filter((booking) => booking.id !== id);
        setBookings(updatedBookings);
        if (updatedBookings.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        Swal.fire("Deleted!", "Booking has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting Booking",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "Booking deletion has been cancelled", "info");
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await axiosInstance.post(`/updatebookingstatus`, {
        id: bookingId,
        status: newStatus,
      });
      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchData(currentPage);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update status",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
        "An error occurred while updating the status",
        "error"
      );
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
                    <h6 className="text-white text-capitalize">Bookings</h6>
                  </div>
                </div>
              </div>
              <div className="section-body">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-end">
                      <div className="">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by booking code..."
                          value={searchTerm}
                          onChange={handleSearch}
                          style={{
                            backgroundColor: "#fd7a7f",
                            paddingLeft: "10px",
                          }}
                        />
                      </div>
                    </div>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table text-center">
                          <thead>
                            <tr>
                              <th>Sr_No.</th>
                              <th>Customer</th>
                              <th>Category</th>
                              <th>Sub Category</th>
                              <th>Booking Code</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredBookings.length ? (
                              filteredBookings.map((booking, index) => (
                                <tr key={booking.id}>
                                  <td>
                                    {(currentPage - 1) * limit + index + 1}
                                  </td>
                                  <td>{booking.user?.name || "no name"}</td>
                                  <td>
                                    {booking.category?.name || "no category"}
                                  </td>
                                  <td>
                                    {booking.subCategory?.name ||
                                      "no sub category"}
                                  </td>
                                  <td>
                                    {booking.booking_code || "no booking code"}
                                  </td>
                                  <td>${booking.amount || "no amount"}</td>
                                  <td>
                                    <select
                                      value={booking.status}
                                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                      className="form-select text-black"
                                      style={{
                                        backgroundColor:
                                          booking.status === "0"
                                            ? "#ff3333"
                                            : booking.status === "1"
                                              ? "#ffff80"
                                              : "#5cd65c",
                                        paddingLeft: "10px",
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
                                      to={`/bookingDetail/${booking.id}`}
                                      className="has-icon btn btn-success m-1"
                                      style={{
                                        backgroundColor: "#ff8080",
                                        color: "white",
                                      }}
                                    >
                                      <i className="me-100 fas fa-eye" />
                                    </Link>
                                    <button
                                      onClick={() => deleteUser(booking.id)}
                                      className="has-icon btn m-1"
                                      style={{
                                        backgroundColor: "#ff8080",
                                        borderColor: "#ff8080",
                                        color: "#fff",
                                      }}
                                    >
                                      <i className="me-100 fas fa-trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8">No bookings found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <Stack
                      spacing={2}
                      className="d-flex justify-content-center mt-3"
                    >
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}

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

export default BookingList;
