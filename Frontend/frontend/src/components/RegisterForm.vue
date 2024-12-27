<template>
    <div>
      <form @submit.prevent="handleRegister">
        <div>
          <label>Kasutajanimi:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label>Parool:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Registreeri</button>
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
      async handleRegister() {
        try {
          const response = await fetch("http://localhost:8080/users", { // Kontrollime, kas see aadress on õige
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              UserName: this.username.trim(),
              Password: this.password.trim(),
            }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            alert("Registreerimine õnnestus!");
            this.$emit("switchView", "login"); // Võimaldab tagasi sisselogimise vaatesse liikuda
          } else {
            alert(data.message || "Registreerimine ebaõnnestus.");
          }
        } catch (error) {
          console.error("Viga registreerimisel:", error);
        }
      },
    },
  };
  </script>
  