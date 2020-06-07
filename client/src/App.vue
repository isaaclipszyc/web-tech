<template>
  <div id="app">
      <v-app>
        <v-app-bar
          app
          dark
        >
        <v-app-bar-nav-icon v-if="show != 'loginRegister'" @click="drawer = true" ></v-app-bar-nav-icon>
        <h1 class="mx-auto" >{{ title }}</h1>
        </v-app-bar>
        <v-navigation-drawer
          v-model="drawer"
          absolute
          temporary
        >
          <v-list
            nav
            dense
          >
            <v-list-item-group
              v-model="group"
              active-class="deep-purple--text text--accent-4"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-gamepad-square</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="font-weight-bold" @click="displayGame()">Game</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-podium</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="font-weight-bold"  @click="displayLeaderboard()">Leaderboard</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-tshirt-crew</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="font-weight-bold" @click="displayCustomise()">Customise Character</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-box</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="font-weight-bold" @click="displaySettings()">Account Settings</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>

        <!-- <div v-if="show == 'login'">
          <p style="margin: 5%"> This is a simple SPA that uses the Vue framework for the client-side (with Vuetify for nicely working and aesthetically pleasing components) and Express for the server-side. It uses sqlite3 as an embedded SQL database. This project was created by Isaac Lipszyc (il17557) and Ben Fozard (bf17813).</p>
          <v-btn large color="primary" id="users_button" @click="showUsers()">Users</v-btn>
        </div> -->
        <div v-if="show == 'loading'">
          <p> {{state}} </p>
          <p v-if="error != ' '"> {{error}} </p>
        </div>
        <div id="loginRegisterForm" v-if="show == 'loginRegister'">
            <v-dialog
                v-model="errorDialog"
                overlay-opacity="10%"
            >
                <v-card class="modal">
                    <v-card-text>
                        <p>{{errorMessage}}</p>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <LoginRegisterForm @authentication="authenticator"/>
        </div>
        <div v-if="show == 'leaderboard'">

          <v-data-table
              :headers="headers"
              :items="data"
              class="elevation-1"
              fixed-header
              id ="dataTable"
            >
            </v-data-table>
        </div>
        <div v-if="show == 'game'">

        </div>
        <div v-if="show == 'settings'">

        </div>
        <div v-if="show == 'customise'">

        </div>


        <!--<div v-if="show == 'table'">
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
        </div> -->
      <!-- <p> {{headers}} </p> -->
      </v-app>
  </div>
</template>

<script>

import LoginRegisterForm from './components/LoginRegisterForm.vue';

export default {
  name: 'App',

  components: {
    LoginRegisterForm
  },

  data: () => ({
    title: 'Lil\' Marco',
    dialog: true,
    errorDialog: false,
    errorMessage: '',
    drawer: false,
    step: 0,
    show: 'loginRegister',
    headers: [],
    data: [],
    error: ' ',
    state: ' ',
    height: 600,
    fixedHeader: true,
    username: '',
    highscore: '',
    leaderboard: '',
  }),

  methods: {

    authenticator(successful, username){
      if(successful){
        this.show = 'game';
        this.username = username;
      } else {
        this.show = 'loginRegister'
        this.errorMessage = username;
        this.errorDialog = true;
      }
    },
    async displayLeaderboard(){
      this.show = 'leaderboard';
      this.title = 'Leaderboard';
      this.drawer = false;
      const data = await fetch('http://localhost:3000/api/getLeaderboard');
      this.json = await data.json();
      this.data = this.json.data;
      this.headers = this.getHeaders();
      this.state = 'loaded';
    },
    displayGame(){
      this.show = 'game'
      this.title = 'Lil\' Marco'
      this.drawer = false
    },
    displayCustomise(){
      this.show = 'customise'
      this.title = 'Customise Character'
      this.drawer = false
    },
    displaySettings(){
      this.show = 'settings'
      this.title = 'Account Settings'
      this.drawer = false
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

body {
  background-color: black;
}

</style>
