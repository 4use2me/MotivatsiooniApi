<script>
export default {
    name: "UsersTable",
    props: {
        items: Array  
    }
}
</script>

<template>
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>Kasutaja ID</th>
                <th>Kasutajanimi</th>
                <th>Tegevused</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.UserID">
                <td>{{item.UserID}}</td>
                <td>{{item.UserName}}</td>
                <td>
                    <button class="btn" @click="$emit('deleteUser', item.UserID)"><i class="fa-solid fa-trash-can"></i></button>
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