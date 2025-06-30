
interface VolunteerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  availability: string;
  skills: string[];
  experience: string;
  transportation: string;
  emergencyContact: string;
  selectedSlots: string[];
  registrationDate: string;
  status: "pending" | "approved" | "active";
  assignedShifts: number;
}

interface AdminUser {
  email: string;
  loginDate: string;
}

export const saveVolunteerData = (volunteerData: VolunteerData) => {
  try {
    const existingData = localStorage.getItem('volunteers');
    const volunteers: VolunteerData[] = existingData ? JSON.parse(existingData) : [];
    
    volunteers.push(volunteerData);
    
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
    
    // Also save as downloadable JSON file
    const dataStr = JSON.stringify(volunteers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    console.log('Volunteer data saved:', volunteerData);
    return true;
  } catch (error) {
    console.error('Error saving volunteer data:', error);
    return false;
  }
};

export const getVolunteersData = (): VolunteerData[] => {
  try {
    const existingData = localStorage.getItem('volunteers');
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error('Error loading volunteer data:', error);
    return [];
  }
};

export const updateVolunteerStatus = (id: string, status: "pending" | "approved" | "active") => {
  try {
    const volunteers = getVolunteersData();
    const updatedVolunteers = volunteers.map(vol => 
      vol.id === id ? { ...vol, status } : vol
    );
    
    localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
    return true;
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    return false;
  }
};

export const saveAdminLogin = (email: string) => {
  try {
    const existingData = localStorage.getItem('adminLogins');
    const adminLogins: AdminUser[] = existingData ? JSON.parse(existingData) : [];
    
    const newLogin: AdminUser = {
      email,
      loginDate: new Date().toISOString()
    };
    
    adminLogins.push(newLogin);
    
    localStorage.setItem('adminLogins', JSON.stringify(adminLogins));
    
    console.log('Admin login saved:', newLogin);
    return true;
  } catch (error) {
    console.error('Error saving admin login:', error);
    return false;
  }
};

export const downloadVolunteersJSON = () => {
  try {
    const volunteers = getVolunteersData();
    const dataStr = JSON.stringify(volunteers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(dataBlob);
    link.setAttribute('href', url);
    link.setAttribute('download', `volunteers_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading volunteers JSON:', error);
  }
};

export const downloadAdminLoginsJSON = () => {
  try {
    const existingData = localStorage.getItem('adminLogins');
    const adminLogins = existingData ? JSON.parse(existingData) : [];
    const dataStr = JSON.stringify(adminLogins, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(dataBlob);
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_logins_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading admin logins JSON:', error);
  }
};
