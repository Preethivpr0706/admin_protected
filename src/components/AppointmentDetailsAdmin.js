import React, { useState, useEffect } from "react";  
import { useLocation, useNavigate } from "react-router-dom";  
import "./styles/AppointmentDetails.css";  
 
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

const AppointmentDetailsAdmin = () => {  
  const location = useLocation();  
  const clientId = location.state.clientId;  
  const status = location.state.status;  
  const [appointments, setAppointments] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const navigate = useNavigate();  
  
  useEffect(() => {  
   // Set the background color when the component is mounted  
   document.body.style.backgroundColor = " #80bdff";  
  
   // Cleanup when the component is unmounted or navigation happens  
   return () => {  
    document.body.style.backgroundColor = "";  
   };  
  }, []);  
  
  useEffect(() => {  
   const fetchAppointments = async () => {  
    try {  
      const response = await authenticatedFetch("/api/admin/appointment-details", {  
       method: "POST",  
       headers: { "Content-Type": "application/json" },  
       body: JSON.stringify({ clientId, status }),  
      });  
  
      if (response.ok) {  
       const data = await response.json();  
       setAppointments(data);  
      } else {  
       throw new Error("Failed to fetch appointments");  
      }  
    } catch (err) {  
      setError(err.message);  
    } finally {  
      setLoading(false);  
    }  
   };  
  
   fetchAppointments();  
  }, [clientId, status]);  
  
  
  
  return (  
    
    <div className="appointment-details-container">  
      <h1 className="appointment-details-heading">Appointment Details</h1>  
  
      {loading ? (  
       <p className="appointment-details-loading">Loading...</p>  
      ) : error ? (  
       <p className="appointment-details-error">{error}</p>  
      ) : (  
       <div className="appointment-details-table-container">  
        <table className="appointment-details-table">  
          <thead>  
           <tr>  
            <th>S.No</th>  
            <th>User Name</th>  
            <th>Contact</th>  
            <th>Location</th>  
            <th>POC Name</th>  
            <th>Specialization</th>  
            <th>Appointment Type</th>  
            <th>Appointment Date</th>  
            <th>Appointment Time</th> 
            <th>Payment Status</th> 
           </tr>  
          </thead>  
          <tbody>  
           {appointments.length > 0 ? (  
            appointments.map((appt, index) => (  
              <tr key={index}>  
               <td>{index + 1}</td>  
               <td>{appt.UserName}</td>  
               <td>{appt.UserContact}</td>  
               <td>{appt.UserLocation}</td>  
               <td>{appt.POCName}</td>  
               <td>{appt.Specialization}</td>  
               <td>{appt.AppointmentType}</td>  
               <td>{appt.AppointmentDate}</td>  
               <td>{appt.AppointmentTime}</td> 
               <td className={appt.Payment_Status === 'Paid' ? 'payment-status-paid' : 'payment-status-unpaid'}>{appt.Payment_Status}</td>
              </tr>  
            ))  
           ) : (  
            <tr>  
              <td colSpan="10">No appointments found</td>  
            </tr>  
           )}  
          </tbody>  
        </table>  
       </div>  
      )}  
    </div>  
   
  );  
};  
  
export default AppointmentDetailsAdmin;
