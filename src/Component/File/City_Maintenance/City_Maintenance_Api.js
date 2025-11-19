// apiService.js
import axios from "axios";

// Fetch data from NewTechnician.php
export const fetchNewCityData = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/complaint/NewCity.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching new technician data:", error);
    throw error;
  }
};

// Fetch data from GetTechnician.php
export const fetchCity = async () => {
  try {
    const response = await axios.get(
      "https://crystalsolutions.com.pk/complaint/GetCity.php"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    throw error;
  }
};
