<template>
    <div>
      <form @submit.prevent="handleRegister">
        <div class="inputbox">
          <input type="text" placeholder="Kasutajanimi" v-model="username" required />
        </div>
        <div>
          <input type="password" placeholder="Parool" v-model="password" required />
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

<style scoped>
    button {
      background-color: #3f7d20;
      color:white;
      border: none;
      font-size: 12px;
      font-weight: 300;
      box-sizing: content-box;
      padding:10px;
      border-radius: 10px;
      width: 60px;
      position: absolute;
      right:30px;
      bottom: 30px;
      cursor: pointer;
    }

    .login, .signup{
  padding: 20px;
  text-align: center;
}

.inputbox{
  margin-top:30px; 
}
input {
  display: block;
  width: 100%;
  height: 40px;
  background-color: #f2f2f2;
  border: none;
  margin-bottom:20px;
  padding-left: 10px;
  font-size: 12px;
}
  </style>
  