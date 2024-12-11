<script>
export default {
    name: "MotivationsTable",
    props: {
        items: Array  
    }
}
</script>

<template>
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>Quote</th>
                <th>Likes</th>
                <th>UserID</th>
                
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.MotivationID">
                <td>{{item.Quote}}</td>
                <td>{{item.Likes}}</td>
                <td>{{item.UserID}}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
</style>