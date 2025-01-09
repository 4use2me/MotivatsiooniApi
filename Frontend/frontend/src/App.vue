<script setup>
import { computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import { RouterLink, RouterView, useRouter } from "vue-router";

const { isAuthenticated, logout, user } = useAuth();
const router = useRouter();

// Use computed to ensure reactivity
const isAuthenticatedState = computed(() => isAuthenticated.value);
const username = computed(() => user.value?.UserName || "");

const handleLogout = () => {
  logout();
  router.push("/"); // Redirect to home after logout
};
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">Motiveeri ennast!</RouterLink>
        <!-- <RouterLink to="/about">Meist</RouterLink> -->
        <RouterLink v-if="isAuthenticatedState" :to="`/loggedin/${username}`">Sinu leht</RouterLink>
        <!-- <RouterLink class="login-nav" to="/auth"><i class="fa-solid fa-user-plus"></i></RouterLink> -->
        <RouterLink v-if="!isAuthenticatedState" class="login-nav" to="/auth">
          <i class="fa-solid fa-user-plus"></i>
        </RouterLink>
        <button v-else class="logout-nav" @click="handleLogout">
          Välju
        </button>
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

nav .login-nav, .logout-nav {
  padding: 0.5rem 1rem;
  background-color: var(--button-bg, #3f7d20);
  color: var(--button-text, white);
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  margin-left: auto; /* Push it to the right */
  margin-top: 6px;
  margin-right: 10px;
}

nav .login-nav:hover, .logout-nav:hover {
  background-color: var(--button-bg-hover, #18310c);
  color: var(--button-text-hover, white);
}

nav .logout-nav{
  border: 0;
}
nav {
    display: flex;
    align-items: center;
    width: 100%;

  }

/* @media (min-width: 1024px) {
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
} */
</style>