import React, { useState, useEffect } from "react";  
import { useLocation, useNavigate } from "react-router-dom";  
import "./styles/DepartmentList.css";  
  
const DepartmentList = () => {  
  const location = useLocation();  
  const clientId = location.state.clientId;  
  const [departments, setDepartments] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const navigate = useNavigate();  

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
  
  useEffect(() => {  
   // Set the background color when the component is mounted  
   document.body.style.backgroundColor = " #80bdff";  
  
   // Cleanup when the component is unmounted or navigation happens  
   return () => {  
    document.body.style.backgroundColor = "";  
   };  
  }, []);  
  
  useEffect(() => {  
   const fetchDepartments = async () => {  
    try {  
      const response = await authenticatedFetch("/api/admin/departments", {  
       method: "POST",  
       headers: { "Content-Type": "application/json" },  
       body: JSON.stringify({ clientId }),  
      });  
  
      if (response.ok) {  
       const data = await response.json();  
       setDepartments(data);  
      } else {  
       throw new Error("Failed to fetch departments");  
      }  
    } catch (err) {  
      setError(err.message);  
    } finally {  
      setLoading(false);  
    }  
   };  
  
   fetchDepartments();  
  }, [clientId]);  

  return (  

    <div className="department-list-container">  
      <h1 className="department-list-heading">Department List</h1>  
  
      {loading ? (  
       <p className="department-list-loading">Loading...</p>  
      ) : error ? (  
       <p className="department-list-error">{error}</p>  
      ) : (  
       <div className="department-list-table-container">  
        <table className="department-list-table">  
          <thead>  
           <tr>  
            <th>S.No</th>  
            <th>Department Name</th>  
            <th>No. of POCs</th>  
           </tr>  
          </thead>  
          <tbody>  
           {departments.length > 0 ? (  
            departments.map((dept, index) => (  
              <tr key={index}>  
               <td>{index + 1}</td>  
               <td>{dept.DepartmentName}</td>  
               <td>{dept.NoOfPOCs}</td>  
              </tr>  
            ))  
           ) : (  
            <tr>  
              <td colSpan="3">No departments found</td>  
            </tr>  
           )}  
          </tbody>  
        </table>  
       </div>  
      )}  
    </div>  

  );  
};  
  
export default DepartmentList;
