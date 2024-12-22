<template>
  <div class="auth-container">
    <div class="forms">
      <div class="form login-form">
        <h2>Logi sisse</h2>
        <LoginForm @loginSuccess="handleLoginSuccess" />
      </div>
      <div class="form register-form">
        <h2>Registreeru</h2>
        <RegisterForm />
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  name: "AuthView",
  components: {
    LoginForm,
    RegisterForm,
  },
  methods: {
    async handleLoginSuccess({ token, UserName }) {
      // Salvesta token
      localStorage.setItem("token", token);

      // Kontrolli, kas kasutajanimi on "admin"
      if (UserName === "admin") {
        this.$router.push("/admin"); // Admini vaade
      } else {
        this.$router.push("/user"); // Tavakasutaja vaade
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 2rem auto;
}

.forms {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.form {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

h2 {
  text-align: center;
}
</style>
