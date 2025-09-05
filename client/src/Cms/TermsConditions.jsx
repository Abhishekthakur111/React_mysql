import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../Config";

const TermsConditions = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const hasShownError = useRef(false);

  useEffect(() => {
    const fetchTermsConditions = async () => {
      try {
        const response = await axiosInstance.get(`/termsconditions`);
        const { data } = response.data;
        setTitle(data.title || "");
        setContent(data.content || "<p><br></p>");
        hasShownError.current = false; 
      } catch (error) {
        if (!hasShownError.current) {
          toast.error("Error fetching Terms & Conditions. Please try again.");
          hasShownError.current = true;
        }
      }
    };

    fetchTermsConditions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (content.trim() === "<p><br></p>") {
      setError("Terms & Conditions cannot be empty.");
      return;
    }

    setError("");
    setSubmitError("");

    try {
      await axiosInstance.post(`/termsconditions`, {
        title,
        content,
      });
      toast.success("Terms & Conditions updated successfully");
      navigate("/termsconditions");
    } catch (error) {
      setSubmitError("Error submitting Terms & Conditions. Please try again.");
      toast.error("Error submitting Terms & Conditions. Please try again.");
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
                    <h6 className="text-white text-capitalize">
                      Terms & Conditions
                    </h6>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-4">
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        id="title"
                        type="text"
                        className="form-control"
                        value={title}
                        readOnly
                        style={{
                          paddingLeft: "10px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="content">Content</label>
                      <div style={{ position: "relative" }}>
                        <ReactQuill
                          id="content"
                          style={{
                            height: "400px",
                            marginBottom: "50px",
                            color: "black",
                          }}
                          theme="snow"
                          value={content}
                          onChange={setContent}
                          modules={{
                            toolbar: [
                              [{ header: "1" }, { header: "2" }, { font: [] }],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["bold", "italic", "underline"],
                              [{ color: [] }, { background: [] }],
                              [{ align: [] }],
                              ["clean"],
                            ],
                          }}
                        />
                        {content.trim() === "<p><br></p>" && (
                          <div
                            style={{
                              position: "absolute",
                              top: 55,
                              left: 18,
                              right: 0,
                              bottom: 0,
                              pointerEvents: "none",
                              color: "red",
                              fontStyle: "italic",
                            }}
                          >
                            Terms & Conditions cannot be empty.
                          </div>
                        )}
                      </div>
                      {error && <p className="text-danger">{error}</p>}
                      {submitError && (
                        <p className="text-danger">{submitError}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn"
                      style={{
                        backgroundColor: "#788000",
                        color: "white",
                        marginTop: "20px",
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
