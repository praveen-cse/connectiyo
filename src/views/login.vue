<template>
      <div class='login' id='new'>
      <fieldset v-if='checkuser()'>
        <legend>Sign in</legend>
        <form id='log'>
          <br><br>
          <label class="fas fa-user" for='username'></label>
          <input type='text' id='username' placeholder="Username" v-model="user.username" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-lock fa-4" for='password'></label>
          <input type="password" id="password" placeholder='Password' v-model = "user.password" required> <span id='requir'>*</span><br/><br/><br/>
          <div class='mybutton'>
          <button class="fab fa-telegram" style='font-size:30px;' type='button' v-on:click='signin'></button><br/><br/>
          <button class="fas fa-trash-restore" style='font-size:30px;'  type='reset' value='Reset'></button>
          </div>
        </form>
      </fieldset>
      <p v-else>Already Logged in as {{name}}<br/><br>
        To logout <router-link to='/logout'>Logout</router-link></p>
      </div>
</template>

<script>
import Vue from 'vue'
import router from '../router'
import VueNativeNotification from 'vue-native-notification'
var user=localStorage.getItem('username')
Vue.use(VueNativeNotification, {
        requestOnNotify: true
    })
import axios from 'axios';
import {mapActions} from 'vuex'; 
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      name : ''
    }
  },
  methods: {
      checkuser()
      {
          var s=localStorage.getItem('username');
          if(s!=null)
          {
              this.name=s;
              return false;
          }
          return true;
      },
    signin() {
      var a=this.user.username;
      var b=this.user.password;
      if(a=="" || b=="")
      {
        this.$notification.show('Connectiyo', {
                    body: 'Please enter the user credentials'
                }, {})
        return;
      }
      console.log(a);
      api.get('/'+a+'/'+b)
      .then(res => {
        if(res.data[0] == undefined){
        this.$notification.show('Connectiyo', {
                    body: 'Username or Password Incorrect'
                }, {})
        //document.getElementById('log').reset();
        }
        else{
        this.$notification.show('Connectiyo', {
                    body: 'Login Success'
                }, {})
        document.getElementById('log').reset();
        localStorage.setItem("username", a);
        router.push('/feed');
        }
      })
      .catch(error =>{
        console.log(error);
      })
    }
  }
}
</script>
<style>
button{
  margin-right : 30px;
}
.mybutton{
  text-align: center;
  margin-left :40px;
}
fieldset{
    text-align: center;
    width : 500px;
    margin-left : 450px;
    margin-top: 50px;
}
#requir{
  color : red;
  margin-left: 10px;
}
input {
  padding : 10px;
   height : 40px;
    text-align: center;
}
legend {
    padding: 0.2em 0.5em;
    border:1px solid black;
    color:rgb(5, 5, 5);
    font-size:40px;;
    text-align:center;
    font-size: 20px;
}
label {
    margin-left : 100px;
    margin-right:0.5em;
    text-align:center;
    font-weight:bold;
}
button {
    color: #20bf6b !important;
    text-transform: uppercase;
    background: #ffffff;
    padding: 20px;
    border: 4px solid #20bf6b !important;
    border-radius: 6px;
    display: inline-block;
    }

button:hover 
{
        color: #494949 !important;
        border-radius: 50px;
        border-color: #494949 !important;
        transition: all 0.3s ease 0s;
} 

</style>