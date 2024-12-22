<script>
import UsersTable from '../components/UsersTable.vue'

export default {
  components: {UsersTable},
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
    <UsersTable :items="allUsers" />
  </main>
</template>
