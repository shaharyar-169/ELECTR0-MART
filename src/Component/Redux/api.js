const apiLink = "https://crystalsolutions.com.pk/api/";

export const fetchDataMenu = async (userId, code) => {
  const response = await fetch(`${apiLink}GetUserMenu.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ FUsrId: userId, code }).toString(),
  });

  const data = await response.json();
  const filteredData = data.filter((item) => item.Permission !== "S");
  if (!response.ok) throw new Error(data.message);

  return filteredData;
};
export const fetchDataGetUser = async (code) => {
  const response = await fetch(`${apiLink}GetUser.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code: code }).toString(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);

  return data;
};
