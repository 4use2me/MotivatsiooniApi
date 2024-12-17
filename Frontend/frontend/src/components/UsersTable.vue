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
                <th>UserName</th>
                <th>Password</th>
                <th>MotivationID</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.UserID">
                <td>{{item.UserName}}</td>
                <td>{{item.Password}}</td>
                <td>{{item.MotivationID}}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
</style>