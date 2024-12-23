<template>
  <div>
    <form @submit.prevent="submitEdit">
      <label for="user">Muuda kasutajat:</label>
      <input
        type="text"
        id="user"
        v-model="updatedUser.UserName" 
        required
      />
      <input
        type="text"
        id="user"
        v-model="updatedUser.Password" 
        required
      />
      <button type="submit">Salvesta</button>
      <button type="button" @click="cancelEdit">Tühista</button>
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

<style>
.error {
  color: red;
  font-weight: bold;
}
</style>
