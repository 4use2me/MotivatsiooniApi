<template>
    <div>
      <h1>Tere tulemast, {{ username }}</h1>
      <button @click="logout">Logi välja</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      username: {
        type: String,
        required: true, // Kontrollib, et username on alati olemas
      },
    },
    methods: {
      logout() {
        this.$router.push("/"); // Suuna tagasi AuthView-le
      },
    },
  };
  </script>
  
  