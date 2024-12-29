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
      <p id="likes-count">{{ randomMotivation.Likes }}</p>
    </div>
    <!-- Button to Fetch New Random Quote -->
    <div class="refresh">
        <button @click="fetchRandomMotivation" class="refresh-button">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
    </div>
  </div>

</template>


<style scoped>
blockquote{
    font-size: xx-large;
    margin-bottom: 42px;
}

.quote-container {
  background-color: #18310c;
  box-shadow: 2px 2px 5px #18310c;
  text-align: center;
  font-size: 1.5em;
  margin: 20px 0;
  padding: 10px;
  color: #d4b6d1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%; 
}

.like-container {
  display: flex;
  bottom: 0px;
  right: 16px;
  position: absolute;
  gap: 2px;
}
.heart-icon {
  font-size: 1.5em;
  cursor: pointer;
  color: gray;
  transition: color 0.3s ease;
}
.heart-icon.liked {
  color: #fb4b4e;
}
.refresh{
    display: flex;
    justify-content: flex-start;
}

.refresh-button {
  background-color: #3f7d20;
  color: white;
  padding: 6px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;

}

.refresh-button:hover {
  background-color: #316119;
}

#likes-count {
  margin-top: 22px;
  margin-bottom: 0;
}
</style>