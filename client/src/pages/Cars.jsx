import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets, dummyCarData } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Cars = () => {
  // Get search params from url
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();
  const [input, setInput] = useState("");

  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);

  const applyFilter = async () => {
    if (!cars || !Array.isArray(cars)) {
      setFilteredCars([]);
      return;
    }

    if (input === "") {
      setFilteredCars(cars);
      return;
    }

    // ✅ Add actual filtering logic
    const filtered = cars
      .slice()
      .filter(
        (car) =>
          car.brand.toLowerCase().includes(input.toLowerCase()) ||
          car.model.toLowerCase().includes(input.toLowerCase()) ||
          car.description.toLowerCase().includes(input.toLowerCase())
      );
    setFilteredCars(filtered);
  };

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
        toast.error(data.message || "Failed to check availability");
        setFilteredCars([]);
      }
    } catch (error) {
      toast.error("Error checking availability");
      console.error(error);
      setFilteredCars([]);
    }
  };

  // ✅ Initialize filteredCars when cars data is available
  useEffect(() => {
    if (cars && Array.isArray(cars) && cars.length > 0 && !isSearchData) {
      setFilteredCars(cars);
    }
  }, [cars, isSearchData]);

  // ✅ Handle search data availability check
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    }
  }, [isSearchData]);

  // ✅ Handle input filtering
  useEffect(() => {
    if (cars && cars.length > 0 && !isSearchData) {
      applyFilter(); // ✅ Fixed: actually call the function
    }
  }, [input, cars]);

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 mx-auto w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)} // ✅ Fixed: onChange instead of onClick
            value={input}
            className="w-full h-full outline-none text-gray-500"
            type="text"
            placeholder="Search by make, model or features"
            name=""
            id=""
          />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 mr-2" />
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4 xl:px-20 max-w-7xl mx-auto gap-8">
          {filteredCars.length > 0 ? (
            filteredCars.map((car, index) => (
              <div key={car._id || index}>
                <CarCard car={car} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              {input ? "No cars match your search." : "No cars available."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;
