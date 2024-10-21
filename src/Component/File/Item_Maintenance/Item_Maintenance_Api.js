import axios from "axios";

export const getcompanyData = async (data) => {
  const formData = new URLSearchParams(data).toString();

  try {
    const response = await axios.post(
      "https://crystalsolutions.com.pk/csorder3/files/companymaintenance/GetCompany.php",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const newCompanyData = async (data) => {
  const formData = new URLSearchParams(data).toString();

  try {
    const response = await axios.post(
      `https://crystalsolutions.com.pk/csorder3/files/companymaintenance/NewCompany.php`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
