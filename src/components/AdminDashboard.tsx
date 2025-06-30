import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Users, Calendar, Clock, CheckCircle, Download, FileJson } from "lucide-react";
import { getVolunteersData, updateVolunteerStatus, downloadVolunteersJSON, downloadAdminLoginsJSON } from "../utils/dataManager";

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  registrationDate: string;
  status: "pending" | "approved" | "active";
  assignedShifts: number;
}

interface Shift {
  id: string;
  date: string;
  time: string;
  type: string;
  location: string;
  volunteers: string[];
  maxVolunteers: number;
}

const mockShifts: Shift[] = [
  {
    id: "1",
    date: "2024-07-01",
    time: "09:00-12:00",
    type: "Food Pickup",
    location: "Downtown Market District",
    volunteers: ["Mike Chen", "Emma Rodriguez"],
    maxVolunteers: 4
  },
  {
    id: "2",
    date: "2024-07-01",
    time: "14:00-17:00",
    type: "Food Sorting",
    location: "FoodBridge Distribution Center",
    volunteers: ["Emma Rodriguez"],
    maxVolunteers: 6
  },
  {
    id: "3",
    date: "2024-07-02",
    time: "10:00-13:00",
    type: "Delivery",
    location: "East Side Community",
    volunteers: ["Mike Chen", "Emma Rodriguez"],
    maxVolunteers: 3
  }
];

const AdminDashboard = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedTab, setSelectedTab] = useState("volunteers");

  useEffect(() => {
    // Load volunteers from localStorage on component mount
    const savedVolunteers = getVolunteersData();
    setVolunteers(savedVolunteers);
  }, []);

  const approveVolunteer = (id: string) => {
    const success = updateVolunteerStatus(id, "approved");
    if (success) {
      setVolunteers(prev =>
        prev.map(vol =>
          vol.id === id ? { ...vol, status: "approved" as const } : vol
        )
      );
    }
  };

  const downloadVolunteersCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Skills', 'Availability', 'Registration Date', 'Status', 'Assigned Shifts'];
    const csvData = volunteers.map(volunteer => [
      `${volunteer.firstName} ${volunteer.lastName}`,
      volunteer.email,
      volunteer.phone,
      volunteer.skills.join('; '),
      volunteer.availability,
      volunteer.registrationDate,
      volunteer.status,
      volunteer.assignedShifts.toString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {volunteers.filter(v => v.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">
                  {volunteers.filter(v => v.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {volunteers.filter(v => v.status === "approved").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
        </TabsList>

        <TabsContent value="volunteers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Volunteer Management</CardTitle>
                  <CardDescription>
                    View all volunteers and manage their applications
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadVolunteersCSV} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                  <Button onClick={downloadVolunteersJSON} variant="outline" className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    Download JSON
                  </Button>
                  <Button onClick={downloadAdminLoginsJSON} variant="outline" className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    Admin Logins JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {volunteers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No volunteers registered yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Shifts</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteers.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{volunteer.firstName} {volunteer.lastName}</div>
                            <div className="text-sm text-gray-500">
                              Registered: {formatDate(volunteer.registrationDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{volunteer.email}</div>
                            <div className="text-gray-500">{volunteer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {/* <div className="text-sm">{volunteer.skills.join(", ")}</div> */}
                          <div className="text-sm">
                            {Array.isArray(volunteer.skills) ? volunteer.skills.join(", ") : String(volunteer.skills)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{volunteer.availability}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(volunteer.status)}>
                            {volunteer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{volunteer.assignedShifts}</div>
                        </TableCell>
                        <TableCell>
                          {volunteer.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => approveVolunteer(volunteer.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shift Management</CardTitle>
              <CardDescription>
                View and manage volunteer shift assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockShifts.map((shift) => (
                  <div key={shift.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900">{shift.type}</h4>
                          <Badge variant="outline" className="ml-2">
                            {shift.volunteers.length}/{shift.maxVolunteers} volunteers
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            <span className="font-medium">Date & Time:</span> {formatDate(shift.date)} • {shift.time}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {shift.location}
                          </div>
                          <div>
                            <span className="font-medium">Assigned Volunteers:</span> {
                              shift.volunteers.length > 0 ? shift.volunteers.join(", ") : "None assigned"
                            }
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${shift.volunteers.length >= shift.maxVolunteers
                          ? "text-green-600"
                          : "text-orange-600"
                          }`}>
                          {shift.volunteers.length >= shift.maxVolunteers ? "Fully Staffed" : "Needs Volunteers"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
