import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("connected DB"));
    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
