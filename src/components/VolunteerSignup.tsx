import { useState } from 'react';
import { saveVolunteerData } from '../utils/dataManager';
import { useToast } from '../hooks/use-toast';

const VolunteerSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    availability: '',
    skills: [],
    experience: '',
    transportation: '',
    emergencyContact: '',
    selectedSlots: []
  });
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSlotToggle = (slotId) => {
    setFormData((prev) => ({
      ...prev,
      selectedSlots: prev.selectedSlots.includes(slotId)
        ? prev.selectedSlots.filter((s) => s !== slotId)
        : [...prev.selectedSlots, slotId]
    }));
  };

  const handleSubmit = () => {
    const volunteerData = {
      id: Date.now().toString(),
      ...formData,
      registrationDate: new Date().toISOString(),
      status: 'pending',
      assignedShifts: 0
    };

    const saved = saveVolunteerData(volunteerData);
    if (saved) {
      toast({
        title: 'Registration Successful!',
        description: "Thank you for signing up. We'll contact you within 24 hours."
      });
    } else {
      toast({
        title: 'Error',
        description: 'There was an issue saving your registration.',
        variant: 'destructive'
      });
    }

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      availability: '',
      skills: [],
      experience: '',
      transportation: '',
      emergencyContact: '',
      selectedSlots: []
    });
    setStep(1);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      {step === 1 && (
        <form className="space-y-4">
          <h2 className="text-xl font-semibold">Volunteer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">First Name</label>
              <input
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Last Name</label>
              <input
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select availability</option>
              <option value="weekday-mornings">Weekday Mornings</option>
              <option value="weekday-afternoons">Weekday Afternoons</option>
              <option value="weekends">Weekends</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Skills</label>
            <div className="grid grid-cols-2 gap-2">
              {['Driving', 'Lifting', 'Customer Service', 'Language Skills'].map((skill) => (
                <label key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="mr-2"
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Experience</label>
            <textarea
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.firstName || !formData.lastName || !formData.email}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Volunteer Shifts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Mon 9am-12pm', 'Tue 2pm-5pm', 'Wed 10am-1pm'].map((slot, idx) => (
              <div
                key={idx}
                className={`p-4 border rounded cursor-pointer ${formData.selectedSlots.includes(slot) ? 'bg-green-100 border-green-500' : ''}`}
                onClick={() => handleSlotToggle(slot)}
              >
                <p className="font-medium">{slot}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={formData.selectedSlots.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerSignup;
