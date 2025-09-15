import {
  getAuthentificatedState,
  getAuthentificatedUserId  
} from "./CookiesUtils.js";

export const checkAuthStatus = async () => {
  return (
    getAuthentificatedState() === "true" &&
    getAuthentificatedUserId() !== undefined
  );
};

export const checkAuthentication = async (setIsAuthenticated, location) => {
  try {
    // Perform your asynchronous operation here
    const authStatus =
      location.state?.isAuthenticated || (await checkAuthStatus());
    setIsAuthenticated(authStatus);
    console.log('TRY')
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
};
