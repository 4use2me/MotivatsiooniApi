<template>
  <div>
    <h1>Tere tulemast, {{ username }}</h1>
    <button @click="logout">Logi välja</button>
<hr>
    <!-- Kasutaja kuvamine -->
    <div v-if="userData">
      <h3>Sinu andmed:</h3>
      <p><strong>Kasutajanimi:</strong> {{ userData.UserName }}</p>
      <p><strong>Parool:</strong> {{ userData.Password }}</p>
      <button @click="startEditingUser(userData)">Muuda</button>
    </div>

    <!-- Kasutaja muutmise vorm -->
    <UpdateUser
      v-if="editingUser"
      :user="editingUser"
      @userUpdated="onUserUpdated"
      @cancelEdit="cancelEditingUser"
    />
<hr>
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
      <!-- Kasutame UsersMotivations komponenti -->
      <UsersMotivations :items="motivations"
      @deleteMotivation="deleteMotivation"
      @editMotivation="startEditingMotivation"
      />
    </div>

     <!-- Motivatsiooni muutmise vorm -->
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
import UpdateUser from "../components/UpdateUser.vue";

export default {
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      userData: null, // Siia salvestatakse kasutaja andmed
      editingUser: null,
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

    async fetchUserData() {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("Token puudub. Palun logi sisse.");
      this.$router.push("/"); // Suuna tagasi sisselogimise vaatesse
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.userData = await response.json(); // Salvesta kasutaja andmed
        console.log("Sisseloginud kasutaja andmed:", this.userData);
      } else {
        console.error("Kasutaja andmete laadimine ebaõnnestus.");
        this.$router.push("/"); // Suuna tagasi sisselogimise vaatesse
      }
    } catch (error) {
      console.error("Ühendustõrge kasutaja andmete laadimisel:", error);
    }
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

    startEditingUser(user) {
      console.log("Redigeeritav kasutaja:", user);
      this.editingUser = user; // Määra redigeeritav kasutaja
    },
    onUserUpdated() {
      this.editingUser = null; // Lõpeta muutmine
      this.fetchUserData(); // Uuenda 
    },
    cancelEditingUser() {
      this.editingUser = null; // Katkesta muutmine
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
    this.fetchUserData(); // Laadi sisseloginud kasutaja andmed
    this.fetchMotivations(); // Laadi motivatsioonid komponenti laadimisel
  },
  components: {
    UsersMotivations, // Registreerige UsersMotivations komponent
    NewMotivation, // Registreerige NewMotivation komponent
    UpdateMotivation,
    UpdateUser, // Registreerige UpdateUser komponent
  },
};
</script>
