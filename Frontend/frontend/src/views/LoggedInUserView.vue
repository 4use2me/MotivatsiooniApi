<template>
  <div>
    <h1>Tere tulemast, {{ username }}</h1>
    <button @click="logout">Logi välja</button>

    <!-- Motivatsiooni loomise osa -->
    <div>
      <button @click="toggleCreateMotivation">Loo motivatsioon</button>
      <div v-if="showMotivationForm">
        <!-- Kasutame NewMotivation komponenti -->
        <NewMotivation @motivationCreated="fetchMotivations" />
      </div>
    </div>

    <!-- Motivatsioonide kuvamine -->
    <div v-if="motivations.length">
      <h3>Sinu motivatsioonid:</h3>
      <!-- Kasutame MotivationsTable komponenti -->
      <UsersMotivations :items="motivations"
      @deleteMotivation="deleteMotivation"
      @editMotivation="startEditingMotivation"
      />
    </div>

     <!-- Muutmise vorm -->
     <UpdateMotivation
      v-if="editingMotivation"
      :motivation="editingMotivation"
      @motivationUpdated="onMotivationUpdated"
      @cancelEdit="cancelEditingMotivation"
    />
  </div>
</template>

<script>
import UsersMotivations from '../components/UsersMotivations.vue'; // Importige komponent
import NewMotivation from '../components/NewMotivation.vue'; // Importige NewMotivation komponent
import UpdateMotivation from "../components/UpdateMotivation.vue";

export default {
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      motivations: [], // Motivatsioonide loend
      showMotivationForm: false, // Motiveerimisvormi näitamine
      editingMotivation: null, // Hetkel redigeeritav motivatsioon
    };
  },

  methods: {
    logout() {
      localStorage.removeItem('token'); // Eemalda token LocalStorage'ist
      this.$router.push("/"); // Suuna tagasi AuthView-le
    },

    toggleCreateMotivation() {
      this.showMotivationForm = !this.showMotivationForm; // Näita või peida vormi
    },

    async fetchMotivations() {
      const token = localStorage.getItem("token"); // Tokeni saamine localStorage'st
      console.log("Token:", token);
      try {
        const response = await fetch("http://localhost:8080/motivations/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Lisa Authorization päis
          },
        });

        const result = await response.json(); // Oota serveri vastust

        if (response.ok) {
          this.motivations = result.motivations || result; // Salvesta motivatsioonid
        } else {
          console.error("Motivatsioonide laadimine ebaõnnestus");
        }
      } catch (error) {
        console.error("Ühendustõrge", error); // Ühenduse viga
      }
    },

    async deleteMotivation(MotivationID) {
      console.log("MotivationID enne päringut:", MotivationID);
      if (!MotivationID) {
        console.error("MotivationID on määramata!");
        return;
      }
      const token = localStorage.getItem("token"); // Token localStorage'st
      try {
        const response = await fetch(`http://localhost:8080/motivations/${MotivationID}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Lisa Authorization päis
          },
        });

        if (response.ok) {
          this.fetchMotivations(); // Uuenda pärast kustutamist
        } else {
          console.error("Motivatsiooni kustutamine ebaõnnestus:", await response.json());
        }
      } catch (error) {
        console.error("Viga motivatsiooni kustutamisel:", error);
      }
    },

    startEditingMotivation(motivation) {
      console.log("Redigeeritav motivatsioon:", motivation);
      this.editingMotivation = motivation; // Määra hetkel redigeeritav motivatsioon
    },
    onMotivationUpdated() {
      this.editingMotivation = null; // Lõpeta muutmine
      this.fetchMotivations(); // Uuenda loendit
    },
    cancelEditingMotivation() {
      this.editingMotivation = null; // Katkesta muutmine
    },
  },
  mounted() {
    this.fetchMotivations(); // Laadi motivatsioonid komponenti laadimisel
  },
  components: {
    UsersMotivations, // Registreerige UsersMotivations komponent
    NewMotivation, // Registreerige NewMotivation komponent
    UpdateMotivation,
  },
};
</script>
