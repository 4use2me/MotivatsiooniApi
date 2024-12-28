<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderView from './components/Header.vue';
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">Motiveeri ennast!</RouterLink>
        <RouterLink to="/about">Meist</RouterLink>
        <RouterLink class="login-nav" to="/auth">Registreeri/Logi sisse</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>


nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }


  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
