import User from "../models/User.js";

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
  } catch (error) {
    console.log(error.message);
    res.json({ sucess: false, message: error.message });
  }
};
