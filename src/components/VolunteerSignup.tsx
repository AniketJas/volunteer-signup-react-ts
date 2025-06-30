
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { saveVolunteerData } from "../utils/dataManager";
import { Calendar, Clock, User, Check } from "lucide-react";

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  type: string;
  location: string;
  slotsAvailable: number;
  totalSlots: number;
}

const mockTimeSlots: TimeSlot[] = [
  {
    id: "1",
    date: "2024-07-01",
    time: "09:00-12:00",
    type: "Food Pickup",
    location: "Downtown Market District",
    slotsAvailable: 2,
    totalSlots: 4
  },
  {
    id: "2",
    date: "2024-07-01",
    time: "14:00-17:00",
    type: "Food Sorting",
    location: "FoodBridge Distribution Center",
    slotsAvailable: 3,
    totalSlots: 6
  },
  {
    id: "3",
    date: "2024-07-02",
    time: "10:00-13:00",
    type: "Delivery",
    location: "East Side Community",
    slotsAvailable: 1,
    totalSlots: 3
  },
  {
    id: "4",
    date: "2024-07-02",
    time: "15:00-18:00",
    type: "Food Pickup",
    location: "Restaurant Row",
    slotsAvailable: 4,
    totalSlots: 4
  },
  {
    id: "5",
    date: "2024-07-03",
    time: "08:00-11:00",
    type: "Food Sorting",
    location: "FoodBridge Distribution Center",
    slotsAvailable: 2,
    totalSlots: 5
  }
];

const VolunteerSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    availability: "",
    skills: [] as string[],
    experience: "",
    transportation: "",
    emergencyContact: "",
    selectedSlots: [] as string[]
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSlotToggle = (slotId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSlots: prev.selectedSlots.includes(slotId)
        ? prev.selectedSlots.filter(s => s !== slotId)
        : [...prev.selectedSlots, slotId]
    }));
  };

  const handleSubmit = () => {
    // Create volunteer data object
    const volunteerData = {
      id: Date.now().toString(), // Simple ID generation
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      availability: formData.availability,
      skills: formData.skills,
      experience: formData.experience,
      transportation: formData.transportation,
      emergencyContact: formData.emergencyContact,
      selectedSlots: formData.selectedSlots,
      registrationDate: new Date().toISOString(),
      status: "pending" as const,
      assignedShifts: 0
    };

    console.log("Volunteer signup data:", volunteerData);

    // Save to JSON
    const saved = saveVolunteerData(volunteerData);

    if (saved) {
      toast({
        title: "Registration Successful!",
        description: "Thank you for signing up. We'll contact you within 24 hours with next steps.",
      });
    } else {
      toast({
        title: "Error",
        description: "There was an issue saving your registration. Please try again.",
        variant: "destructive"
      });
    }

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      availability: "",
      skills: [],
      experience: "",
      transportation: "",
      emergencyContact: "",
      selectedSlots: []
    });
    setStep(1);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Food Pickup": return "text-green-700 bg-green-100";
      case "Food Sorting": return "text-blue-700 bg-blue-100";
      case "Delivery": return "text-purple-700 bg-purple-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  if (step === 1) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Volunteer Information
          </CardTitle>
          <CardDescription>
            Tell us about yourself so we can match you with the right opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">General Availability</Label>
            <Select value={formData.availability} onValueChange={(value) => handleInputChange("availability", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your general availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekday-mornings">Weekday Mornings</SelectItem>
                <SelectItem value="weekday-afternoons">Weekday Afternoons</SelectItem>
                <SelectItem value="weekday-evenings">Weekday Evenings</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Skills & Interests (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {["Driving", "Heavy Lifting", "Customer Service", "Organization", "Language Skills", "Food Safety"].map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <Label htmlFor={skill} className="text-sm">{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportation">Do you have reliable transportation?</Label>
            <Select value={formData.transportation} onValueChange={(value) => handleInputChange("transportation", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select transportation option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Personal Car</SelectItem>
                <SelectItem value="truck">Truck/Van</SelectItem>
                <SelectItem value="public">Public Transportation</SelectItem>
                <SelectItem value="none">No Transportation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Previous Volunteer Experience (optional)</Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              placeholder="Tell us about any relevant volunteer or work experience..."
              rows={3}
            />
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!formData.firstName || !formData.lastName || !formData.email}
          >
            Continue to Schedule Selection
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 2) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Select Your Volunteer Shifts
          </CardTitle>
          <CardDescription>
            Choose from available time slots that match your schedule. You can select multiple shifts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockTimeSlots.map((slot) => (
              <div
                key={slot.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.selectedSlots.includes(slot.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => handleSlotToggle(slot.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(slot.type)}`}>
                        {slot.type}
                      </span>
                      {formData.selectedSlots.includes(slot.id) && (
                        <Check className="w-4 h-4 text-green-600 ml-2" />
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {formatDate(slot.date)}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {slot.time}
                    </div>
                    <div className="text-sm text-gray-600">{slot.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {slot.slotsAvailable}/{slot.totalSlots} spots
                    </div>
                    <div className="text-xs text-gray-500">available</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.selectedSlots.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">
                Selected Shifts ({formData.selectedSlots.length})
              </h4>
              <div className="space-y-1">
                {formData.selectedSlots.map(slotId => {
                  const slot = mockTimeSlots.find(s => s.id === slotId);
                  return (
                    <div key={slotId} className="text-sm text-green-700">
                      {slot && `${formatDate(slot.date)} • ${slot.time} • ${slot.type}`}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back to Information
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={formData.selectedSlots.length === 0}
            >
              Complete Registration
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default VolunteerSignup;
