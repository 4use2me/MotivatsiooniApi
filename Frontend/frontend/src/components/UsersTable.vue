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
                    <button @click="$emit('deleteUser', item.UserID)">Kustuta</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
</style>