import { BASE_URL } from "./components/Constant";

export const parseJwt = () => {
  let token = localStorage.getItem("token");
  if (token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }
  return undefined;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const httpClient = async (url, type, obj) => {
  try {
    type = type.toUpperCase();
    if (type.toLowerCase() === "get" && obj) {
      var params = Object.keys(obj)
        .map(function (key) {
          return key + "=" + obj[key];
        })
        .join("&");
      url += "?" + params;
      obj = undefined;
    }
    let apiUrl = BASE_URL;
    let res = await fetch(apiUrl + url, {
      method: type.toUpperCase(),
      body: JSON.stringify(obj),
      headers: {
        token: getToken(),
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await res.json();
  } catch (error) {
    console.group(`API ${type} Error`);
    console.error(error);
    console.groupEnd();
    throw error;
  }
};

export const getExpenseStatus = (status) => {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "archived":
      return "Archived";
    default:
      return "On Hold";
  }
};

export const getTimesheetStatus = (status) => {
  switch (status) {
    case "withEmployer":
      return "Submitted";
    case "withApprover":
      return "On Hold";
    case "Approved":
      return "Approved";
    case "Archived":
      return "Archived";
  }
};
