import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEST_TYPE, TestResponse, DoctorResponse } from '@/types';
import { Hospital } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { MapPin, Phone, Globe, ExternalLink, Mail, Trash2 } from 'lucide-react';
import HospitalMap from '@/components/hospitals/HospitalMap';
import { FEEDBACK_TARGET_TYPE, FeedbackResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import RatingForm from '@/components/ratings/RatingForm';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader, AlertDialogTrigger, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

interface UserReview extends FeedbackResponse {
  username?: string;
}

const HospitalDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState<TestResponse[]>([]);
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [testTypeFilter, setTestTypeFilter] = useState<string>('all');
  const [testSort, setTestSort] = useState<'name' | 'price'>('name');
  const [testSortOrder, setTestSortOrder] = useState<'asc' | 'desc'>('asc');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState<string>('all');
  const [doctorSortOrder, setDoctorSortOrder] = useState<'asc' | 'desc'>('asc');
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      loadHospitalData();
      loadTests();
      loadDoctors();
      loadReviews();
    }
    // eslint-disable-next-line
  }, [id]);


  const loadHospitalData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const hospitalData = await apiClient.getHospitalById(id);
      setHospital(hospitalData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hospital details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTests = async () => {
    if (!id) return;
    try {
      const testList = await apiClient.getTestsByHospital(id);
      setTests(testList as TestResponse[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tests.",
        variant: "destructive",
      });
    }
  };

  const loadDoctors = async () => {
    if (!id) return;
    try {
      const doctorList = await apiClient.getDoctorsByHospital(id);
      setDoctors(doctorList as DoctorResponse[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctors.",
        variant: "destructive",
      });
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const feedbacks = await apiClient.getHospitalFeedbacks(id);
      const tempReviews: UserReview[] = [...feedbacks];
      for (let review of tempReviews) {
        const userData = await apiClient.getUserById(review.userId);
        review.username = userData.name;
      }
      setReviews(tempReviews);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  // Filtering and sorting for tests
  const filteredTests = tests
    .filter(test =>
      testTypeFilter && (testTypeFilter !== "all")
        ? test.types.includes(testTypeFilter as TEST_TYPE)
        : true
    )
    .sort((a, b) => {
      if (testSort === 'name') {
        const cmp = a.name.localeCompare(b.name);
        return testSortOrder === 'asc' ? cmp : -cmp;
      } else {
        const cmp = a.price - b.price;
        return testSortOrder === 'asc' ? cmp : -cmp;
      }
    });

  // Collect all unique doctor specialties for filter dropdown
  const allDoctorSpecialties = Array.from(new Set(doctors.flatMap(doc => doc.specialties).filter(Boolean)));

  // Filtering and sorting for doctors
  const filteredDoctors = doctors
    .filter(doc =>
      doctorSpecialtyFilter !== 'all'
        ? doc.specialties.includes(doctorSpecialtyFilter)
        : true
    )
    .sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return doctorSortOrder === 'asc' ? cmp : -cmp;
    });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading hospital details...</div>
        </div>
      </Layout>
    );
  }

  if (!hospital) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hospital Not Found</h1>
          <Link to="/hospitals">
            <Button>Back to Hospitals</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleDeleteReview = async (reviewId: number) => {
    await apiClient.deleteFeedbackById(reviewId, user?.uid || '');
    loadReviews();
  };

  // Collect all unique test types for filter dropdown
  const allTestTypes = Array.from(new Set(
    tests.flatMap(t => t.types).filter(Boolean)
  ));

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hospital Header */}
        <div className="relative overflow-hidden rounded-lg shadow-md p-6 bg-gradient-to-tr from-blue-50 via-white to-blue-100">
          {/* Decorative Circles */}
          <svg className="absolute -top-8 -left-8 w-32 h-32 opacity-20" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="#3B82F6" />
          </svg>
          <svg className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="#F59E42" />
          </svg>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{hospital.name}</h1>
              {/* Info Pills Row */}
              <div className="flex flex-wrap gap-4 mb-2">
                {/* Phone */}
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1 shadow-sm">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">{hospital.phoneNumber}</span>
                </div>
                {/* Website */}
                {hospital.website && (
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1 shadow-sm hover:bg-blue-100 transition">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900 underline">Website</span>
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                  </a>
                )}
                {/* Cost Range */}
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1 shadow-sm">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 12v4" /></svg>
                  <span className="font-medium text-yellow-900">Cost: {hospital.costRange}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-end gap-2 min-w-[120px] ">
              {/* Hospital Types Badges - now in top right */}
              {hospital.types?.map((type) => (
                <span key={type} className="flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-full px-4 py-1 shadow-sm text-purple-900 font-semibold uppercase tracking-wide mt-1">
                  <svg className="h-4 w-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                  {type}
                </span>
              ))}
            </div>
          </div>
          {/* Doctors & Tests Info Row - visually prominent */}
          <div className="flex gap-6 mt-3 relative z-10">
            <div className="flex items-center gap-2 bg-white/80 shadow rounded-xl px-5 py-1 border border-blue-100">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0113 0" /></svg>
              <span className="text-lg font-semibold text-blue-900">{doctors.length}</span>
              <span className="text-base text-gray-700 font-medium">Doctors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 shadow rounded-xl px-5 py-1 border border-orange-100">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 2v4m8-4v4" /></svg>
              <span className="text-lg font-semibold text-orange-700">{tests.length}</span>
              <span className="text-base text-gray-700 font-medium">Tests</span>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue={sessionStorage.getItem('currentTab') || 'location'} className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="location" className='text-lg' onClick={() => {
              sessionStorage.setItem('currentTab', 'location');
            }}>Location</TabsTrigger>
            <TabsTrigger value="doctors" className='text-lg' onClick={() => {
              sessionStorage.setItem('currentTab', 'doctors');
            }}>Doctors ({doctors.length})</TabsTrigger>
            <TabsTrigger value="tests" className='text-lg' onClick={() => {
              sessionStorage.setItem('currentTab', 'tests');
            }}>Tests ({tests.length})</TabsTrigger>
            <TabsTrigger value="reviews" className='text-lg' onClick={() => {
              sessionStorage.setItem('currentTab', 'reviews');
            }}>Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          {/* Location Tab */}
          <TabsContent value="location">
            {hospital.locationResponse && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Address:</strong> {hospital.locationResponse.address}</p>
                      <p><strong>Thana:</strong> {hospital.locationResponse.thana}</p>
                      <p><strong>PO:</strong> {hospital.locationResponse.po}</p>
                    </div>
                    <div>
                      <p><strong>City:</strong> {hospital.locationResponse.city}</p>
                      <p><strong>Postal Code:</strong> {hospital.locationResponse.postalCode}</p>
                      <p><strong>Zone ID:</strong> {hospital.locationResponse.zoneId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Hospital Location</CardTitle>
                <CardDescription>View the hospital on the map</CardDescription>
              </CardHeader>
              <CardContent>
                <HospitalMap hospitals={[hospital]} className="h-96" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Doctors</CardTitle>
                <CardDescription>List of doctors affiliated with this hospital</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Select value={doctorSpecialtyFilter} onValueChange={setDoctorSpecialtyFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {allDoctorSpecialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={doctorSortOrder} onValueChange={v => setDoctorSortOrder(v as 'asc' | 'desc')}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Sort: Name (A-Z)</SelectItem>
                      <SelectItem value="desc">Sort: Name (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <hr className="mb-4 border-blue-100" />
                {filteredDoctors.length === 0 ? (
                  <div className="text-gray-500">No doctors found for this hospital.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="relative border border-blue-300 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      >
                        {/* Decorative SVG shapes for right side effect */}
                        <svg className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-32 h-32 opacity-10 pointer-events-none" viewBox="0 0 100 100" fill="none">
                          <circle cx="70" cy="50" r="40" fill="#3B82F6" />
                        </svg>
                        <svg className="absolute right-0 bottom-0 w-16 h-16 opacity-5 pointer-events-none" viewBox="0 0 100 100" fill="none">
                          <circle cx="80" cy="80" r="30" fill="#60A5FA" />
                        </svg>
                        <div className="flex items-center gap-2 mb-2">
                          <Link to={`/doctor/${doc.id}`} className='text-blue-500 font-medium cursor-pointer hover:underline'>
                            <span className="font-bold text-base text-blue-900 truncate max-w-[60%]">{doc.name}</span>
                          </Link>
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
                            <span className="truncate max-w-[90px]" title={doc.phoneNumber}>{doc.phoneNumber}</span>
                          </div>
                          {/* Divider */}
                          <span className="text-gray-300">&bull;</span>
                          {/* Email */}
                          <div className="flex items-center gap-1 min-w-0 p-1 bg-blue-50 rounded-3xl font-semibold px-3">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <span className="" title={doc.email}>{doc.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>Tests</CardTitle>
                <CardDescription>List of medical tests offered by this hospital</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {allTestTypes.map((type) => (
                        type ? <SelectItem key={type} value={type}>{type}</SelectItem> : null
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={testSort} onValueChange={v => setTestSort(v as 'name' | 'price')}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Sort: Name (A-Z)</SelectItem>
                      <SelectItem value="price">Sort: Price</SelectItem>
                    </SelectContent>
                  </Select>
                  {testSort === 'price' && (
                    <Select value={testSortOrder} onValueChange={v => setTestSortOrder(v as 'asc' | 'desc')}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Low to High</SelectItem>
                        <SelectItem value="desc">High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {filteredTests.length === 0 ? (
                  <div className="text-gray-500">No tests found for this hospital.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTests.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xl text-blue-900">{test.name}</div>
                          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm shadow-inner">
                            Tk. {test.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {test.types.map((type) => (
                            <span key={type} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="bg-white shadow-none border-none rounded-lg">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>What people are saying about this hospital</CardDescription>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="flex justify-center items-center h-32 text-gray-500">Loading reviews...</div>
                ) : (
                  <>
                    {/* Add Review Button or Form */}
                    {isAuthenticated && user && (
                      (() => {
                        // Find if user has already reviewed
                        const userReview = reviews.find(r => r.userId === user.uid);
                        // if (!userReview) {
                        //   return (
                        //     <div className="mb-6">
                        //       <RatingForm hospitalId={hospital.id} onRatingAdded={loadReviews} />
                        //     </div>
                        //   );
                        // }
                        return null;
                      })()
                    )}
                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                      <div className="text-gray-500">No reviews yet for this hospital.</div>
                    ) : (
                      <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
                        {/* User's review at the top if present */}
                        {isAuthenticated && user && reviews.some(r => r.userId === user.uid) && (
                          (() => {
                            const userReview = reviews.find(r => r.userId === user.uid);
                            if (!userReview) return null;
                            const initials = (userReview.userId || 'U').slice(0, 2).toUpperCase();
                            const dateStr = new Date(userReview.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                            const showReadMore = userReview.comment && userReview.comment.length > 120;
                            return (
                              <div
                                key={userReview.id}
                                className="w-full border-2 border-blue-400 rounded-lg shadow-lg bg-white p-5 space-y-2 relative md:col-span-2"
                              >
                                {/* Date in top right, more visible */}
                                <div className='absolute top-4 right-6 text-gray-800 font-semibold text-sm md:text-base flex items-center gap-3'>
                                  <span>{dateStr}</span>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button className='text-blue-500 font-medium cursor-pointer hover:underline p-2 rounded-lg bg-red-50'>
                                        <Trash2 size={20} className=' text-red-500' />
                                      </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                        <AlertDialogDescription>Are you sure you want to delete this review?</AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                          <button className='text-red-500 font-medium cursor-pointer hover:underline p-2 rounded-lg bg-red-50' onClick={() => handleDeleteReview(userReview.id)}>
                                            <Trash2 size={20} className=' text-red-500' /> Delete
                                          </button>
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                                <div className="flex items-center space-x-4 mb-1 w-full">
                                  <div className="p-2 flex items-center justify-center bg-blue-500 text-white text-lg font-semibold rounded-full">
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="text-gray-900 font-medium leading-tight">
                                      {userReview.username ?
                                        <Link to={'/profile'} className='text-blue-500 font-medium cursor-pointer hover:underline'>{userReview.username}</Link>
                                        :
                                        <span>User</span>
                                      }
                                    </div>
                                  </div>
                                  <div className="ml-auto w-full">
                                    {/* <RatingForm
                                      hospitalId={hospital.id}
                                      onRatingAdded={loadReviews}
                                      existingRating={{
                                        id: userReview.id,
                                        rating: userReview.rating,
                                        review_text: userReview.comment,
                                        user_id: userReview.userId,
                                        user_name: userReview.userId, // or use a real name if available
                                        created_at: userReview.createdAt,
                                      }}
                                    /> */}
                                  </div>
                                </div>
                                <div className="flex text-yellow-500 text-2xl mb-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>{i < userReview.rating ? '★' : '☆'}</span>
                                  ))}
                                </div>
                                <p className="text-gray-700 leading-snug text-base">
                                  {showReadMore ? userReview.comment.slice(0, 120) + '...' : userReview.comment}
                                </p>
                                {showReadMore && (
                                  <div className="text-blue-500 font-medium cursor-pointer hover:underline">Read more</div>
                                )}
                              </div>
                            );
                          })()
                        )}
                        {/* Other reviews (excluding user's) */}
                        {reviews.filter(r => !user || r.userId !== user.uid).map((review) => {
                          const initials = (review.userId || 'U').slice(0, 2).toUpperCase();
                          const dateStr = new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                          const showReadMore = review.comment && review.comment.length > 120;
                          return (
                            <div
                              key={review.id}
                              className="max-w-2xl border border-gray-300 rounded-lg shadow-lg bg-white p-5 space-y-2 relative"
                            >
                              {/* Date in top right, more visible */}
                              <span className="absolute top-4 right-6 text-gray-800 font-semibold text-sm md:text-base">{dateStr}</span>
                              <div className="flex items-center space-x-4 mb-1">
                                <div className="h-12 w-12 flex items-center justify-center bg-blue-500 text-white text-lg font-semibold rounded-full">
                                  {initials}
                                </div>
                                <div>
                                  <div className="text-gray-900 font-medium leading-tight">
                                    {review.username ?
                                      <Link to={`/profile/${review.userId}`} className='text-blue-500 font-medium cursor-pointer hover:underline'>{review.username}</Link>
                                      :
                                      <span>User</span>
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="flex text-yellow-500 text-2xl mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                ))}
                              </div>
                              <p className="text-gray-700 leading-snug text-base">
                                {showReadMore ? review.comment.slice(0, 120) + '...' : review.comment}
                              </p>
                              {showReadMore && (
                                <div className="text-blue-500 font-medium cursor-pointer hover:underline">Read more</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HospitalDetailsPage;
