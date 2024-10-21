import axios from "axios";

export const getcompanyData = async (data) => {
  const formData = new URLSearchParams(data).toString();

  try {
    const response = await axios.post(
      "https://crystalsolutions.com.pk/api/GetUser.php",
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
