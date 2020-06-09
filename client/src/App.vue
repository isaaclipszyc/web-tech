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
          temporary
          app
          height="90%"
          id="navTool"
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
                <v-list-item-title class="font-weight-bold" @click="displayCustomise()">Customise Snake</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-box</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="font-weight-bold" @click="displaySettings()">Account Settings</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <template v-slot:append>
            <div id="logoutButton">
              <v-btn @click="logout()" >Logout</v-btn>
            </div>
          </template>
        </v-navigation-drawer>
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

        </div>
        <div v-if="show == 'game'">
          <div id="scoreboard">
            <p>Highscore: {{highscore}}</p>
          </div>
           <v-dialog
                v-model="highscoreDialog"
                overlay-opacity="10%"
            >
                <v-card class="modal">
                    <v-card-text>
                        <p>You got a new highschore!!! You beat your previous highschore by {{difference}} points!</p>
                    </v-card-text>
                </v-card>
            </v-dialog>
          <Game :isPlaying="gamePlaying" @scoreAchieved="printScore"/>
          <div>
            <v-btn @click="beginGame()">Play</v-btn>
          </div>
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
import Game from './components/Game.vue';

export default {
  name: 'App',

  components: {
    LoginRegisterForm,
    Game,
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
    fixedHeader: true,
    username: '',
    leaderboard: '',
    gamePlaying: false,
    highscore: 0,
    highscoreDialog: false,
    difference: 0,
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
    displayLeaderboard(){
      this.show = 'leaderboard';
      this.title = 'Leaderboard';
      this.drawer = false;
    },
    displayGame(){
      this.show = 'game';
      this.title = 'Lil\' Marco';
      this.drawer = false;
    },
    displayCustomise(){
      this.show = 'customise';
      this.title = 'Customise Snake';
      this.drawer = false;
    },
    displaySettings(){
      this.show = 'settings';
      this.title = 'Account Settings';
      this.drawer = false;
    },
    logout(){
      this.username = '';
      this.drawer = false;
      this.title = 'Lil\' Marco'
      this.show = 'loginRegister';
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
    beginGame() {
      this.gamePlaying = true;
    },
    printScore(value) {
      if(value > this.highscore){
        this.difference = value - this.highscore;
        this.highscore = value;
        this.saveHighscore();
        this.highschoreDialog = true;
      }
      this.gamePlaying = false;
    },
    async saveHighscore(){
      try{
          var packaged = {
              username: this.username,
              highscore: this.highschore,
          }
      await fetch('http://localhost:3000/api/newHighscore', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(packaged)
          })
          .then((result) => {
              console.log('Success:', result);
              if(result.status != 200){
                  this.saveHighscore();
              }
          })
          .catch((error) => {
              console.error('Error:', error);
          });
      } catch(err){
          this.error = err;
          this.state = 'error';
      }
    }

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
  /* margin-top: 60px; */
}

#scoreboard {
  margin-top: 5%;
}

#logoutButton {
  margin-bottom: 10%;
}

/* #users_button {
  position: relative;
  margin: 10%;
  top: 50%
} */

#table {
  margin: 5%;
}

#loginRegisterForm {
  margin-top: 2%;
}

#navTool {
  margin-top: 60px;
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
