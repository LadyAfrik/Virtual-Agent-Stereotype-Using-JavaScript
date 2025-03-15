const AuthService = {
  getToken: () => localStorage.getItem("token"),
  logout: () => localStorage.removeItem("token"),
  isAuthenticated: () => !!localStorage.getItem("token"),
};

export default AuthService;
