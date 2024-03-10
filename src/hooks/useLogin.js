/** @format */

// USING AXIOS.....................
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username, password) => {
    const success = handleInputErrors(username, password);
    if (!success) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      const data = res.data;
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}


// WITHOUT USING AXIOS =========================================

// import { useState } from "react"
// import toast from "react-hot-toast"
// import { useAuthContext } from "../context/AuthContext"

// const useLogin = () => {
//   const [loading, setLoading] = useState(false)
//   const {setAuthUser} = useAuthContext()

//   const login = async (username, password) =>{
//     const success = handleInputErrors(username, password);
// 	if (!success) return;

//     setLoading(true)
//     try {
//         const res = await fetch(`${import.meta.env.VITE_URL}/api/auth/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password }),
//         });
//         const data = await res.json()
//         if(data.error){
//             throw new Error(data.error)
//         }
//         localStorage.setItem('chat-user', JSON.stringify(data))
//         setAuthUser(data)
//     } catch (error) {
//         toast.error(error.message)
//     } finally{
//         setLoading(false)
//     }
//   }

//   return {loading, login}
// }

// export default useLogin

// function handleInputErrors(username, password) {
// 	if (!username || !password) {
// 		toast.error("Please fill in all fields");
// 		return false;
// 	}

// 	return true;
// }
