import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import "./styles/AdminDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

// Utility function for authenticated API requests
const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token, // Token already includes Bearer prefix
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; // Force redirect to login
      throw new Error('Unauthorized - Session expired');
    }
    throw new Error(`Request failed with status: ${response.status}`);
  }
  
  return response;
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeAppointments, setActiveAppointments] = useState(0);
  const [canceledAppointments, setCanceledAppointments] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get client data from location state or localStorage
  const clientId = location.state?.clientId || localStorage.getItem('clientId');
  const clientName = location.state?.clientName || localStorage.getItem('clientName');

  // Save client data to localStorage for persistence
  useEffect(() => {
    if (location.state?.clientId) {
      localStorage.setItem('clientId', location.state.clientId);
    }
    if (location.state?.clientName) {
      localStorage.setItem('clientName', location.state.clientName);
    }
  }, [location.state]);

  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Navigation handlers
  const handleDashboard = () => {
    navigate("/admin-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clientId');
    localStorage.removeItem('clientName');
    navigate("/logout");
  };

  const handleAddNewAppointment = () => {
    navigate("/add-new-appointment", { state: { clientId, clientName } });
  };

  const handleViewPOC = () => {
    navigate("/view-poc", { state: { clientId, clientName } });
  };

  const handleUpdateAvailability = () => {
    navigate("/update-availability", { state: { clientId, clientName } });
  };

  const handleAddPOC = () => {
    navigate("/add-poc", { state: { clientId, clientName } });
  };

  const handleDoctorsList = () => {
    navigate("/doctors", { state: { clientId, clientName } });
  };

  const handleUsersList = () => {
    navigate("/users", { state: { clientId, clientName } });
  };

  const handleViewAppointmentDetails = (status) => {
    navigate("/appointment-details-admin", { state: { clientId, status } });
  };

  const handleViewDepartments = () => {
    navigate("/departments", { state: { clientId } });
  };

  const handleUpdateVisited = () => {
    navigate("/admin-todays-appointments", { state: { clientId, clientName } });
  };

  const handleContactSupport = () => {
    navigate("/contact-support", { state: { clientId, clientName } });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!clientId) {
        setError("Client ID not found. Please login again.");
        return;
      }

      setLoading(true);
      try {
        // Fetch appointment counts
        const fetchAppointmentCount = async (status) => {
          try {
            const response = await authenticatedFetch('http://localhost:5000/api/admin/appointment-count', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ clientId, status }),
            });
            
            const data = await response.json();
            return data.count || 0;
          } catch (error) {
            console.error(`Error fetching ${status} appointments:`, error);
            throw error;
          }
        };

        // Fetch departments and doctors count
        const fetchTotalDepartmentsAndDoctors = async () => {
          try {
            const response = await authenticatedFetch('http://localhost:5000/api/admin/total-departments-doctors', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ clientId }),
            });
            
            const data = await response.json();
            return {
              totalDepartments: data.totalDepartments || 0,
              totalDoctors: data.totalDoctors || 0
            };
          } catch (error) {
            console.error("Error fetching departments and doctors:", error);
            throw error;
          }
        };

        // Execute all fetches in parallel
        const [confirmedCount, cancelledCount, countData] = await Promise.all([
          fetchAppointmentCount('Confirmed'),
          fetchAppointmentCount('Cancelled'),
          fetchTotalDepartmentsAndDoctors()
        ]);

        setActiveAppointments(confirmedCount);
        setCanceledAppointments(cancelledCount);
        setTotalDepartments(countData.totalDepartments);
        setTotalDoctors(countData.totalDoctors);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Handle clicks outside sidebar
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current && 
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clientId]);

  return (
    <div className="admin-dashboard">
      <div className="d-flex">
        {/* Sidebar */}
        <div
          className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}
          ref={sidebarRef}
        >
          <div className="sidebar-header mb-4">
            <h4>{clientName || 'Admin'} ADMIN</h4>
          </div>
          <ul className="list-unstyled">
            <li className="mb-3">
              <button className="link-button" onClick={handleDashboard}>
                Dashboard
              </button>
            </li>
            <li className="mb-3">
              <button className="link-button" onClick={handleUpdateVisited}>
                Today's Appointments
              </button>
            </li>
            <li className="mb-3">
              <button className="link-button" onClick={handleDoctorsList}>
                Doctors
              </button>
            </li>
            <li className="mb-3">
              <button className="link-button" onClick={handleUsersList}>
                Users
              </button>
            </li>
            <li>
              <button className="link-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={`main-content ${isSidebarOpen ? "" : "full-width"}`}>
          <header className="bg-light d-flex justify-content-between align-items-center p-3 shadow-sm">
            <button
              className="btn btn-primary"
              onClick={toggleSidebar}
              ref={toggleButtonRef}
            >
              <FaBars />
            </button>
            <div className="d-flex align-items-center">
              {/* User Icon with Dropdown */}
              <div className="position-relative">
                <FaUserCircle
                  size={50}
                  className="text-secondary"
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer" }}
                />
                {isDropdownOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </header>

          <main className="p-4">
            <h1>Welcome, Admin</h1>
            <p>Use the navigation to manage the hospital system.</p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading dashboard data...</p>
              </div>
            ) : (
              <>
                {/* Dashboard Widgets - Each in an individual row */}
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="widget card" onClick={() => handleViewAppointmentDetails('Confirmed')}>
                      <h4>Total Appointments</h4>
                      <p className="h3">{activeAppointments}</p>
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <div className="widget card" onClick={handleViewDepartments}>
                      <h4>Total Departments</h4>
                      <p className="h3">{totalDepartments}</p>
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <div className="widget card" onClick={handleDoctorsList}>
                      <h4>Total Doctors</h4>
                      <p className="h3">{totalDoctors}</p>
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <div className="widget card" onClick={() => handleViewAppointmentDetails('Cancelled')}>
                      <h4>Cancelled Appointments</h4>
                      <p className="h3">{canceledAppointments}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="widget p-3 bg-info text-white rounded shadow-sm">
                      <button
                        className="btn btn-light w-100"
                        onClick={handleAddNewAppointment}
                      >
                        Add New Appointment
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="widget p-3 bg-success text-white rounded shadow-sm">
                      <button
                        className="btn btn-light w-100"
                        onClick={handleAddPOC}
                      >
                        Add POC
                      </button>
                    </div>
                  </div>
                </div>

                {/* New Buttons */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="widget p-3 bg-warning text-white rounded shadow-sm">
                      <button
                        className="btn btn-light w-100"
                        onClick={handleViewPOC}
                      >
                        View POC
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="widget p-3 bg-primary text-white rounded shadow-sm">
                      <button
                        className="btn btn-light w-100"
                        onClick={handleUpdateAvailability}
                      >
                        Update Availability
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Support Button */}
                <div className="text-center">
                  <p>If you need assistance, feel free to reach out to our support team.</p>
                  <button
                    className="btn btn-danger w-50"
                    onClick={handleContactSupport}
                  >
                    Contact Support
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;