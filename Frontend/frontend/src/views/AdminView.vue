<template>
    <div>
      <h1>Administraatori vaade</h1>
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
        <h3>Kõik motivatsioonid:</h3>
        <!-- Kasutame AllMotivations komponenti -->
        <AllMotivations :items="motivations"
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
  import AllMotivations from '../components/AllMotivations.vue'; // Importige komponent
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
        if (!token) {
          console.error("Token puudub. Palun logi sisse.");
          return;
        }
  
        try {
          // Tee DELETE päring
          const response = await fetch(`http://localhost:8080/motivations/${MotivationID}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // Lisa Authorization päis
            },
          });
  
          if (response.ok) {
            console.log("Motivatsioon kustutatud:", MotivationID);
        
            // Eemalda kustutatud motivatsioon lokaalsest nimekirjast
            this.motivations = this.motivations.filter(
              (motivation) => motivation.MotivationID !== MotivationID
            );
  
            // Kui nimekiri on tühi, tee kindel signaal renderdamiseks
            if (this.motivations.length === 0) {
              console.log("Motivatsioonide nimekiri on nüüd tühi.");
              this.motivations = [];
            }
          } else {
            const errorData = await response.json();
            console.error("Motivatsiooni kustutamine ebaõnnestus:", errorData);
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
      AllMotivations, // Registreerige AllMotivations komponent
      NewMotivation, // Registreerige NewMotivation komponent
      UpdateMotivation,
    },
  };
  </script>
  