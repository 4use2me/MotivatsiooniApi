<template>
    <div class="login-container">
      <h2>Logi sisse</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Kasutajanimi:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div>
          <label for="password">Parool:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Logi sisse</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoginView",
    data() {
      return {
        username: "",
        password: "",
      };
    },
    methods: {
      async handleLogin() {
        if (!this.username || !this.password) {
          alert("Palun sisesta nii kasutajanimi kui ka parool!");
          return;
        }
  
        try {
          const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              UserName: this.username,
              Password: this.password,
            }),
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert(result.message); // Logimine õnnestus
            console.log("Kasutaja info:", result.user);
            // Võid siia lisada koodi suunamiseks teisele lehele, näiteks:
            // this.$router.push("/dashboard");
          } else {
            alert(result.error); // Vale kasutajanimi või parool
          }
        } catch (error) {
          alert("Ühendus ebaõnnestus");
          console.error("Ühendustõrge:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .login-container h2 {
    text-align: center;
  }
  
  .login-container div {
    margin-bottom: 15px;
  }
  
  .login-container label {
    display: block;
    margin-bottom: 5px;
  }
  
  .login-container input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  </style>
  