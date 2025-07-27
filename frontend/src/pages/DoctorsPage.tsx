import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { DoctorResponse } from "@/types";
import { apiClient } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Search, Filter, UserCheck, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Loader from "@/components/ui/Loader";

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  
  // Pagination
  const PAGE_SIZE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique departments and specialties for filters
  const allDepartments = Array.from(new Set(doctors.map(doc => doc.departmentResponse?.name).filter(Boolean)));
  const allSpecialties = Array.from(new Set(doctors.flatMap(doc => doc.specialties).filter(Boolean)));

  useEffect(() => {
    loadAllDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
    setCurrentPage(1); // Reset to first page when filters change
  }, [doctors, searchName, selectedDepartment, selectedSpecialty]);

  const loadAllDoctors = async () => {
    setIsLoading(true);
    try {
      const allDoctors = await apiClient.getAllDoctors();
      setDoctors(allDoctors);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    // Filter by name (case insensitive)
    if (searchName.trim()) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by department
    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter(doc => 
        doc.departmentResponse?.name === selectedDepartment
      );
    }

    // Filter by specialty
    if (selectedSpecialty && selectedSpecialty !== "all") {
      filtered = filtered.filter(doc => 
        doc.specialties.includes(selectedSpecialty)
      );
    }

    setFilteredDoctors(filtered);
  };

  const clearFilters = () => {
    setSearchName("");
    setSelectedDepartment("");
    setSelectedSpecialty("");
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / PAGE_SIZE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * PAGE_SIZE, 
    currentPage * PAGE_SIZE
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Doctors
          </h1>
          <p className="text-gray-600">
            Search and discover qualified healthcare professionals
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Doctors
            </CardTitle>
            <CardDescription>
              Find doctors by name, department, or specialty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Name Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Search by Name
                </label>
                <Input
                  placeholder="Enter doctor's name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Department Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Department
                </label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {allDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specialty Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {allSpecialties.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 opacity-0">
                  Actions
                </label>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 text-lg">
              Showing {filteredDoctors.length} doctors
            </span>
          </div>
          {(searchName || selectedDepartment || selectedSpecialty) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {/* Doctors Grid */}
            {paginatedDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No doctors found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedDoctors.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/doctor/${doc.id}`}
                    className="relative border border-blue-300 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  >
                    {/* Decorative SVG shapes for right side effect */}
                    <svg className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-32 h-32 opacity-10 pointer-events-none" viewBox="0 0 100 100" fill="none">
                      <circle cx="70" cy="50" r="40" fill="#3B82F6" />
                    </svg>
                    <svg className="absolute right-0 bottom-0 w-16 h-16 opacity-5 pointer-events-none" viewBox="0 0 100 100" fill="none">
                      <circle cx="80" cy="80" r="30" fill="#60A5FA" />
                    </svg>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-base text-blue-900 truncate max-w-[60%]">
                        {doc.name}
                      </span>
                      {doc.departmentResponse && (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold ml-1 whitespace-nowrap">
                          {doc.departmentResponse.name}
                        </span>
                      )}
                    </div>
                    
                    {doc.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {doc.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-3">
                      {/* Phone */}
                      <div className="flex items-center gap-1 min-w-0 p-1 bg-green-50 rounded-3xl font-semibold px-3">
                        <Phone className="w-4 h-4 text-green-400" />
                        <span className="truncate max-w-[90px]" title={doc.phoneNumber}>
                          {doc.phoneNumber}
                        </span>
                      </div>
                      {/* Divider */}
                      <span className="text-gray-300">&bull;</span>
                      {/* Email */}
                      <div className="flex items-center gap-1 min-w-0 p-1 bg-blue-50 rounded-3xl font-semibold px-3">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="truncate" title={doc.email}>
                          {doc.email}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                    className="min-w-[40px]"
                  >
                    {i + 1}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default DoctorsPage;
