import { ref } from "vue";

const user = ref(null);
const isAuthenticated = ref(!!localStorage.getItem("token")); 

const login = (token, userData) => {
  localStorage.setItem("token", token); 
  user.value = userData; 
  isAuthenticated.value = true; 
};

const logout = () => {
  console.log("Logging out..."); // Debug
  localStorage.removeItem("token");
  user.value = null;
  isAuthenticated.value = false;
};

const updateAuthState = () => {
  console.log("Updating auth state..."); // Debug
  isAuthenticated.value = !!localStorage.getItem("token");
};

export function useAuth() {
  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateAuthState,
  };
}