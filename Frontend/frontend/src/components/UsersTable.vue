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
                <th>MotivationID</th>
                <th>Date</th>
                <th>UserName</th>
                <th>Password</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.UserID">
                <td>{{item.MotivationID}}</td>
                <td>{{item.Date}}</td>
                <td>{{item.UserName}}</td>
                <td>{{item.Password}}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
</style>