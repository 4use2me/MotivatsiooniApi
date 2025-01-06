<template>
    <table class="table table-striped">
        <thead class="table-dark">
        <tr>
          <th>Tsitaadid</th>
          <th>
          Meeldimised
          <span class="sort-arrows" @click="$emit('toggleSort')">
            <i 
              class="arrow" 
              :class="sortDirection === 'asc' ? 'asc' : 'desc'">
            </i>
          </span>
        </th>
          <th>Kasutaja ID</th>
          <th>Tegevused</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.MotivationID">
          <td>{{ item.Quote }}</td>
          <td>{{ item.Likes }}</td>
          <td>{{ item.UserID }}</td>
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
    props: {
      items: {
        type: Array,
        required: true,
      },
      sortDirection: {
        type: String,
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
/* Sorteerimisnoolte stiil */
.sort-arrows {
  margin-left: 8px;
  cursor: pointer;
  display: inline-block;
}
.arrow {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}
.arrow.asc {
  border-bottom: 6px solid #ffffff; /* Ülesnool */
}
.arrow.desc {
  border-top: 6px solid #ffffff; /* Allanoole */
}
</style>
  