<template>
    <div>
      <form @submit.prevent="handleLogin">
        <div>
          <label>Kasutajanimi:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label>Parool:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Logi sisse</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
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
  
            // Salvesta token localStorage'i
            localStorage.setItem("token", result.token);
  
            // Kontrolli, kas kasutaja on admin
            if (this.username.toLowerCase() === "admin") {
              this.$router.push({ name: "AdminView" }); // Admini vaatesse
            } else {
              this.$router.push({
                name: "LoggedInUserView",
                params: { username: result.user.UserName }, // Saada kasutajanimi
              });
            }
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