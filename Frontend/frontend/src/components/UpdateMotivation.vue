<template>
  <div>
    <form @submit.prevent="submitEdit">
      <label for="quote">Muuda tsitaat:</label>
      <input
      type="text"
      id="quote"
      v-model="updatedMotivation.Quote"
    />
      <button type="submit">Salvesta</button>
      <button type="button" @click="cancelEdit">Tühista</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    motivation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      updatedMotivation: { ...this.motivation }, // Algväärtusta props-i põhjal
    };
  },
  watch: {
    motivation: {
      immediate: true,
      handler(newMotivation) {
        // Jälgi props-i muudatusi ja uuenda updatedMotivation
        this.updatedMotivation = { ...newMotivation };
      },
    },
  },
  methods: {
    async submitEdit() {
      if (!this.updatedMotivation.MotivationID) {
        console.error("Motivatsiooni ID puudub:", this.updatedMotivation);
        return;
      }

      const { MotivationID, Quote, Likes, UserID } = this.updatedMotivation; // Valitud väljad
      const token = localStorage.getItem("token");
      try {
        console.log("Saadetav motivatsioon:", { MotivationID, Quote, Likes, UserID });
        const response = await fetch(`http://localhost:8080/motivations/${MotivationID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ MotivationID, Quote, Likes, UserID }),
        });

        if (response.ok) {
          console.log("Motivatsioon uuendatud:", await response.json());
          this.$emit("motivationUpdated"); // Teavita vanemkomponenti
        } else {
          console.error("Motivatsiooni muutmine ebaõnnestus", await response.json());
        }
      } catch (error) {
        console.error("Viga motivatsiooni muutmisel", error);
      }
    },
    cancelEdit() {
      this.$emit("cancelEdit"); // Teavita vanemkomponenti, et muutmine katkestati
    },
  },
};
</script>
