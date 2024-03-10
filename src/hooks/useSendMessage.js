/** @format */

//USING AXIOS.............
import { useState } from "react";
import axios from "axios";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const res = await axios.post(
				`${import.meta.env.VITE_URL}/api/message/send/${selectedConversation._id}`,
				{ message },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			const data = res.data;
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;


// WITHOUT USING AXIOS==================================

// import { useState } from "react";
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";

// const useSendMessage = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { messages, setMessages, selectedConversation } = useConversation();

// 	const sendMessage = async (message) => {
// 		setLoading(true);
// 		try {
// 			const res = await fetch(
//         `${import.meta.env.VITE_URL}/api/message/send/${
//           selectedConversation._id
//         }`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ message }),
//         }
//       );
// 			const data = await res.json();
// 			if (data.error) throw new Error(data.error);

// 			setMessages([...messages, data]);
// 		} catch (error) {
// 			toast.error(error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { sendMessage, loading };
// };
// export default useSendMessage;
