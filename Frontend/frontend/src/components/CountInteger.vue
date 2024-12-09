<script>
export default{
    data(){
        return {
            counter: 0
        }
    }
}
</script>

<template>
    <button @click="counter++">Your mouse is now {{ counter }} more clics closer to being broken.</button>
</template>
