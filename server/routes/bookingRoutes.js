import express from "express";
import { checkAvailabilityOfCar } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("check-availability", checkAvailabilityOfCar);
