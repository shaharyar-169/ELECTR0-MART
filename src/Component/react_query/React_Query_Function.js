import React from "react";
import { useQuery } from "react-query";

const apiLinks =
  "https://crystalsolutions.com.pk/umair_electronic/web/ChartOfAccount.php";
export const fetchData = async (apiLinks) => {
  const response = await fetch(apiLinks);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const jsonData = await response.json();
  return jsonData;
};
