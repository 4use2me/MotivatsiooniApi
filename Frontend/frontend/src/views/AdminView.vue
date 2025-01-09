<template>
    <div>
      <h1>Administraatori vaade</h1>
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
      <div style="color: black;">
        <h3>Kõik kasutajad:</h3>
      </div>
      <!-- Filtreerimise sisend -->
       <form>
          <div class="input-group flex-nowrap">
            <span class="input-group-text" id="addon-wrapping"><i class="fa-solid fa-magnifying-glass"></i></span>
            <input type="text" class="form-control" placeholder="Otsi kasutajat nime või id järgi" v-model="userSearchQuery" >
          </div>
       </form>
      
      <!-- Kasutajate kuvamine -->
      <div>
        <!-- Kasutame UsersTable komponenti -->
        <UsersTable :items="filteredUsers" 
        @deleteUser="deleteUser"
        />
      </div>

<hr>
      <!-- Motivatsiooni loomise osa -->
      <div>
        <button class="btn new-motivation" @click="toggleCreateMotivation">Lisa motivatsioon</button>
        <div v-if="showMotivationForm">
          <!-- Kasutame NewMotivation komponenti -->
          <NewMotivation @motivationCreated="fetchMotivations" />
        </div>
      </div>
<hr>
      <div style="color: black;">
        <h3>Kõik motivatsioonid:</h3>
      </div>
      <!-- Filtreerimise sisend -->
       <form>
        <div class="input-group flex-nowrap">
          <span class="input-group-text" id="addon-wrapping"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input type="text" class="form-control" placeholder="Otsi motivatsiooni tsitaadi või kasutaja id järgi" v-model="motivationsSearchQuery" aria-label="Username" aria-describedby="addon-wrapping">
        </div>
       </form>
      
      <!-- Motivatsioonide kuvamine -->
      <div v-if="motivations.length">
        <!-- Kasutame AllMotivations komponenti -->
        <AllMotivations 
        :items="filteredMotivations"
        :sortDirection="sortDirection"
        @toggleSort="toggleSort"
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
  import UsersTable from '../components/UsersTable.vue'
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
        editingUser: null,
        userData: null, // Siia salvestatakse kasutaja andmed
        userSearchQuery: '',
        motivationsSearchQuery: '',
        sortDirection: "asc",
        motivations: [], // Motivatsioonide loend
        allUsers: [],
        showMotivationForm: false, // Motiveerimisvormi näitamine
        editingMotivation: null, // Hetkel redigeeritav motivatsioon
      };
    },

    computed: {
      // Filtreeritud kasutajad
      filteredUsers() {
        const query = this.userSearchQuery.toLowerCase();
        return this.allUsers.filter(user => {
          return user.UserName.toLowerCase().includes(query) || 
           user.UserID.toString().includes(query);
          }
        );
      },
      // Filtreeritud motivatsioonid
      filteredMotivations() {
        const query = this.motivationsSearchQuery.toLowerCase();
        const filtered = this.motivations.filter((motivation) => {
          return motivation.Quote.toLowerCase().includes(query) || 
          motivation.UserID.toString().includes(query);
          }
        );

        // Sorteerime Likes väärtuse järgi
        return filtered.sort((a, b) =>
          this.sortDirection === "asc"
            ? a.Likes - b.Likes
            : b.Likes - a.Likes
        );
      },
    },
  
    methods: {
      logout() {
        localStorage.removeItem('token'); // Eemalda token LocalStorage'ist
        this.$router.push("/"); // Suuna tagasi AuthView-le
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

    async fetchUsers() {
      try {
        const response = await fetch("http://localhost:8080/users");
        this.allUsers = await response.json();
      } catch (error) {
        console.error("Kasutajate laadimine ebaõnnestus:", error);
      }
    },

      // Kasutaja kustutamine
      async deleteUser(userID) {
            console.log("Kustutatav kasutaja ID:", userID);
            if (!userID) {
            console.error("Kasutaja ID on määramata!");
            return;
            }

            try {
            // Tee DELETE päring
            const response = await fetch(`http://localhost:8080/users/${userID}`, {
                method: "DELETE",
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Lisa Authorization päis
                },
            });

            if (response.ok) {
                console.log("Kasutaja kustutatud:", userID);

                // Uuenda lokaalne kasutajate nimekiri
                this.allUsers = this.allUsers.filter((user) => user.UserID !== userID);
                // Uuenda motivatsioonide nimekiri
                if (this.motivations) {
                this.motivations = this.motivations.filter(
                    (motivation) => motivation.UserID !== userID
                );
            }
            } else {
                const errorData = await response.json();
                console.error("Kasutaja kustutamine ebaõnnestus:", errorData);
            }
            } catch (error) {
            console.error("Viga kasutaja kustutamisel:", error);
            }
        },
  
      toggleCreateMotivation() {
        this.showMotivationForm = !this.showMotivationForm; // Näita või peida vormi
      },
  
      async fetchMotivations() {
        const token = localStorage.getItem("token"); // Tokeni saamine localStorage'st
        console.log("Token:", token);
        try {
          const response = await fetch(
            `http://localhost:8080/motivations/user?sort=${this.sortDirection}`, // Lisa sortimissuuna parameeter
            {
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
      toggleSort() {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
        this.fetchMotivations(); // Laeme uuesti andmed sorteeritud kujul
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
        this.fetchUsers();
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
      this.fetchMotivations(); // Laadi motivatsioonid komponenti laadimisel
      this.fetchUsers(); 
      this.fetchUserData(); // Laadi sisseloginud kasutaja andmed
    },
    components: {
      AllMotivations, // Registreerige AllMotivations komponent
      NewMotivation, // Registreerige NewMotivation komponent
      UpdateMotivation,
      UsersTable,
      UpdateUser,
    },
  };
  </script>
  
<style scoped>
    .card {
      background: none;
      width: fit-content;
      border: 0;
    }
    .data, .new-motivation{
      background-color: var(--vt-c-dark);
      color: var(--vt-c-light);
    }
    .data:hover, .new-motivation:hover{
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