import User from "../models/user.model.js";
import common from "../common/common.js";

const signup = async (req, res)=>{
    try {
        const {fullName, username, password, confirmPassword, gender } = req.body;

        if(password !== confirmPassword) {
            return res.status(400).json({error: "Password don't match"})
        }

        const user = await User.findOne({username})
        if(user){
            return res.status(400).json({error: "Username already exists"})
        }

        const hashedPassword = await common.hashPassword(password)

        const boyprofilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlprofilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyprofilePic : girlprofilePic,
        })

        if (newUser){
            common.createToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            })
        }else{
            res.status(400).json({error:'Invalid user data'})
        }
    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({error: 'Internal server Error'})
    }
}

const login = async (req, res)=>{
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        const isPasswordCorrect = await common.hashCompare(password, user?.password || '')

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"})
        }

        await common.createToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        })
        
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({error: 'Internal server Error'})
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// WITHOUT CHANGES ================

// const logout = (req, res) => {
// 	try {
// 		res.cookie("jwt", "", { maxAge: 0 });
// 		res.status(200).json({ message: "Logged out successfully" });
// 	} catch (error) {
// 		console.log("Error in logout controller", error.message);
// 		res.status(500).json({ error: "Internal Server Error" });
// 	}
// };


export default {
    signup,
    login,
    logout
}