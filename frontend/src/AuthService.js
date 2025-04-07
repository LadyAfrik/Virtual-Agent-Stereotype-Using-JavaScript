const AuthService = {
  // Retrieves the token from localStorage
  getToken: () => localStorage.getItem("token"),

  // Removes the token from localStorage (logs the user out)
  logout: () => localStorage.removeItem("token"),

  // Checks if the user is authenticated by verifying if a token exists in localStorage
  isAuthenticated: () => !!localStorage.getItem("token"), // !! converts the value to a boolean (true if token exists, false otherwise)
};

export default AuthService;
