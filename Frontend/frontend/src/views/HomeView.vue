<script>
import RandomMotivation from '../components/RandomMotivation.vue';

export default {
  components: {RandomMotivation},
  data() {return {
    RandomMotivation,
  }},
}
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/auth">Registreeri/Logi sisse</RouterLink>
      </nav>
    </div>
  </header>
  <body>
    <RandomMotivation />
  </body>
  
</template>