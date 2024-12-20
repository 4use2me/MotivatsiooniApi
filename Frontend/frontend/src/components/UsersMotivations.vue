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
          <button @click="$emit('editMotivation', item)">Muuda</button>
          <button @click="$emit('deleteMotivation', item.MotivationID)">Kustuta</button>
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
  