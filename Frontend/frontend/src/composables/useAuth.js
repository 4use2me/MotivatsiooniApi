import { ref } from "vue";

const isAuthenticated = ref(!!localStorage.getItem("token")); 

const login = (token) => {
  localStorage.setItem("token", token);
  isAuthenticated.value = true; 
};

const logout = () => {
  console.log("Logging out..."); // Debug
  localStorage.removeItem("token");
  isAuthenticated.value = false;
};

const updateAuthState = () => {
  console.log("Updating auth state..."); // Debug
  isAuthenticated.value = !!localStorage.getItem("token");
};

export function useAuth() {
  return {
    isAuthenticated,
    login,
    logout,
    updateAuthState,
  };
}