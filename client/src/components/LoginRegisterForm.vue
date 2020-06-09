<template>
    <div v-if="state == 'showForm'">
        <v-container id="loginRegisterForm" class="fill-height">
            <v-row align="center" justify="center" no-gutters>
                <v-col cols="12" sm="8" md="8" class="">
                    <v-card class="evelation-12 card">
                        <v-dialog
                            v-model="loading"
                            persistent
                            width="300"
                        >
                            <v-card class="modal">
                                <v-card-text>
                                    <v-progress-circular
                                        indeterminate
                                        color="purple"
                                    ></v-progress-circular>
                                    <p>Please stand by</p>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                        <v-dialog
                            v-model="emailSent"
                        >
                            <v-card class="modal">
                                <v-card-text>
                                    <p>An email has been sent to {{emailReset}}, please click on the link in the email to reset your password.</p>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                        <v-window v-model="step">
                        <!--SignIn-->
                        <v-window-item :value="1">
                            <v-row class="">
                            <v-col cols="12" md="8" class="pt-6 pb-6">
                                <v-card-text>
                                <v-form ref="logInForm">
                                    <h1 class="text-center display-1 mb-10">Log in</h1>
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
                            </v-col>
                            <v-col
                                cols="12"
                                md="4"
                                class="darken-2 vcenter"
                            >
                                <div>
                                <v-card-text>
                                    <h1 class="text-center headline mb-3">Not registered?</h1>
                                    <h5 class="text-center overline mb-3">Please create an account to continue</h5>
                                </v-card-text>
                                <div class="text-center mb-6">
                                    <v-btn @click="step = 2">Register</v-btn>
                                </div>
                                </div>
                            </v-col>
                            </v-row>
                        </v-window-item>
                        <!--Register-->
                        <v-window-item :value="2">
                            <v-row class="fill-height">
                            <v-col
                                cols="12"
                                md="4"
                                class="darken-2 vcenter"
                            >
                                <div>
                                    <v-card-text>
                                        <h1 class="text-center headline mb-3">Already have an account?</h1>
                                        <h5 class="text-center overline mb-3">Please log in</h5>
                                    </v-card-text>
                                    <div class="text-center mb-6">
                                        <v-btn @click="step = 1">Log In</v-btn>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12" md="8" class=" pt-6 pb-6">
                                <v-card-text>
                                <h1 class="text-center display-1 mb-10">
                                    Register
                                </h1>
                                <v-form ref="registerForm">
                                    <v-text-field
                                        v-model="usernameRegister"
                                        label="Username"
                                        :rules="usernameRules"
                                        append-icon="mdi-account-box"
                                        type="text"
                                    />
                                    <v-text-field
                                        v-model="emailRegister"
                                        label="Email"
                                        :rules="emailRules"
                                        append-icon="mdi-email"
                                        type="email"
                                    />
                                    <v-text-field
                                        v-model="passwordRegister"
                                        label="Password"
                                        :rules="passwordRules"
                                        append-icon="mdi-lock"
                                        type="password"
                                    />
                                    <v-text-field
                                        v-model="passwordConfirmRegister"
                                        label="Confirm password"
                                        :rules="samePassword"
                                        append-icon="mdi-lock"
                                        type="password"
                                    />
                                    <div class="text-center mt-6">
                                    <v-btn @click="createAccount()">Create account</v-btn>
                                    </div>
                                </v-form>
                                </v-card-text>
                            </v-col>
                            </v-row>
                        </v-window-item>
                        <!--PW Rest-->
                        <v-window-item :value="3">
                            <v-row class="fill-height">
                                <v-col
                                    cols="12"
                                    md="4"
                                    class="darken-2 vcenter"
                                >
                                <div>
                                    <v-card-text>
                                        <h1 class="text-center headline mb-3">Already registered?</h1>
                                        <h5 class="text-center overline mb-3">Please log in</h5>
                                    </v-card-text>
                                    <div class="text-center mb-6">
                                        <v-btn @click="step = 1">Log In</v-btn>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12" md="8" class="pt-6 pb-6">
                                <v-card-text>
                                <v-form ref="resetForm" >
                                    <h1 class="text-center display-1 mb-10">Reset Password </h1>
                                    <v-text-field
                                        v-model="emailReset"
                                        label="Email"
                                        :rules="emailRules"
                                        append-icon="mdi-email"
                                        type="text"
                                    />
                                    <div class="text-center mt-6">
                                    <v-btn @click="resetPassword()">Reset Password</v-btn>
                                    </div>
                                </v-form>
                                </v-card-text>
                            </v-col>
                            </v-row>
                        </v-window-item>
                        </v-window>
                    </v-card>
                </v-col>
            </v-row>
            <div> {{error}} </div>
        </v-container>
    </div>
</template>

<script>
  export default {
    name: 'LoginRegisterForm',

    data: () => ({
        state: 'showForm',
        step: 1,
        usernameRules: [
            v => !!v || 'Username is required',
        ],
        passwordRules: [
            v => !!v || 'Password is required',
        ],
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        error: '',
        usernameLogin: '',
        passwordLogin: '',
        usernameRegister: '',
        emailRegister: '',
        passwordRegister: '',
        passwordConfirmRegister: '',
        emailReset: '',
        loading: false,
        emailSent: false,
    }),

    computed: {
        samePassword() {
            const rules = [
                v => !!v || 'Please confirm password'
            ];
            if (this.passwordConfirmRegister) {
                const rule = v => (!!v && v) === this.passwordRegister || 'Passwords do not match';
                rules.push(rule);
            }
            return rules;
        }
    },

    methods: {

        isEmpty(string){
            return (string.length === 0 || !string.trim());
        },

        async login(){
            if(!this.isEmpty(this.usernameLogin) && !this.isEmpty(this.passwordLogin)){
                try{
                    this.loading = true;
                    var packaged = {
                        username: this.usernameLogin,
                        password: this.passwordLogin
                    }
                await fetch('http://localhost:3000/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(packaged)
                    })
                    .then((result) => {
                        console.log('Success:', result);
                        if(result.status == 200){
                            this.loading = false;
                            this.$emit('authentication', true, this.usernameLogin);
                        }
                        if(result.status == 401){
                            this.loading = false;
                            this.$emit('authentication', false, "Username or password was incorrect.")
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                } catch(err){
                    this.error = err;
                    this.state = 'error';
                }
            } else {
                this.$refs.logInForm.validate()
            }
        },
        async createAccount(){
            if(!this.isEmpty(this.usernameRegister) && !this.isEmpty(this.emailRegister) && !this.isEmpty(this.passwordRegister) && !this.isEmpty(this.passwordConfirmRegister)){
                try{
                    this.loading = true;
                    var packaged = {
                        username: this.usernameRegister,
                        email: this.emailRegister,
                        password: this.passwordRegister,
                    }
                await fetch('http://localhost:3000/api/registerAccount', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(packaged)
                    })
                    .then((result) => {
                        console.log('Success:', result);
                        if(result.status == 200){
                            this.loading = false;
                            this.$emit('authentication', true, this.usernameLogin);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                } catch(err){
                    this.error = err;
                    this.state = 'error';
                }
            } else {
                this.$refs.registerForm.validate()
            }
        },
        async resetPassword(){
            if(!this.isEmpty(this.emailReset)){
                try{
                    this.loading = true;
                    var packaged = {
                        email: this.emailReset
                    }
                await fetch('http://localhost:3000/api/resetPassword', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(packaged)
                    })
                    .then((result) => {
                        console.log('Success:', result);
                        if(result.status == 200){
                            this.loading = false;
                            this.emailSent = true;
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                } catch(err){
                    this.error = err;
                    this.state = 'error';
                }
            } else {
                this.$refs.resetForm.validate()
            }
        }
    }
  }
</script>


<style scoped>
    #modal {
        margin: 5%;
    }
</style>
