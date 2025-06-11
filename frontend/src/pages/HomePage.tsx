
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, User, Calendar, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find the Best Healthcare
          <span className="text-blue-600"> Near You</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover hospitals, book appointments with top doctors, and access comprehensive healthcare information all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/hospitals">
            <Button size="lg" className="px-8">
              <Search className="mr-2 h-5 w-5" />
              Find Hospitals
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" className="px-8">
              <User className="mr-2 h-5 w-5" />
              Join Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="text-center">
          <CardHeader>
            <Hospital className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Find Hospitals</CardTitle>
            <CardDescription>
              Search and filter hospitals by location, specialty, ratings, and more
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Expert Doctors</CardTitle>
            <CardDescription>
              Browse detailed profiles of experienced doctors and their specializations
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Easy Booking</CardTitle>
            <CardDescription>
              Book appointments with your preferred doctors at convenient times
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Statistics Section */}
      <section className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Trusted by Thousands</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Hospitals Listed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">2000+</div>
            <div className="text-gray-600">Verified Doctors</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
            <div className="text-gray-600">Appointments Booked</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
