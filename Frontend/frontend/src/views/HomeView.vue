<script>
import MotivationsTable from '../components/MotivationsTable.vue'
import UsersTable from '../components/UsersTable.vue'

export default {
  components: {MotivationsTable, UsersTable},
  data() {return {
    allMotivations: [],
    allUsers: []
  }},
  async created() {
    this.allMotivations = await (await fetch("http://localhost:8080/motivations")).json()
    this.allUsers = await (await fetch("http://localhost:8080/users")).json()
  }
}
</script>

<template>
  <main>
    <MotivationsTable :items="allMotivations" />
    <UsersTable :items="allUsers" />
  </main>
</template>
