import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import { axiosInstance } from "../Config";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const RatingList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchData = async (page, search = "") => {
    try {
      const response = await axiosInstance.get(
        `/ratinglist?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      if (response.data.success) {
        setCategories(response.data.body.data);
        setTotalPages(response.data.body.totalPages);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to load categories",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "An error occurred while fetching the category list",
        "error"
      );
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#788000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/ratingdelete/${id}`);
        fetchData(currentPage, searchTerm); 
        Swal.fire("Deleted!", "Rating has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting Rating",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "Rating deletion has been cancelled", "info");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-2">
                  <div className="d-flex justify-content-between align-items-center px-3 pt-1">
                    <h6 className="text-white text-capitalize">Ratings</h6>
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
                        placeholder="Search by name or product..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{
                          width: "200px",
                          border: "1px solid #ccc",
                          paddingLeft: "10px",
                        }}
                      />
                    </div>
                    <div className="table-responsive">
                      <table className="table text-center">
                        <thead>
                          <tr>
                            <th>Sr_No.</th>
                            <th>Ratedby</th>
                            <th>Product Name</th>
                            <th>Rating</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.length > 0 ? (
                            categories.map((rating, index) => (
                              <tr key={rating.id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>{rating?.ratingby?.name || ""}</td>
                                <td>
                                  {rating?.ratingbooking?.ratingproduct?.name ||
                                    ""}
                                </td>
                                <td>
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          color: "#f5c518",
                                          fontSize: "20px",
                                        }}
                                      >
                                        {i < (rating.rating || 0) ? "★" : "☆"}
                                      </span>
                                    ))}
                                </td>

                                <td>
                                  <Link
                                    to={`/ratingdetail/${rating.id}`}
                                    className="btn btn-success m-1"
                                    style={{
                                      backgroundColor: "#788000",
                                      color: "white",
                                    }}
                                    title="View Rating Details"
                                  >
                                    <i className="fas fa-eye" />
                                  </Link>

                                  <button
                                    onClick={() => deleteCategory(rating.id)}
                                    className="btn m-1"
                                    style={{
                                      backgroundColor: "#ea5455",
                                      borderColor: "#ea5455",
                                      color: "#fff",
                                    }}
                                    title="Delete Rating"
                                  >
                                    <i className="fas fa-trash" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center text-muted">
                                No ratings found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <Stack
                      spacing={2}
                      className="d-flex justify-content-center mt-3"
                    >
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

export default RatingList;