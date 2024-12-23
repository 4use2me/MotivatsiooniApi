<script>
export default {
  data() {
    return {
      randomMotivation: null, // To store the random quote
    };
  },
  async created() {
    await this.fetchRandomMotivation(); // Fetch a random quote when the page loads
  },
  methods: {
    // Fetches a random quote from the server
    async fetchRandomMotivation() {
      try {
        console.log("Fetching random motivation...");
        const response = await fetch("http://localhost:8080/motivations/random");

        console.log("Response status:", response.status);
        if (!response.ok) throw new Error("Failed to fetch quote");

        const data = await response.json();
        console.log("Fetched data:", data);
        this.randomMotivation = data; // Update the randomQuote property
      } catch (error) {
        console.error("Error fetching random quote:", error);
        this.randomMotivation = { Quote: "Unable to fetch a quote at this time." };
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
      <p>Likes: {{ randomMotivation.Likes }}</p>
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

.userView {
  margin-top: 20px;
}
</style>