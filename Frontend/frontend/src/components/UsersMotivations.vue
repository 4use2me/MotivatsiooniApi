
<template>
    <table class="table table-striped">
      <thead class="table-dark">
        <tr>
          <th>Tsitaadid</th>
          <th>Meeldimised</th>
          <th>Tegevused</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.MotivationID">
          <td>{{ item.Quote }}</td>
          <td>{{ item.Likes }}</td>
          <td>
          <button class="btn" @click="$emit('editMotivation', item)"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn" @click="$emit('deleteMotivation', item.MotivationID)"><i class="fa-solid fa-trash-can"></i></button>
        </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script>
  export default {
    name: "UsersMotivations",
    props: {
      items: {
        type: Array,
        required: true,
      },
    },
  };
  </script>
  
<style scoped>
  .btn {
      background-color: var(--vt-c-dark);
      color: white;
      margin-right: 6px;
    }
    .btn:hover {
      background-color: #51294D;
    }
</style>