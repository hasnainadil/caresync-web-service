import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import HospitalSearch from "@/components/hospitals/HospitalSearch";
import HospitalCard from "@/components/hospitals/HospitalCard";
import HospitalMap from "@/components/hospitals/HospitalMap";
import { Hospital, HospitalSearchCriteria } from "@/types";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Grid, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Loader from "@/components/ui/Loader";

enum ViewStyle {
  Grid = "grid",
  Map = "map",
  MapViewStyle = "mapViewStyle",
}

const HospitalsPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewStyle, setViewStyle] = useState(ViewStyle.Grid);

  // Mock data for demonstration
  useEffect(() => {
    const fetchDemoHospitals = async () => {
      setIsLoading(true);
      try {
        const allHospitals = await apiClient.getAllHospitals();
        console.log(allHospitals);
        setHospitals(allHospitals as unknown as Hospital[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoHospitals();
    const mapViewStyle = sessionStorage.getItem(ViewStyle.MapViewStyle)
    if (mapViewStyle) {
      setViewStyle(mapViewStyle as ViewStyle);
    } else {
      sessionStorage.setItem(ViewStyle.MapViewStyle, ViewStyle.Grid);
    }
  }, []);

  const handleSearch = async (filters: HospitalSearchCriteria) => {
    setIsLoading(true);
    try {
      console.log("Searching with filters:", filters);
      const response = await apiClient.searchHospitalsByCriteria(filters);
      setHospitals(response as unknown as Hospital[]);
      toast({
        title: "Search completed",
        description: `Found ${hospitals.length} hospitals`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Hospitals
          </h1>
          <p className="text-gray-600">
            Discover the best healthcare facilities near you
          </p>
        </div>

        <HospitalSearch onSearch={handleSearch} isLoading={isLoading} />
        <div className="flex flex-row w-full">
          <div className="flex flex-row w-1/2 items-center">
            <span className="text-gray-700 text-lg">
              Showing {hospitals.length} hospitals
            </span>
          </div>
          <div className="flex flex-row justify-end w-1/2">
            <div className="relative flex flex-row bg-white shadow-md rounded-2xl text-center p-2 gap-4 px-3">
              {/* Sliding background */}
              <motion.div
                className="absolute top-2 bottom-2 bg-gray-100 rounded-xl shadow-inner"
                initial={false}
                animate={{
                  x: viewStyle === ViewStyle.Grid ? 0 : 135, // 120px is approximately the width of one button + gap
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                style={{
                  width: "120px", // Fixed width to match button size
                }}
              />

              <button
                onClick={() => {
                  setViewStyle(ViewStyle.Grid);
                  sessionStorage.setItem(ViewStyle.MapViewStyle, ViewStyle.Grid);
                }}
                className="relative px-4 py-2 rounded-xl transition-colors duration-200 z-10 w-[120px]"
              >
                <span className={cn(
                  "transition-colors duration-200",
                  viewStyle === ViewStyle.Grid ? "text-gray-700" : "text-gray-500"
                )}>
                  Grid View
                </span>
              </button>

              <button
                onClick={() => {
                  setViewStyle(ViewStyle.Map);
                  sessionStorage.setItem(ViewStyle.MapViewStyle, ViewStyle.Map);
                }}
                className="relative px-4 py-2 rounded-xl transition-colors duration-200 z-10 w-[120px]"
              >
                <span className={cn(
                  "transition-colors duration-200",
                  viewStyle === ViewStyle.Map ? "text-gray-700" : "text-gray-500"
                )}>
                  Map View
                </span>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {viewStyle === ViewStyle.Grid ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map((hospital) => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
            ) : (
              <HospitalMap hospitals={hospitals} className="mt-6" />
            )}

            {hospitals.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No hospitals found. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default HospitalsPage;
