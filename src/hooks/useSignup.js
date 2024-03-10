/** @format */

// USING AXIOS.................
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    const success = handleInputErrors({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    });
    if (!success) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/auth/signup`,
        {
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
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

  return { loading, signup };
};

function handleInputErrors({
  fullName,
  username,
  password,
  confirmPassword,
  gender,
}) {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}

export default useSignup;

// WIHTOUT USING AXIOS =====================================

// // useSignup.js
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../context/AuthContext";

// const useSignup = () => {
//     const [loading, setLoading] = useState(false);
//     const {setAuthUser} = useAuthContext();
//     const signup = async({fullName, username, password, confirmPassword, gender}) =>{
//         const success = handleInputErrors({fullName, username, password, confirmPassword, gender});
//         if(!success) return;

//         setLoading(true);
//         try {
//             const res = await fetch(
//               `${import.meta.env.VITE_URL}/api/auth/signup`,
//               {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   fullName,
//                   username,
//                   password,
//                   confirmPassword,
//                   gender,
//                 }),
//               }
//             );
//             const data = await res.json();
//             if(data.error){
//                 throw new Error(data.error)
//             }
//             localStorage.setItem("chat-user",JSON.stringify(data))
//             setAuthUser(data)
//         } catch (error) {
//             toast.error(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {loading, signup};
// };

// function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
//     if (!fullName || !username || !password || !confirmPassword || !gender) {
//         toast.error("Please fill in all fields");
//         return false;
//     }

//     if (password !== confirmPassword) {
//         toast.error("Passwords do not match");
//         return false;
//     }

//     if (password.length < 6) {
//         toast.error("Password must be at least 6 characters");
//         return false;
//     }

//     return true;
// }

// export default useSignup;
