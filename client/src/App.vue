<template>
  <div id="app">
      <v-app v-bind:style="{ backgroundImage: 'url(' + require('./assets/galaxy.jpg') + ')', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}">
        <v-app-bar
          app
          dark
        >
        <v-app-bar-nav-icon v-if="show != 'loginRegister'" @click="drawer = true" ></v-app-bar-nav-icon>
        <h1 class="mx-auto" v-if="show != 'loginRegister' && show != 'game'">{{ title }}</h1>
        <v-img v-if="show == 'loginRegister' || show == 'game'"
          class="mx-auto" 
          src="./assets/logo.png"
          max-height="70"
          max-width="400"
          contain
         ></v-img>
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
              <v-list-item @click="displayGame()">
                <v-list-item-icon>
                  <v-icon>mdi-gamepad-square</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="font-weight-bold" >Game</v-list-item-title>
              </v-list-item>
              <v-list-item @click="displayLeaderboard()">
                <v-list-item-icon>
                  <v-icon>mdi-podium</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="font-weight-bold"  >Leaderboard</v-list-item-title>
              </v-list-item>
              <v-list-item @click="displaySettings()">
                <v-list-item-icon>
                  <v-icon>mdi-account-box</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="font-weight-bold" >Account Settings</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <template v-slot:append>
            <div id="logoutButton">
              <v-btn color="deep-purple accent-4 white--text" @click="logout()" >Logout</v-btn>
            </div>
          </template>
        </v-navigation-drawer>>
        <div v-if="show == 'loading'">
          <p> {{state}} </p>
          <p v-if="error != ' '"> {{error}} </p>
        </div>
        <div id="loginRegisterForm" v-if="show == 'loginRegister'">
            <v-dialog
              v-model="errorDialog"
              width="400"
            >
              <v-card class="modal">
                  <v-card-title class="white lighten-2">
                    {{errorMessage}}
                  </v-card-title>
              </v-card>
            </v-dialog>
            <v-card>
              <v-card-text>
                You are a space pirate worm with the dream of getting rich from collecting red gems!
              </v-card-text>
              <v-card-text>
                This game puts a fun twist on the classic snake game!
              </v-card-text>
            </v-card>
            <LoginRegisterForm @authentication="authenticator"/>
        </div>
        <div v-if="show == 'leaderboard'" id="leaderboard">
          <v-data-table
            :headers="headers"
            :items="data"
            class="elevation-1"
            fixed-header
            disable-sort
            id ="dataTable"
          >
            <template v-slot:item.imagePath="{ item }">
              <v-avatar size="50">
                <img :src="toURL(item.imagePath)"/>
              </v-avatar>

            </template>
          </v-data-table>
        </div>
        <div v-if="show == 'game'" class="grid-container">
          <div class="item1"></div>
          <div class="item2"></div>
          <div class="item3">
          </div>
          <div class="item4" style="width: 210px;">Highscore: {{highscore}}</div>
          <div class="item5">
            <v-dialog
              v-model="highscoreDialog"
              width="400"
            >
              <v-card class="modal">
                <v-card-title class="justify-center white lighten-2">
                  You got a new highscore!!!
                </v-card-title>
                <v-card-text>
                  You beat your previous highscore by {{difference}} points!
                </v-card-text>
              </v-card>
            </v-dialog>
             <v-dialog
              v-model="gameOverDialog"
              width="300"
            >
              <v-card class="modal">
                <v-card-title class="justify-center white lighten-2">
                  Game Over :(
                </v-card-title>
              </v-card>
            </v-dialog>
            <Game :isPlaying="gamePlaying" @scoreAchieved="printScore"/>
          </div>
          <div class="item6" style="width: 210px;">
            <h3 style="margin-bottom: 2%;"> Instructions: </h3>
            <p>1. Use the arrow keys to change direction.</p>
            <p>2. Use the blue worm holes to jump around space.</p>
            <p>3. Beware of the black obstacles!!!</p>
          </div>
          <div class="item7"></div>
          <div class="item8">
            <v-btn color="deep-purple accent-4 white--text" @click="beginGame()">Play</v-btn>
          </div>
          <div class="item9"></div>
        </div>
        <div v-if="show == 'settings'" id="settings">
          <v-card width="400" class="mx-auto">
            <v-row justify="space-around">
              <v-avatar size="200" style="margin-top: 5%;">
                <img id="profilepic" src="http://localhost:3000/uploads/default.png"/>
              </v-avatar>
            </v-row>
            <v-card-text>
                  {{username}}
            </v-card-text>
            <v-file-input
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Pick an avatar"
              prepend-icon="mdi-camera"
              label="Avatar"
              v-model="selectedFile"
              style="margin: 2%;"
            ></v-file-input>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="deep-purple accent-4 white--text" right @click="importImage">Set avatar</v-btn>
            </v-card-actions>
          </v-card>
        </div>
        <div v-if="show == 'customise'">



        </div>
        <v-dialog
          v-model="welcomeDialog"
          width="400"
        >
          <v-card class="modal">
            <v-card-title class="justify-center white lighten-2">
              Welcome {{username}}!
            </v-card-title>
          </v-card>
        </v-dialog>
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
    title: 'Wormhole',
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
    showUpload: true,
    previewImage: null,
    selectedFile: null,
    fileData: null,
    gamePlaying: false,
    highscore: 0,
    highscoreDialog: false,
    difference: 0,
    welcomeDialog: false,
    gameOverDialog: false,
  }),

  methods: {

    authenticator(successful, username){
      if(successful){
        this.show = 'game';
        this.username = username;
        this.welcomeDialog = true;
        this.getHighscore();
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
      this.show = 'game';
      this.title = 'Wormhole';
      this.drawer = false;
    },
    displaySettings(){
      this.setProfileImage();
      this.show = 'settings';
      this.title = 'Account Settings';
      this.drawer = false;
      this.state = 'loaded';
    },
    logout(){
      this.username = '';
      this.highscore = 0;
      this.drawer = false;
      this.title = 'Wormhole'
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
        if (a === "imagePath") {
          return {
            text: '',
            value: a
          }
        }
        else {
          return {
            text: a.toUpperCase(),
            value: a
          }
        }
      });
    },
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
    async importImage() {
      console.log('In ImportImage');
      if (!this.selectedFile) {this.data = "No File Chosen"}

      let formData = new FormData();
      formData.append("test", this.selectedFile);

      await fetch('http://localhost:3000/api/upload?uname=' + this.username, {
        method: 'POST',
        body: formData
      })
      .then((result) => {
          console.log('Success:', result);
          if(result.status == 200){
              this.loading = false;
          }
      })
      .catch((error) => {
          console.error('Error:', error);
      });

      const data = await fetch('http://localhost:3000/api/getProfilePicture?uname=' + this.username);
      this.json = await data.json();
      this.data = this.json.data;

      var imgPath = "http://localhost:3000/" + this.data;

      document.getElementById('profilepic').src=imgPath;

    },
    async setProfileImage() {
      const data = await fetch('http://localhost:3000/api/getProfilePicture?uname=' + this.username);
      this.json = await data.json();
      this.data = this.json.data;

      var imgPath = "http://localhost:3000/" + this.data;

      document.getElementById('profilepic').src=imgPath;
    },
    beginGame() {
      this.gamePlaying = true;
    },
    printScore(value) {
      if(value > this.highscore){
        this.difference = value - this.highscore;
        this.highscore = value;
        this.saveHighscore();
        this.highscoreDialog = true;
      } else {
        this.gameOverDialog = true;
      }
      this.gamePlaying = false;
    },
    async saveHighscore(){
      try{
          var packaged = {
              username: this.username,
              highscore: this.highscore,
          }
          await fetch('http://localhost:3000/api/updateHighscore', {
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
    },
    async getHighscore(){
        try{
          var packaged = {
              username: this.username,
          }
          const response = await fetch('http://localhost:3000/api/getHighscore', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(packaged)
          })
          var json = await response.json();
          var data = json.data;
          this.highscore = data[0].highscore;
          if(this.highscore == null){
            this.highscore = 0;
          }

      } catch(err){
          this.error = err;
          this.state = 'error';
      }
    },
    toURL(string) {
      var url = "http://localhost:3000/" + string;
      return url;
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
}


#logoutButton {
  margin-bottom: 10%;
}


.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  margin-top: 5%;
  margin-left: 20%;
  margin-right: 20%;
}

.grid-container > div {
  background-color: rgba(187, 111, 231, 0.9);
  font-size: 20px;
  vertical-align: middle;
  padding: 2%;
  padding-left: 2%;
  padding-right: 2%;
  overflow: hidden;
}

#item6 {
  float: left;
}

#leaderboard{
  margin: 10%;
}

#settings{
  margin-top: 10%;
  margin-left: 20%;
  margin-right: 20%;
}

#modalText {
  margin-top: 2%;
  font-size: 20px;
}

#scoreboard {
  margin-top: 5%;
}

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
