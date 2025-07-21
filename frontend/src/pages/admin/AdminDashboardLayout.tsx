import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Add Hospital', path: '/admin/add-hospital' },
  // { label: 'Update Hospital', path: '/admin/update-hospital' },
  { label: 'Add Doctor', path: '/admin/add-doctor' },
  // { label: 'Update Doctor', path: '/admin/update-doctor' },
];

const AdminDashboardLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6 border-r">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded hover:bg-gray-200 transition ${location.pathname.startsWith(item.path) ? 'bg-gray-300 font-semibold' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout; 