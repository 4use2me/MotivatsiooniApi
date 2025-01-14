<script>
export default {
    name: "FavoritesTable",
    props: {
        items: Array  
    }   
}
</script>

<template>
   <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th class="col-9">Motivatsioon</th>
            <th class="col">Tegevused</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="favorite in items" :key="favorite.FavoriteID">
            <td>{{ favorite.Motivation.Quote }}</td>
            <td>
              <button class="btn remove" @click="$emit('removeFavorite', favorite.FavoriteID)">Eemalda lemmikutest</button>
            </td>
          </tr>
        </tbody>
      </table>
</template>

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