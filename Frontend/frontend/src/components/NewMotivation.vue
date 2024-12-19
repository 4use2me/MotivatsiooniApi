<template>
  <div>
    <input
      v-model="quote"
      type="text"
      placeholder="Sisesta motivatsioonitsitaat"
      class="form-control mb-2"
    />
    <button @click="createMotivation" class="btn btn-primary">
      Salvesta motivatsioon
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quote: "",
    };
  },
  methods: {
    async createMotivation() {
      if (!this.quote) {
        alert("Palun sisesta tsitaat!");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/motivations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Quote: this.quote,
            Likes: 0, // Algväärtusena 0
            UserID: 1, // Asenda see reaalsete andmetega
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Motivatsioon lisatud!");
          this.$emit("motivationCreated", result.MotivationID);
          this.quote = ""; // Tühjenda sisend pärast lisamist
        } else {
          alert("Motivatsiooni lisamine ebaõnnestus");
        }
      } catch (error) {
        alert("Ühendus ebaõnnestus");
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
/* Soovi korral lisa stiile */
</style>
