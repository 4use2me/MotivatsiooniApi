<script>
import MotivationsTable from '../components/MotivationsTable.vue';
import GamesTable from '../components/MotivationsTable.vue'
export default {
  components: { MotivationsTable },
  data() { return {
    allMotivations: []
  }},
  async Created() {
    this.allMotivations = await (await fetch('http://localhost8080/motivations')).json()
  }
}
</script>

<template>
  <main>
    <MotivationsTable :items="allMotivations"/>
  </main>
</template>