<template>
    <div>
      <form @submit.prevent="submitEdit">
        <div class="row g-3">
          <div class="col input-group">
            <span class="input-group-text">Muuda tsitaati</span>
            <textarea class="form-control" rows="4" aria-label="With textarea" v-model="updatedMotivation.Quote" ></textarea>
          </div>
          <div class="col-6">
            <button class="btn save-button" type="submit"><i class="fa-regular fa-floppy-disk"></i></button>
            <button class="btn" type="button" @click="cancelEdit"><i class="fa-regular fa-rectangle-xmark"></i></button>
          </div>
        </div>      
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      motivation: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        updatedMotivation: { ...this.motivation }, // Algväärtusta props-i põhjal
      };
    },
    watch: {
      motivation: {
        immediate: true,
        handler(newMotivation) {
          // Jälgi props-i muudatusi ja uuenda updatedMotivation
          this.updatedMotivation = { ...newMotivation };
        },
      },
    },
    methods: {
      async submitEdit() {
        if (!this.updatedMotivation.MotivationID) {
          console.error("Motivatsiooni ID puudub:", this.updatedMotivation);
          return;
        }
  
        const { MotivationID, Quote, Likes, UserID } = this.updatedMotivation; // Valitud väljad
        const token = localStorage.getItem("token");
        try {
          console.log("Saadetav motivatsioon:", { MotivationID, Quote, Likes, UserID });
          const response = await fetch(`http://localhost:8080/motivations/${MotivationID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ MotivationID, Quote, Likes, UserID }),
          });
  
          if (response.ok) {
            console.log("Motivatsioon uuendatud:", await response.json());
            this.$emit("motivationUpdated"); // Teavita vanemkomponenti
          } else {
            console.error("Motivatsiooni muutmine ebaõnnestus", await response.json());
          }
        } catch (error) {
          console.error("Viga motivatsiooni muutmisel", error);
        }
      },
      cancelEdit() {
        this.$emit("cancelEdit"); // Teavita vanemkomponenti, et muutmine katkestati
      },
    },
  };
  </script>

<style scoped>
.btn {
    background-color: var(--vt-c-dark);
    box-shadow: 2px 2px 5px var(--vt-c-dark);
    color: white;
    margin-right: 6px;
    font-size: x-large;
    padding: 0px 6px 0px 6px;
  }
.btn:hover {
    background-color: #51294D;
  }
.quote{
  display: flex;
}

.save-button {
      background-color: var(--button-bg, #3f7d20);
      color: white;
      box-shadow: 2px 2px 5px #18310c;
    }
    .save-button:hover{
      background-color: var(--button-bg-hover, #18310c);
    }
</style>