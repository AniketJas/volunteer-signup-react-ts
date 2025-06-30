import { useState } from "react";
import VolunteerSignup from "../components/VolunteerSignup";
import AdminDashboard from "../components/AdminDashboard";
import AdminLogin from "../components/AdminLogin";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const [activeView, setActiveView] = useState("volunteer");
  const { isAdminLoggedIn, adminEmail, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setActiveView("volunteer");
  };

  if (activeView === "admin" && !isAdminLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FoodBridge</h1>
                <p className="text-sm text-gray-500">Community Food Network</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAdminLoggedIn && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {adminEmail}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-1">👥</span>
                <span>127 volunteers</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-1">⏰</span>
                <span>48 shifts this week</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join Our Mission to End Food Waste
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Help us rescue surplus food from local businesses and deliver it to families in need.
            Every volunteer hour makes a difference in our community.
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="grid w-full max-w-md grid-cols-2 mb-8 gap-2">
            <button
              className={`px-4 py-2 text-sm border rounded ${activeView === "volunteer" ? "bg-white text-blue-700 font-semibold" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setActiveView("volunteer")}
            >
              Volunteer Signup
            </button>
            <button
              className={`px-4 py-2 text-sm border rounded ${activeView === "admin" ? "bg-white text-blue-700 font-semibold" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setActiveView("admin")}
            >
              Admin Dashboard
            </button>
          </div>

          {activeView === "volunteer" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: "Food Pickup",
                    desc: "Collect surplus food from partner restaurants and grocers",
                    count: 12,
                    color: "green",
                  },
                  {
                    title: "Food Sorting",
                    desc: "Sort and package donations at our distribution center",
                    count: 8,
                    color: "blue",
                  },
                  {
                    title: "Delivery",
                    desc: "Deliver food packages to families and community centers",
                    count: 15,
                    color: "purple",
                  },
                ].map(({ title, desc, count, color }) => (
                  <div
                    key={title}
                    className={`border border-${color}-200 bg-${color}-50 p-4 rounded`}
                  >
                    <h3 className={`text-lg font-semibold text-${color}-800`}>{title}</h3>
                    <p className={`text-sm text-${color}-600 mb-2`}>{desc}</p>
                    <div className={`text-2xl font-bold text-${color}-700`}>{count}</div>
                    <div className={`text-sm text-${color}-600`}>shifts available this week</div>
                  </div>
                ))}
              </div>
              <VolunteerSignup />
            </div>
          )}

          {activeView === "admin" && (
            <div className="space-y-6">
              {isAdminLoggedIn ? (
                <AdminDashboard />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Please log in to access the admin dashboard.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;