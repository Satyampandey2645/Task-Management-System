export const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  };
  
  export const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };
  