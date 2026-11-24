import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLoudinary_Cloud_Name,
  api_key: process.env.CLoudinary_Api_Key,
  api_secret: process.env.CLoudinary_Api_Secret,
});

export default cloudinary;