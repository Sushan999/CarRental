import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingScheama = new mongoose.Schema(
  {
    car: { type: ObjectId, ref: "Car", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    owner: { type: ObjectId, ref: "Car", required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    staus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    price: { type: Number, required: true },
  },

  { timestamps: true }
);

const Booking = mongoose.model("Car", bookingScheama);

export default Booking;
