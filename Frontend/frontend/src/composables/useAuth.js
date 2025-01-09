import { ref, computed } from "vue";

const user = ref(null);
const isAuthenticated = ref(!!localStorage.getItem("token"));

const login = (token, userData) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));
  user.value = userData;
  isAuthenticated.value = true;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  user.value = null;
  isAuthenticated.value = false;
};

const updateAuthState = () => {
  isAuthenticated.value = !!localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  user.value = savedUser ? JSON.parse(savedUser) : null;
};

const isAdmin = computed(() => user.value?.UserName?.toLowerCase() === "admin");

export function useAuth() {
  return {
    user,
    isAuthenticated,
    isAdmin, // Admin staatuse tuvastamine
    login,
    logout,
    updateAuthState,
  };
}
