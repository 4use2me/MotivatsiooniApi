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
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.UserID">
                <td>{{item.UserID}}</td>
                <td>{{item.UserName}}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
</style>