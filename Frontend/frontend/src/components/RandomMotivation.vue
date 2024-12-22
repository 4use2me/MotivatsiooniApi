<script>
export default {
  data() {
    return {
      randomQuote: null, // To store the random quote
    };
  },
  async created() {
    await this.fetchRandomQuote(); // Fetch a random quote when the page loads
  },
  methods: {
    // Fetches a random quote from the server
    async fetchRandomQuote() {
      try {
        const response = await fetch("http://localhost:8080/motivations/random");
        if (!response.ok) throw new Error("Failed to fetch quote");

        const data = await response.json();
        this.randomQuote = data; // Update the randomQuote property
      } catch (error) {
        console.error("Error fetching random quote:", error);
        this.randomQuote = { Quote: "Unable to fetch a quote at this time." };
      }
    },
  },
};
</script>

<template>

    <!-- Random Quote Display -->
    <div v-if="randomQuote" class="quote-container">
      <blockquote>
        "{{ randomQuote.Quote }}"
      </blockquote>
      <p>Likes: {{ randomQuote.Likes }}</p>
    </div>

    <!-- Button to Fetch New Random Quote -->
     <div class="refresh">
        <button @click="fetchRandomQuote" class="refresh-button">
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
  color: #f9f9f9;
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