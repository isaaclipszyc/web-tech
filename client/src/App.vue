<template>
  <div id="app">
      <v-app>
        <v-app-bar
          app
          color="primary"
          dark
        >
        <h1 class="mx-auto" >{{ title }}</h1>
        </v-app-bar>
        <div v-if="show == 'home'">
          <p style="margin: 5%"> This is a simple SPA that uses the Vue framework for the client-side (with Vuetify for nicely working and aesthetically pleasing components) and Express for the server-side. It uses sqlite3 as an embedded SQL database. This project was created by Isaac Lipszyc (il17557) and Ben Fozard (bf17813).</p>
          <v-btn large color="primary" id="users_button" @click="showUsers()">Users</v-btn>
        </div>
        <div v-if="show == 'loading'">
          <p> {{state}} </p>
          <p v-if="error != ' '"> {{error}} </p>
        </div>
        <div v-if="show == 'table'">
          <p v-if="state == 'error'"> {{error}} </p>
          <p v-else-if="state == 'loading'"> Loading data...</p>
          <div id="table" v-else-if="state == 'loaded'"> 
            <v-data-table
              :headers="headers"
              :items="data"
              class="elevation-1"
              id ="dataTable"
            >
            </v-data-table>
          </div>
          <div>
            <v-btn large color="primary" id="home_button" @click="home()">Home</v-btn>
          </div>
        </div>
      <!-- <p> {{headers}} </p> -->
      </v-app>
  </div>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    title: 'Home',
    show: 'home',
    headers: [],
    data: [],
    error: ' ',
    state: ' ',
    height: 600,
    fixedHeader: true,
  }),

  methods: {

    home(){
      this.show = 'home';
      this.title = 'Home'
    },
    getHeaders(){
      var s = new Set();
      this.data.forEach(header => {
        for(var field in header){
            s.add(field);
        }
      });

      return Array.from(s).map(a => {
        return {
          text: a.toUpperCase(),
          value: a
        }
      });
    },
    // convert (json) {
    //   var output = []
    //   json.forEach(data => {
    //     output.push(data.data);
    //   });
    //   return output;
    // },
    async showUsers(){
      try{
        this.state = 'loading';
        this.show = 'loading';
        const data = await fetch('http://localhost:3000/api/getUsers');
        this.json = await data.json();
        this.data = this.json.data;
        this.headers = this.getHeaders();
        this.state = 'loaded';
        this.title = 'Table of Users'
        this.show = 'table';
      } catch(err){
        this.error = err;
        this.state = 'error';
      }
    },
  }

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#users_button {
  position: relative;
  margin: 10%;
  top: 50%
}

#table {
  margin: 5%;
}

table th + th { 
  border-left:1px solid #dddddd;
  border-bottom: 2px solid black;
  text-align: center;
}
table td + td { 
  border-left:1px solid #dddddd;
  text-align: center;
}

</style>
