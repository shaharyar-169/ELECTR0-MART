// apiService.js
import axios from "axios";

// Fetch data from NewTechnician.php
export const fetchNewTechnicianData = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/complaint/NewTechnician.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching new technician data:", error);
    throw error;
  }
};

// Fetch data from GetTechnician.php
export const fetchTechnicians = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/umair_electronic/web/GetAccounts.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
