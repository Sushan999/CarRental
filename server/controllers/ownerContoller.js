import imagekit from "../configs/imagekit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

//Api to change role of user
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndDelete(_id, { role: "owner" });
    res.json({ sucess: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ sucess: false, message: error.message });
  }
};

//API to list car

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    // Upload image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname, // ✅ FIXED: correct property name
      folder: "/cars",
    });

    // ✅ Correct URL optimization
    const optimizedImageURL = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    // Save car to DB
    await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageURL,
    });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//API to list Owner  Cars

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ sucess: true, cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//API to Toggle Car Availability

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById({ carId });
    res.json({ sucess: true, cars });

    //checking if car belongs to the user
    if (car.owner.toString() !== _id.toSting()) {
      return res.json({ sucess: false, message: "Unauthorized" });
    }

    car.isAvaliable = !car.isAvaliable;
    await car.save();

    res.json({ sucess: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ sucess: false, message: error.message });
  }
};

//API to delete the car

export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById({ carId });
    res.json({ sucess: true, cars });

    //checking if car belongs to the user
    if (car.owner.toString() !== _id.toSting()) {
      return res.json({ sucess: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvaliable = false;
    await car.save();

    res.json({ sucess: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({ sucess: false, message: error.message });
  }
};

//API to get Dashboard data

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner  ") {
      return res.json({ sucess: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
  } catch (error) {
    console.log(error.message);
    res.json({ sucess: false, message: error.message });
  }
};
