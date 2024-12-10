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
            <th>Date</th>
            <th>Likes</th>
            </tr>
        </thead>
    <tbody>
        <tr v-for="item in items" :key="item.QuoteID">
            <td>{{ item.Quote }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.likes }}</td>
        </tr>
</tbody>
    </table>
</template>