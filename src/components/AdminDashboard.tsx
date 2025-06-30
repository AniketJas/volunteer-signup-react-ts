import { useState, useEffect } from "react";
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
      Array.isArray(volunteer.skills) ? volunteer.skills.join('; ') : '',
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
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: "👥", label: 'Total Volunteers', value: volunteers.length },
          { icon: "✅", label: 'Active This Week', value: volunteers.filter(v => v.status === "active").length },
          { icon: "📅", label: 'Pending Approval', value: volunteers.filter(v => v.status === "pending").length },
          { icon: "⏰", label: 'Approved', value: volunteers.filter(v => v.status === "approved").length },
        ].map(({ icon, label, value }) => (
          <div className="p-6 bg-white rounded shadow border" key={label}>
            <div className="flex items-center">
              <span className="text-2xl">{icon}</span>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 border-b-2 text-sm ${selectedTab === 'volunteers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setSelectedTab('volunteers')}
          >
            Volunteers
          </button>
          <button
            className={`pb-2 border-b-2 text-sm ${selectedTab === 'shifts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setSelectedTab('shifts')}
          >
            Shifts
          </button>
        </div>

        {/* ... rest of component remains unchanged ... */}

      </div>
    </div>
  );
};

export default AdminDashboard;
