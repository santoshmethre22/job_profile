// import { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Custom axios instance with credentials
//   const api = axios.create({
//     withCredentials: true, // Ensures cookies are sent with requests
//   });

//   // Initialize auth state
//   // useEffect(() => {
//   //   const initializeAuth = async () => {
//   //     try {
//   //       const response = await api.get('/api/v1/user/get-user');
//   //       setUser(response.data.user);
//   //     } catch (error) {
//   //       console.error('Auth initialization error:', error);
//   //       setUser(null);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   initializeAuth();
//   // }, [login]);


//   // Register user
//   const register = async (formData) => {
//     try {
//       setLoading(true)
//       const response = await api.post('/api/v1/user/register', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       setUser(response.data.user);
//       navigate('/dashboard');
//       setLoading(false)
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;

//       setLoading(false)
//     }
//   };




// const login=async({email,username,password})=>{
//   try {
//     const response=await api.post("/api/user/v1/login",{email,password,username})
//     setUser(response.data.user)
//     navigate("/dashboard")
//     return response.data
    
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// }





//   // // Login user
//   // const login = async ({ email, username, password }) => {
//   //   try {
//   //     const response = await api.post('/api/v1/users/login', { email, username, password });
//   //     setUser(response.data.user);
//   //     navigate('/dashboard');
//   //     return response.data;
//   //   } catch (error) {
//   //     throw error.response?.data || error;
//   //   }
//   // };

//   // Logout user
//   // const logout = async () => {
//   //   try {
//   //     await api.post('/api/v1/user/logout');
//   //   } catch (error) {
//   //     console.error('Logout error:', error);
//   //   } finally {
//   //     setUser(null);
//   //     navigate('/login');
//   //   }
//   // };

//   // // Update user profile
//   // const updateProfile = async (updatedData) => {
//   //   try {
//   //     const response = await api.put('/api/v1/users/update-user', updatedData);
//   //     setUser(response.data.user);
//   //     return response.data;
//   //   } catch (error) {
//   //     throw error.response?.data || error;
//   //   }
//   // };

//   // // Get user by ID
//   // const getUserById = async (userId) => {
//   //   try {
//   //     const response = await api.get(`/api/v1/users/${userId}`);
//   //     return response.data;
//   //   } catch (error) {
//   //     throw error.response?.data || error;
//   //   }
//   // };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         register,
//         // login,
//         // logout,
//         // updateProfile,
//         // getUserById,
//         // api
//       }}
//     >
//       { children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {   
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    withCredentials: true,
  });

  const register = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/user/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(response.data.user);
      navigate('/dashboard');
      setLoading(false)
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, username, password }) => {
    try {
      setLoading(true);
      
      const response = await api.post("/api/v1/user/login", {
        email,
        username,
        password
      });
  
      // Ensure correct user data extraction
      setUser(response.data?.user); 
  
      navigate("/dashboard"); // Ensure navigation logic is as expected
  
      return response.data; // Return response after successful login
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false); // Only set once in `finally`
    }
  };
  

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      register ,
      login
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)
