
<template>
  <div>
    <div class="welcome">
      <h1>Tere tulemast, {{ username }}</h1>
    </div>
    
<hr>
    <!-- Kasutaja kuvamine -->
    <div v-if="userData">
      <button class="btn data" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapseExample">
        Sinu andmed
      </button>
      <div class="collapse" id="collapse1">
        <div class="card card-body">
          <p><strong>Kasutajanimi:</strong> {{ userData.UserName }}</p>
          <p><strong>Parool:</strong> {{ userData.Password }}</p>
          <button class="btn change" @click="startEditingUser(userData)">Muuda</button>
        </div>
      </div>
      
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
      <button class="btn new-motivation" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapseExample" @click="toggleCreateMotivation">Lisa motivatsioon</button>
      <div  id="collapse2">
        <div v-if="showMotivationForm">
        <!-- Kasutame NewMotivation komponenti -->
        <NewMotivation @motivationCreated="fetchMotivations" />
      </div>
      </div>
      
    </div>
  <hr>
    <!-- Motivatsioonide kuvamine -->
    <div style="color: black;" v-if="motivations.length">
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

    <!-- Favorites Table -->
  <div style="color: black;" v-if="favorites.length">
    <h3>Sinu lemmikud:</h3>
    <table class="table table-striped">
      <thead class="table-dark">
        <tr>
          <th class="col-9">Motivatsioon</th>
          <th class="col">Tegevused</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="favorite in favorites" :key="favorite.FavoriteID">
          <td>{{ favorite.Motivation.Quote }}</td>
          <td>
            <button class="btn remove" @click="removeFavorite(favorite.FavoriteID)">Eemalda lemmikutest</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <p>You have no favorite quotes yet.</p>
  </div>
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
      favorites: [], // Stores user's favorite quotes
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

    async fetchFavorites() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/favorites/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("Favorites response:", result);
      if (response.ok) {
        this.favorites = result.favorites || result;
      } else {
        console.error("Lemmikute laadimine ebaõnnestus");
      }
    } catch (error) {
      console.error("Ühendustõrge:", error);
    }
  },
  async removeFavorite(FavoriteId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/favorites/user/${FavoriteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log("Favorite deleted:", FavoriteId);
        this.favorites = this.favorites.filter((fav) => fav.FavoriteID !== FavoriteId);

      } else {
        console.error("Failed to delete favorite");
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
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
    this.fetchFavorites(); // Fetch user's favorite quotes
  },
  components: {
    UsersMotivations, // Registreerige UsersMotivations komponent
    NewMotivation, // Registreerige NewMotivation komponent
    UpdateMotivation,
    UpdateUser, // Registreerige UpdateUser komponent
  },
};
</script>

<style scoped>
  .welcome{
    overflow: hidden;
  }
  .log-out{
    float: right;
  }
  .card {
    background: none;
    width: fit-content;
    border: 0;
  }
  .data, .new-motivation, .remove{
    background-color: var(--vt-c-dark);
    color: var(--vt-c-light);
  }
  .data:hover, .new-motivation:hover, .remove:hover {
    background-color: #51294D;
  }
  .change {
    background-color: var(--button-bg, #3f7d20);
    color: white;
    padding: 2px;
  }
  .change:hover{
    background-color: var(--button-bg-hover, #18310c);
  }
</style>
