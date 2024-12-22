<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
   <main>
    <div>
      <nav>
        <RouterLink to="/auth">Registreeri/Logi sisse</RouterLink>
      </nav>
    </div>
  </main>

  <RouterView />
</template>
