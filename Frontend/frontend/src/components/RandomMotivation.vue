<script>
export default {
  data() {
    return {
      randomMotivation: null, // Hoidla juhuslikule tsitaadile
      isLiked: false, // Kas tsitaat on meeldivaks märgitud
    };
  },
  async created() {
    // Lae juhuslik tsitaat lehe laadimisel
    await this.fetchRandomMotivation();
  },
  methods: {
    // Laadib juhusliku tsitaadi serverist
    async fetchRandomMotivation() {
      try {
        const response = await fetch("http://localhost:8080/motivations/random");
        if (!response.ok) throw new Error("Tsitaadi laadimine ebaõnnestus");

        const data = await response.json();
        console.log("Laetud tsitaat:", data);
        this.randomMotivation = data;
        this.isLiked = false; // Resetime meeldivaks märkimise staatuse
      } catch (error) {
        console.error("Viga tsitaadi laadimisel:", error);
        this.randomMotivation = { Quote: "Praegu ei õnnestunud tsitaati laadida.", Likes: 1 };
        this.isLiked = false;
      }
    },

    // Lülitab meeldivaks märkimise staatuse ja uuendab serverit
    async toggleLike() {
      if (!this.randomMotivation || !this.randomMotivation.MotivationID) {
        console.error("Puudub tsitaat või selle ID");
        return;
      }
      console.log("RandomMotivation ID:", this.randomMotivation?.MotivationID);

      try {
        const response = await fetch(
          `http://localhost:8080/motivations/${this.randomMotivation.MotivationID}/like`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Meeldivaks märkimine ebaõnnestus");

        const { likes } = await response.json();
        this.randomMotivation.Likes = likes; // Uuenda lokaalselt meeldimiste arvu
        this.isLiked = true; // Näita, et tsitaat on meeldivaks märgitud
      } catch (error) {
        console.error("Viga meeldivaks märkimisel:", error);
      }
    },
  },
};
</script>

<template>

    <!-- Random Quote Display -->
    <div v-if="randomMotivation" class="quote-container">
      <blockquote>
        "{{ randomMotivation.Quote }}"
      </blockquote>
      <div class="like-container">
        <span 
            :class="['heart-icon', { liked: isLiked }]" 
            @click="toggleLike"
        >
            <i class="fas fa-heart"></i>
        </span>
      <p>Likes: {{ randomMotivation.Likes }}</p>
    </div>
  </div>

    <!-- Button to Fetch New Random Quote -->
     <div class="refresh">
        <button @click="fetchRandomMotivation" class="refresh-button">
            Näita veel!
        </button>
    </div>
</template>

<style scoped>
blockquote{
    font-size: xx-large;
}
.quote-container {
   text-align: center;
  font-size: 1.5em;
  margin: 20px 0;
  padding: 10px;
  color: #6a21b3;
}
.like-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.heart-icon {
  font-size: 1.5em;
  cursor: pointer;
  color: gray;
  transition: color 0.3s ease;
}
.heart-icon.liked {
  color: red;
}
.refresh{
    display: flex;
    justify-content: center;
}

.refresh-button {
  background-color: #42b983;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  font-size: 1em;
  margin-bottom: 20px;
}

.refresh-button:hover {
  background-color: #369870;
}
</style>