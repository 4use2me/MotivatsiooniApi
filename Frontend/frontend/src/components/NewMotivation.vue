<template>
    <div class="new-quote">
      <form  @submit.prevent="submitMotivation">
        <div class="row g-3">
          <div class="col input-group">
            <span class="input-group-text">Tsitaat</span>
            <textarea class="form-control" id="quote" rows="4" aria-label="With textarea" v-model="quote"
              placeholder="Sisesta tsitaat" required >
            </textarea>
          </div>
          <div class="col-6">
            <button class="btn save-button" type="submit"><i class="fa-regular fa-floppy-disk"></i></button>
          </div>
        </div> 

        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        quote: '', // Motivatsiooni tsitaat
        successMessage: '', // Eduka tegevuse teade
        errorMessage: '' // Veateade
      };
    },
    methods: {
      async submitMotivation() {
        // Tühjenda varasemad teated enne uue taotluse esitamist
        this.successMessage = '';
        this.errorMessage = '';
  
        const token = localStorage.getItem('token'); // Token localStorage'st
        if (!token) {
          this.errorMessage = 'Token puudub. Palun logi sisse.';
          return;
        }
  
        const newMotivation = {
          Quote: this.quote,
          Likes: 1, // Meeldimiste arvu vaikimisi väärtus
        };
  
        try {
          const response = await axios.post('http://localhost:8080/motivations', newMotivation, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 201) {
            this.successMessage = 'Tsitaat lisatud edukalt!';
            this.quote = ''; // Vorm tühjaks
            this.$emit('motivationCreated'); // Emit sündmus vanemale
          }
          } catch (error) {
          // Kui server tagastab veateate, kuvame selle
          if (error.response && error.response.data.error) {
            this.errorMessage = error.response.data.error; // Serveri veateade
          } else {
            this.errorMessage = 'Tsitaadi lisamine ebaõnnestus. Proovi uuesti.';
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  button {
    align-self: flex-start;
  }
  .success {
    color: green;
  }
  .error {
    color: red;
  }

  .save-button {
      background-color: var(--button-bg, #3f7d20);
      color: white;
      box-shadow: 2px 2px 5px #18310c;
    }
  .save-button:hover{
      background-color: var(--button-bg-hover, #18310c);
    }
  .new-quote{
    margin-top: 10px;
  }
  </style>