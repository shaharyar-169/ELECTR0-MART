// apiService.js
import axios from "axios";

// Fetch data from NewTechnician.php
export const fetchNewComplainData = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/complaint/NewComplaint.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching new technician data:", error);
    throw error;
  }
};

// Fetch data from GetTechnician.php
export const fetchComplain = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/complaint/GetComplaint.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
