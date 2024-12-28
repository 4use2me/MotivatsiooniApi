<template>
  <div>
    <form @submit.prevent="handleLogin">
      <div class="inputbox">
          <input type="text" placeholder="Kasutajanimi" v-model="username" required />
          <input type="password" placeholder="Parool" v-model="password" required />
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
