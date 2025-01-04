
<template>
    <div>
      <form class="row g-3" @submit.prevent="submitEdit">
        <div class="col input-group">
          <span class="input-group-text">Muuda kasutajat</span>
          <input type="text" id="user" class="form-control" v-model="updatedUser.UserName" 
          required>
          <input type="text" class="form-control" id="user"
          v-model="updatedUser.Password" 
          required>
        </div>
        <div class="col-6">
          <button class="btn save-button" type="submit"><i class="fa-regular fa-floppy-disk"></i></button>
          <button class="btn" type="button" @click="cancelEdit"><i class="fa-regular fa-rectangle-xmark"></i></button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        updatedUser: {}, // Algväärtusta tühjana
        error: null, // Veateadete kuvamiseks
      };
    },
    watch: {
      user: {
        immediate: true,
        handler(newUser) {
          // Uuenda updatedUser, kui props-i väärtus muutub
          this.updatedUser = { ...newUser };
        },
      },
    },
    
    methods: {
      async submitEdit() {
      this.error = null;
  
      if (!this.updatedUser.UserName || !this.updatedUser.Password) {
        this.error = "Kasutajanimi ja parool ei tohi olla tühjad.";
        return;
      }
  
      if (!this.updatedUser.UserID) {
        this.error = "Kasutaja ID puudub. Ei saa andmeid uuendada.";
      return;
    }
  
      const token = localStorage.getItem("token");
      if (!token) {
        this.error = "Autoriseerimistoken puudub. Logige uuesti sisse.";
        return;
      }
  
      try {
        const { UserID, UserName, Password } = this.updatedUser;
  
        console.log("Saadetav kasutaja:", { UserID, UserName, Password });
  
        const response = await fetch(`http://localhost:8080/users/${UserID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ UserID, UserName, Password }),
        });
  
        if (response.ok) {
          console.log("Kasutaja uuendatud:", await response.json());
          this.$emit("userUpdated");
        } else {
          const errorData = await response.text(); // Logi serveri vastus
          console.error("Serveri viga:", errorData);
          this.error = "Kasutaja muutmine ebaõnnestus. Kontrolli serveri logisid.";
        }
        
      } catch (error) {
        console.error("Viga kasutaja muutmisel:", error);
        this.error = "Serveri viga kasutaja muutmisel.";
      }
    },
  
      cancelEdit() {
        this.$emit("cancelEdit"); // Teavita vanemkomponenti, et muutmine katkestati
      },
    },
  };
  </script>
  

  
  <style scoped>
  .error {
    color: red;
    font-weight: bold;
  }
.btn {
    background-color: var(--vt-c-dark);
    box-shadow: 2px 2px 5px var(--vt-c-dark);
    color: white;
    margin-right: 6px;
    font-size: x-large;
    padding: 0px 6px 0px 6px;
  }
.btn:hover {
    background-color: #51294D;
  }
.quote{
  display: flex;
}

.save-button {
      background-color: var(--button-bg, #3f7d20);
      color: white;
      box-shadow: 2px 2px 5px #18310c;
    }
    .save-button:hover{
      background-color: var(--button-bg-hover, #18310c);
    }
</style>

  