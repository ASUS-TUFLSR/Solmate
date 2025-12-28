import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body, // contains image URL now
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in user controller", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};