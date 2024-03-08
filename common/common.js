/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

const hashCompare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const createToken = async (payload, res) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  // WITHOUT CHANGES==================

  // res.cookie("jwt", token, {
  // 	maxAge: 15 * 24 * 60 * 60 * 1000, // MS
  // 	httpOnly: true, // prevent XSS attacks cross-site scripting attacks
  // 	sameSite: "strict", // CSRF attacks cross-site request forgery attacks
  // 	secure: process.env.NODE_ENV !== "development",
  // });

  return token;
};

const decodeToken = async (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};

// FOR MY CLARIFYCATION NOTES ============================================

// const validate = async (req, res, next) => {
//   try {
//     let token = req.headers.authorization?.split(" ")[1];
//     if (token) {
//       let payload = await decodeToken(token);
//       let currentTime = +new Date() / 1000;

//       if (currentTime < payload.exp) {
//         req.user = payload;
//         next();
//       } else {
//         res.status(400).send({ message: "Token Expired" });
//       }
//     } else {
//       res.status(400).send({ message: "No Token Found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const adminGaurd = async (req, res, next) => {
//   let token = req.headers.authorization?.split(" ")[1];
//   if (token) {
//     let payload = await decodeToken(token);
//     if (payload.role === "admin") next();
//     else res.status(400).send({ message: "Only Admins are allowed" });
//   } else {
//     res.status(400).send({ message: "No Token Found" });
//   }
// };

export default {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
};
