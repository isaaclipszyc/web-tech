<template>
  <div id="app">
      <v-app v-bind:style="{ backgroundImage: 'url(' + require('./assets/galaxy.jpg') + ')', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}">
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
                <v-list-item-title class="font-weight-bold" @click="displayCustomise()">Customise Profile</v-list-item-title>
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
        </v-navigation-drawer>>
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
        <div v-if="show == 'game'" class="grid-container">
          <div class="item1"></div>
          <div class="item2"></div>
          <div class="item3"></div>
          <div class="item4">Highscore: {{highscore}}</div>
          <div class="item5">
            <v-dialog
              v-model="highscoreDialog"
              overlay-opacity="20%"
              width="400"
            >
              <v-card class="modal">
                <v-card-text>
                  <p style="margin-top: 2%;">You got a new highscore!!!</p>
                  <p> You beat your previous highscore by {{difference}} points!</p>
                </v-card-text>
              </v-card>
            </v-dialog>
              <Game :isPlaying="gamePlaying" @scoreAchieved="printScore"/>
          </div>
          <div class="item6"></div>
          <div class="item7"></div>
          <div class="item8">
            <v-btn @click="beginGame()">Play</v-btn>
          </div>
          <div class="item9"></div>
        </div>
        <div v-if="show == 'settings'">
          <v-card class="modal">
              <v-card-text>
                <v-form ref="settings">
                  <v-text-field
                      v-model="usernameLogin"
                      label="Username"
                      :rules="usernameRules"
                      append-icon="mdi-account-box"
                      type="text"
                  />
                  <v-text-field
                      id="password"
                      v-model="passwordLogin"
                      label="Password"
                      :rules="passwordRules"
                      append-icon="mdi-lock"
                      type="password"
                  />
                  <div class="text-center">
                  <a
                      href="#"
                      class="mt-3 overline no-text-decoration"
                      @click="step = 3"
                  >
                      Forgot your password?
                  </a>
                  </div>
                  <div class="text-center mt-6">
                  <v-btn @click="login()">Log In</v-btn>
                  </div>
              </v-form>
              </v-card-text>
            </v-card>
        </div>
        <div v-if="show == 'customise'">

        <v-card>
          <v-row justify="space-around">
            <v-avatar size="62">>
              <img id="profilepic" src="http://localhost:3000/uploads/default.png"/>
            </v-avatar>
          </v-row>
        </v-card>

            <v-card>
              <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an avatar"
                prepend-icon="mdi-camera"
                label="Avatar"
                v-model="selectedFile"
              ></v-file-input>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn right @click="importImage">Set avatar</v-btn>
              </v-card-actions>
            </v-card>

        </div>
        <v-dialog
          v-model="welcomeDialog"
          overlay-opacity="20%"
          width="400"
        >
          <v-card class="modal">
            <v-card-text>
              <p style="margin-top: 2%;">Welcome {{username}}!</p>
            </v-card-text>
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
    displayCustomise(){
      this.show = 'customise';
      this.setProfileImage();
      this.title = 'Customise profile';
      this.drawer = false;
    },
    displaySettings(){
      this.show = 'settings';
      this.title = 'Customise Character';
      this.drawer = false;
      this.state = 'loaded';
      //this.title = 'Account Settings';
      //this.drawer = false;
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
      //console.log(this.data);

      var imgPath = "http://localhost:3000/" + this.data;
      //console.log(imgPath);

      document.getElementById('profilepic').src=imgPath;

      console.log('HERE');
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




#logoutButton {
  margin-bottom: 10%;
}

#gameArea {
  display: grid;
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
  text-align: center;
  font-size: 30px;
  vertical-align: middle;
}


#scoreboard {
  margin-top: 5%;
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
