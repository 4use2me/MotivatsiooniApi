
<template>
    <div class="auth-container">
    <div class="backbox">
      <div class="loginMsg" :class="{ visibility: showSignup }">
        <div class="textcontent">
          <p class="title">Sul ei ole kontot?</p>
          <p>Loo kasutaja ja hakka motiveerijaks.</p>
          <button @click="toggleView">Registreeri</button>
        </div>
      </div>
      <div class="signupMsg" :class="{ visibility: !showSignup }">
        <div class="textcontent">
          <p class="title">Sa oled juba kasutaja?</p>
          <p>Sisene, et näha oma motivatsiooni kollektsiooni.</p>
          <button @click="toggleView">Sisene</button>
        </div>
      </div>
    </div>

    <div class="frontbox" :class="{ moving: showSignup }">
      <div class="login" v-show="!showSignup">
        <h2>Logi sisse</h2>
        <LoginForm @loginSuccess="handleLoginSuccess" />
      </div>
      <div class="signup" v-show="showSignup">
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
  data() {
    return {
      showSignup: false, // Determines which view to display
    };
  },
  methods: {
    toggleView() {
      this.showSignup = !this.showSignup;
    },
    async handleLoginSuccess({ token, UserName }) {
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650px;
  height: 400px;
  display: inline-flex;
  font-family: 'Roboto', sans-serif;
}

.backbox {
  background-color: #18310C;
  width: 100%;
  height: 80%;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  display: inline-flex;
}

.frontbox {
  background-color: white;
  border-radius: 20px;
  height: 100%;
  width: 50%;
  z-index: 10;
  position: absolute;
  right: 0;
  margin-right: 3%;
  margin-left: 3%;
  transition: right 0.8s ease-in-out;
}

.frontbox.moving {
  right: 45%;
}

.loginMsg,
.signupMsg {
  width: 50%;
  height: 100%;
  font-size: 15px;
  box-sizing: border-box;
  color: white;
}

.textcontent {
  margin-top: 65px;
  margin-left: 12%;
}

.textcontent .title {
  font-weight: 300;
  font-size: 23px;
}

.loginMsg p,
.signupMsg p {
  font-weight: 100;
}

.loginMsg button,
.signupMsg button {
  background-color: #18310C;
  border: 2px solid white;
  border-radius: 10px;
  color: white;
  font-size: 12px;
  font-weight: 300;
  padding: 10px;
  margin-top: 20px;
  cursor: pointer;
}

.login,
.signup {
  padding: 20px;
  text-align: center;
}

.login h2,
.signup h2 {
  color: #3f7d20;
  font-size: 22px;
}

.inputbox {
  margin-top: 30px;
}

.login p {
  cursor: pointer;
  color: #404040;
  font-size: 15px;
}

.visibility {
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}
 

  </style>
  
  