// apiService.js
import axios from "axios";

// Fetch data from NewTechnician.php
export const fetchNewCompanyData = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/umair_electronic/web/NewCapacity.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching new technician data:", error);
    throw error;
  }
};

// Fetch data from GetTechnician.php
export const fetchCompany = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/umair_electronic/web/GetCapacity.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
