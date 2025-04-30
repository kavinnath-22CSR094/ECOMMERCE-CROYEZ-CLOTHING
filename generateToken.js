import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Function to generate a new token
const generateToken = (userId) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });
  return token;
};

// Example usage
const userId = "67c483a4b0c1603910428832"; // Replace with the actual user ID
const newToken = generateToken(userId);
console.log("New Token:", newToken);