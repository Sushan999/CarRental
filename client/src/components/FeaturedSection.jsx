import React from "react";
import Title from "./Title";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const FeaturedSection = () => {
  const { cars, loadingCars } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="Featured Vehicles"
        subTitle="Explore our selection of premium vehicles available for your next adventure"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18 w-full">
        {loadingCars
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-lg animate-pulse"
              >
                {/* Image skeleton */}
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute bottom-4 right-4 h-6 w-20 bg-gray-300 rounded-lg"></div>
                </div>

                {/* Content skeleton */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div>
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          : cars.map((car) => <CarCard key={car._id} car={car} />)}
      </div>

      {!loadingCars && (
        <button
          onClick={() => {
            navigate("/cars");
            scrollTo(0, 0);
          }}
          className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
        >
          Explore all cars
          <img src={assets.arrow_icon} alt="arrow" />
        </button>
      )}
    </div>
  );
};

export default FeaturedSection;
