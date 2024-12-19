<template>
  <div>
    <form @submit.prevent="submitMotivation">
      <div>
        <label for="quote">Tsitaat:</label>
        <input
          type="text"
          id="quote"
          v-model="quote"
          placeholder="Sisesta tsitaat"
          required
        />
      </div>
      <button type="submit">Salvesta</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quote: '', // Motivatsiooni tsitaat
    };
  },
  methods: {
    async submitMotivation() {
      const token = localStorage.getItem('token'); // Token localStorage'st
      const userId = this.$route.params.userId || 1; // Kasutaja ID (või vaikimisi 1, kui pole saadaval)

      const newMotivation = {
        Quote: this.quote,
        Likes: 1, // Meeldimiste arvu vaikimisi väärtus
        UserID: userId,
      };

      try {
        const response = await fetch('http://localhost:8080/motivations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMotivation),
        });

        if (!response.ok) {
          console.error('Motivatsiooni salvestamine ebaõnnestus');
          return;
        }

        this.quote = ''; // Vorm tühjaks

        // Emit sündmus, et teavitada vanemat komponenti
        this.$emit('motivationCreated');
      } catch (error) {
        console.error('Viga motivatsiooni salvestamisel:', error);
      }
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
button {
  align-self: flex-start;
}
</style>
