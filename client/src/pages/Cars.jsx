import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();
  const [input, setInput] = useState("");

  const isSearchData = pickupLocation && pickupDate && returnDate;

  const [filteredCars, setFilteredCars] = useState(cars);

  // Filter function
  const applyFilter = () => {
    if (input === "") {
      setFilteredCars(cars);
      return;
    }
    const filtered = cars.filter(
      (car) =>
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCars(filtered);
  };

  // Check availability API call
  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        setFilteredCars(data.availableCars);
        if (data.availableCars.length === 0) {
          toast("No cars available");
        }
      } else {
        toast.error("Failed to fetch availability");
      }
    } catch (error) {
      toast.error("Error checking availability");
      console.error(error);
    }
  };

  // Run on mount or when search params change
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    } else {
      setFilteredCars(cars);
    }
  }, [isSearchData, cars]);

  // Run filter when input or cars change
  useEffect(() => {
    applyFilter();
  }, [input, cars]);

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 mx-auto w-full h-12 rounded-full shadow">
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4.5 h-4.5 mr-2"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="w-full h-full outline-none text-gray-500"
            type="text"
            placeholder="Search by make, model or features"
          />
          <img
            src={assets.filter_icon}
            alt="filter"
            className="w-4.5 h-4.5 mr-2"
          />
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4 xl:px-20 max-w-7xl mx-auto gap-8">
          {filteredCars.map((car, index) => (
            <div key={index}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
