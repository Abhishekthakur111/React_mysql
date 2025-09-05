import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser, toggleUserStatus } from "../redux/LenderSlice";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Config";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const LenderList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();
  const { users = [], totalPages = 1 } = useSelector((state) => state.users);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit, search: debouncedSearch }));
  }, [dispatch, currentPage, debouncedSearch]);
  useEffect(() => {
  console.log("📦 Users from Redux store:", users);
  console.log("📄 Total Pages:", totalPages);
}, [users, totalPages]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const deleteUserHandler = async (id) => {
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
        await dispatch(deleteUser(id)).unwrap();
        Swal.fire("Deleted!", "Lender has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting Lender",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "Lender deletion has been cancelled", "info");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    dispatch(toggleUserStatus({ id, currentStatus }));
    toast.success("Status updated successfully");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-2">
                  <div className="d-flex justify-content-between align-items-center px-3 pt-1">
                    <h6 className="text-white text-capitalize">Lenders</h6>
                  </div>
                </div>
              </div>
              <div className="section-body">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-end">
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          style={{ border: "1px solid #ccc", paddingLeft: "10px" }}
                        />
                      </div>
                    </div>
                    <div className="table-responsive mt-3">
                      <table className="table text-center">
                        <thead>
                          <tr>
                            <th>Sr_No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length > 0 ? (
                            users.map((user, index) => (
                              <tr key={user.id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>
                                  {user.image ? (
                                    <img
                                      src={`${BASE_URL}/${user.image}`}
                                      alt="User"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  ) : (
                                    "No Image"
                                  )}
                                </td>
                                <td>{user.name || ""}</td>
                                <td>{user.email || ""}</td>
                                <td>{user.location || ""}</td>
                                <td>
                                  <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`toggleStatus${user.id}`}
                                      checked={user.status === "1"}
                                      onChange={() => toggleStatus(user.id, user.status)}
                                      style={{
                                        backgroundColor:
                                          user.status === "1" ? "#788000" : "lightgray",
                                        borderColor:
                                          user.status === "1" ? "#788000" : "lightgray",
                                      }}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <Link
                                    to={`/lenderdetail/${user.id}`}
                                    className="btn btn-success m-1"
                                    style={{
                                      backgroundColor: "#788000",
                                      color: "white",
                                    }}
                                    title="View Lender Details"
                                  >
                                    <i className="fas fa-eye" />
                                  </Link>
                                  <button
                                    onClick={() => deleteUserHandler(user.id)}
                                    className="btn m-1"
                                    style={{
                                      backgroundColor: "#ea5455",
                                      borderColor: "#ea5455",
                                      color: "#fff",
                                    }}
                                    title="Delete User"
                                  >
                                    <i className="fas fa-trash" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                No users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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

export default LenderList;
