<script>
export default {
    name: "LoggedInUser",
    props: {
        items: Array  
    }
}
</script>

<template>
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>Kasutajanimi</th>
            </tr>
            <tr>
                <th>Parool</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.UserID">
                <td>{{item.UserName}}</td>
                <td>
                    <button @click="$emit('editUser', item)">Muuda</button>
                </td>
            </tr>
            <tr v-for="item in items" :key="item.UserID">
                <td>{{item.Password}}</td>
                <td>
                    <button @click="$emit('editUser', item)">Muuda</button>
                </td>
            </tr>

        </tbody>
    </table>
</template>

<style scoped>
</style>