/** @format */

// USING AXIOS...........
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/logout`,
        {},
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      const data = res.data;
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;


// WITHOUT USING AXIOS ==================================

// import { useState } from "react"
// import { useAuthContext } from "../context/AuthContext"
// import toast from "react-hot-toast"

// const useLogout = () => {
//   const [loading, setLoading] = useState(false)
//   const {setAuthUser} = useAuthContext()

//   const logout = async () =>{
//     setLoading(true)
//     try {
//         const res = await fetch(`${import.meta.env.VITE_URL}/api/auth/logout`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         });
//         const data = await res.json()
//         if(data.error){
//             throw new Error(data.error)
//         }
//         localStorage.removeItem("chat-user")
//         setAuthUser(null)
//     } catch (error) {
//         toast.error(error.message)
//     } finally{
//         setLoading(false)
//     }
//   }

//   return {loading, logout}
// }

// export default useLogout
