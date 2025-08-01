import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Hospital, User, Calendar, ExternalLinkIcon } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Hospital className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CareSync</span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link
                to="/hospitals"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Find Hospitals
              </Link>
              <Link
                to="/doctors"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Find Doctors
              </Link>
              <Link
                to="https://hhfn.org.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Donate
                <ExternalLinkIcon className="inline h-4 w-4 ml-1" />
              </Link>
              
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">Welcome, {user?.displayName || user?.email}</Link>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
