import Cookies from "js-cookie";

// Function to set cookies for authenticatedUserId and accessToken
export function setAuthCookies(
  authenticatedUserId,
  accessToken,
  refreshToken,
  authentificatedState,
  role,
  ClinicID,
  StationID
) {
  // Set cookies with a specific expiration time
  const expires = 30; // days
  Cookies.set("authenticatedUserId", authenticatedUserId, { expires });
  Cookies.set("accessToken", accessToken, { expires });
  Cookies.set("refreshToken", refreshToken, { expires });
  Cookies.set("authentificatedState", authentificatedState, { expires });
  Cookies.set("role", role, { expires });
  Cookies.set("ClinicID", ClinicID, { expires });
  Cookies.set("StationID", StationID, { expires });
  
}

export function setUserNameCookies(username) {
  const expires = 30; // days
  Cookies.set("username", username, { expires });
}
export function setUserEmailCookies(email) {
  const expires = 30; // days
  Cookies.set("email", email, { expires });
}

export function setAuthentificatedState(value) {
  const expires = 30; // days
  Cookies.set("authentificatedState", value, { expires });
}

export function setSystemLanguage(newLanguage) {
  Cookies.set("language", newLanguage);
}

export function setRole(newRole) {
  const expires = 30; // days
  Cookies.set("role", newRole, { expires });
}

export function setClinicID(id) {
  const expires = 30; // days
  Cookies.set("ClinicID", id, { expires });
}

export function setStationID(id) {
  const expires = 30; // days
  Cookies.set("StationID", id, { expires });
}

// Function to get cookies for authenticatedUserId and accessToken
export function getAuthCookies() {
  return {
    authenticatedUserId: Cookies.get("authenticatedUserId"),
    accessToken: Cookies.get("accessToken"),
  };
}

export function getAuthentificatedUserId() {
  return Cookies.get("authenticatedUserId");
}

export function getAuthentificatedEmail() {
  return Cookies.get("email");
}


export function getAuthentificatedState() {
  return Cookies.get("authentificatedState");
}

export function getAccessToken() {
  return Cookies.get("accessToken") || null;
}

export function getRefreshToken() {
  return Cookies.get("refreshToken") || null;
}

export function getLanguage() {
  return Cookies.get("language") || "en";
}

export function getRole() {
  return Cookies.get("role") || "user";
}

export function getClinicID() {
  return Cookies.get("ClinicID") || "-1";
}

export function getStationID() {
  return Cookies.get("StationID") || "-1";
}

export function getUserNameCookies() {
  return Cookies.get("username") || null;
}

export function updateAccessToken(newAccessToken) {
  const expires = 3000; // days
  Cookies.set("accessToken", newAccessToken, { expires });
}

export function updateRefreshToken(newRefreshToken) {
  const expires = 3000; // days
  Cookies.set("refreshToken", newRefreshToken, { expires });
}
// Function to delete cookies for authenticatedUserId, authentificatedState and accessToken
export function clearAuthCookies() {
  Cookies.remove("authenticatedUserId");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("authentificatedState");
  Cookies.remove("role");
}
