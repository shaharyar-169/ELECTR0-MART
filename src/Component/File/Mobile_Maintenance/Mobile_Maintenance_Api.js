// apiService.js
import axios from "axios";

// Fetch data from GetTechnician.php
export const fetchMobile = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/complaint/GetMobile.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
