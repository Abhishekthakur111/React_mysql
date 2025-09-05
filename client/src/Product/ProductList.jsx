import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { axiosInstance, BASE_URL } from "../Config";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const ProductList = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchData = async (page, search = "") => {
    try {
      const response = await axiosInstance.get(
        `/productlist?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      if (response.data.success) {
        setServices(response.data.body.data);
        setTotalPages(response.data.body.totalPages);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to load product list",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "An error occurred while fetching product list",
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

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "0" ? "1" : "0";

    try {
      const response = await axiosInstance.post(`/productstatus`, {
        id,
        status: newStatus,
      });

      if (response.data.success) {
        fetchData(currentPage, searchTerm);
        toast.success("Status updated successfully");
      } else {
        toast.error(response.data.message || "Failed to change status");
      }
    } catch (error) {
      toast.error("An error occurred while changing product status");
    }
  };

  const deleteService = async (id) => {
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
        await axiosInstance.post(`/productdelete/${id}`);
        fetchData(currentPage, searchTerm);
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting product",
          "error"
        );
      }
    } else {
      Swal.fire(
        "Cancelled",
        "Product deletion has been cancelled",
        "info"
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="container-fluid ">
        <div className="row">
          <div className="col-12">
            <div className="card my-3">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 ">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-1">
                  <div className="d-flex justify-content-between align-items-center px-3 pt-1">
                    <h6 className="text-white text-capitalize ">Products </h6>
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
                        placeholder="Search by name, category, or lender..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{
                          width: "250px",
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
                            <th>Lender</th>
                            <th>Category Name</th>
                            <th>Product Name</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.length > 0 ? (
                            services.map((service, index) => (
                              <tr key={service.id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>
                                  {service?.lender?.name
                                    ? service.lender.name
                                    : ""}
                                </td>
                                <td>
                                  {service?.category?.name
                                    ? service?.category.name
                                    : ""}
                                </td>
                                <td>{service?.name || ""}</td>
                                <td>
                                  <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`statusSwitch-${service.id}`}
                                      checked={service.status === "0"}
                                      onChange={() =>
                                        toggleStatus(service.id, service.status)
                                      }
                                      style={{
                                        backgroundColor:
                                          service.status === "0"
                                            ? "#788000"
                                            : "lightgray",
                                        borderColor:
                                          service.status === "0"
                                            ? "#788000"
                                            : "lightgray",
                                      }}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <Link
                                    to={`/productdetail/${service.id}`}
                                    className="has-icon btn btn-success m-1"
                                    style={{
                                      backgroundColor: "#788000",
                                      color: "white",
                                    }}
                                    title="View Product Details"
                                  >
                                    <i className="me-100 fas fa-eye" />
                                  </Link>
                                  <button
                                    onClick={() => deleteService(service.id)}
                                    className="has-icon btn  m-1 "
                                    style={{
                                      backgroundColor: "#ea5455",
                                      borderColor: "#ea5455",
                                      color: "#fff",
                                    }}
                                    title="Delete Product"
                                  >
                                    <i className="me-100 fas fa-trash" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                No products found
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

export default ProductList;