import axios from "axios";
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 

// Create Context
const JobContext = createContext();

// Provider Component
export const JobProvider = ({ children }) => {
  const [job, setJob] = useState(null);
  const [added,setadded]=useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Corrected navigation

  const api = axios.create({
    withCredentials: true,
  });



  const addJob = async (jobData) => {
    setLoading(true);
    try {
      const response = await api.post("/api/v1/job/add-job", jobData);

      setJob(response.data);


      setLoading(false);
      setadded(response.data)
      navigate("/dashboard"); // Corrected navigation
    } catch (error) {
      setLoading(false);
      throw error.response?.data || error;
    }
  };


  //----------------------------->
  const addedjobs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/job/added-jobs");
      setadded(response.data); // Ensure response is set directly
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching jobs:", error);
    }
  };
  
  return (
    <JobContext.Provider value={{
       job, 
       setJob, 
       addJob, 
       loading ,
       added,
       addedjobs

       }}>
      {children}
    </JobContext.Provider>
  );
};

// Custom Hook to Use Context
export const useJob = () => useContext(JobContext);
