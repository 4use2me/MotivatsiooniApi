<script>
export default {
  data() {
    return {
      randomMotivation: null, // Laetud tsitaat
      isLiked: false, // Kas tsitaat on meeldinud
      isFavorited: false, // Kas tsitaat on lemmikuks lisatud
      favoriteMessage: "", // Teade lemmikuks lisamise kohta
      isLoggedIn: false, // Kas kasutaja on sisse logitud
    };
  },
  created() {
    this.updateLoginStatus(); // Kontrollime sisselogimise staatust
    this.fetchRandomMotivation(); // Lae esimene tsitaat
  },
  methods: {
    // Kontrolli, kas kasutaja on sisse logitud
    updateLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem("token"); // Kui token olemas, siis on sisse logitud
    },
    // Lae juhuslik tsitaat
    async fetchRandomMotivation() {
      try {
        const response = await fetch("http://localhost:8080/motivations/random");
        if (!response.ok) throw new Error("Tsitaadi laadimine ebaõnnestus");

        const data = await response.json();
        this.randomMotivation = data;
        this.isLiked = false;
        this.isFavorited = false;
        this.favoriteMessage = "";
      } catch (error) {
        console.error("Viga tsitaadi laadimisel:", error);
        this.randomMotivation = { Quote: "Praegu ei õnnestunud tsitaati laadida.", Likes: 1 };
      }
    },
    // Lisa tsitaat lemmikuks
    async addFavorite() {
      if (!this.randomMotivation?.MotivationID) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/favorites/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            MotivationID: this.randomMotivation.MotivationID,
          }),
        });

        const responseData = await response.json();
        if (response.status === 400) {
          this.favoriteMessage = responseData.error || "Tsitaat on juba lemmikuks lisatud.";
          return;
        }

        if (!response.ok) throw new Error("Lemmikuks lisamine ebaõnnestus");

        this.isFavorited = true;
        this.favoriteMessage = "Tsitaat lisati edukalt lemmikuks!";
      } catch (error) {
        console.error("Viga lemmikuks lisamisel:", error);
        this.favoriteMessage = "Viga: Lemmikuks lisamine ebaõnnestus.";
      }

      // Teade kaob pärast 3 sekundit
      setTimeout(() => {
        this.favoriteMessage = "";
      }, 3000);
    },
  },
};
</script>

<template>
  <div v-if="randomMotivation" class="quote-container">
    <blockquote>"{{ randomMotivation.Quote }}"</blockquote>
    <div class="like-container">
      <span :class="['heart-icon', { liked: isLiked }]" @click="toggleLike">
        <i class="fas fa-heart"></i>
      </span>
      <p id="likes-count">{{ randomMotivation.Likes }}</p>
    </div>

    <!-- Lemmikuks lisamise nupp, kuvatakse ainult siis, kui kasutaja on sisse logitud -->
    <div v-if="isLoggedIn && !isFavorited" class="favorite-container">
      <button @click="addFavorite" class="favorite-button">
        Lisa Lemmikuks
      </button>
    </div>

    <!-- Lemmikuks lisamise teade -->
    <div v-if="favoriteMessage" class="message-container">
      {{ favoriteMessage }}
    </div>

    <!-- Uue tsitaadi laadimise nupp -->
    <div class="refresh">
      <button @click="fetchRandomMotivation" class="refresh-button">
        <i class="fa-solid fa-arrows-rotate"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
blockquote {
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
.refresh {
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