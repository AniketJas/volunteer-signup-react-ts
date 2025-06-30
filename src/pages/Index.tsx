
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import VolunteerSignup from "../components/VolunteerSignup";
import AdminDashboard from "../components/AdminDashboard";
import AdminLogin from "../components/AdminLogin";
import { useAuth } from "../contexts/AuthContext";
import { Heart, Users, Clock, LogOut } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState("volunteer");
  const { isAdminLoggedIn, adminEmail, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setActiveView("volunteer");
  };

  // Show admin login if trying to access admin tab but not logged in
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
                <Heart className="w-6 h-6 text-white" />
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>127 volunteers</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
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

        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="volunteer" className="text-sm">
              Volunteer Signup
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-sm">
              Admin Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="volunteer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-800">Food Pickup</CardTitle>
                  <CardDescription className="text-green-600">
                    Collect surplus food from partner restaurants and grocers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">12</div>
                  <div className="text-sm text-green-600">shifts available this week</div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">Food Sorting</CardTitle>
                  <CardDescription className="text-blue-600">
                    Sort and package donations at our distribution center
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">8</div>
                  <div className="text-sm text-blue-600">shifts available this week</div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-800">Delivery</CardTitle>
                  <CardDescription className="text-purple-600">
                    Deliver food packages to families and community centers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">15</div>
                  <div className="text-sm text-purple-600">shifts available this week</div>
                </CardContent>
              </Card>
            </div>

            <VolunteerSignup />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            {isAdminLoggedIn ? (
              <AdminDashboard />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Please log in to access the admin dashboard.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
