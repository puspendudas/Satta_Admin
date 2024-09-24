// src/utils/auth.js

// Function to check if the user is authenticated
export const isAuthenticated = () => {
  // Retrieve the JWT token from local storage
  const token = localStorage.getItem('token');

  // Check if the token exists and is not expired
  if (token) {
    // Decode the token to get the expiration time
    const decodedToken = parseJwt(token);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    // Check if the token is expired
    return decodedToken.exp > currentTime;
  }

  return false; // Return false if token does not exist or is expired
};

// Function to get user data 
export const getUserData = () => {  
  // Get the mobile from local storage
  const mobile = localStorage.getItem('mobile');
  return JSON.parse(mobile)
}

// Function to save token data into local storage
export const saveAuthenticated = (data) => {
  const token = data?.tokenData.token
  const role = data?.data.type
  // const mobile = data?.data.mobile
  // Save the token into local storage
  localStorage.setItem('token', token)
  localStorage.setItem('role', role)
  // Save the mobile into local storage
  // localStorage.setItem('mobile', mobile)
}

// Function to save token data into local storage
export const deleteAuthentication = () => {
  // const mobile = data?.data.mobile
  // Save the token into local storage
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  // Save the mobile into local storage
  // localStorage.setItem('mobile', mobile)
}


// Helper function to parse JWT token
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return {};
  }
};
