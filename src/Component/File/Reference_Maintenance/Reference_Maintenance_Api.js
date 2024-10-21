// apiService.js
import axios from "axios";

// Fetch data from NewTechnician.php
export const fetchNewReferenceData = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/complaint/NewReference.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching new technician data:", error);
    throw error;
  }
};

// Fetch data from GetTechnician.php
export const fetchReference = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/complaint/GetReference.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
