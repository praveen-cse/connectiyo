<template>
      <div class='signupp'>
      <fieldset class='field' v-if='checkuser()'>
        <legend>Sign Up</legend>
        <form class="frm" id='sign'>
          <br><br>
          <label class="fas fa-user" for='username'> </label>
          <input  type='text' id='username_' placeholder="Username" v-model="user.username" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-users" for='fullname'></label>
          <input type='text' id='fullname' placeholder="Fullname" v-model="user.fullname" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-lock fa-4"> </label>
          <input  type="password" id="password_" placeholder='Password' v-model="user.password" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-phone" for='phonenumber'></label>
          <input type='tel' pattern='[0-9]{10}' id='phoneno' placeholder="Phone Number" v-model="user.phoneno" required> <span id='requir'>*</span><br/><br/><br/>
          <label class="fas fa-at" for='email'></label>
          <input  type='email' id='email' placeholder="Email ID" v-model="user.email" required> <span id='requir'>*</span><br/><br/><br/>
          <div class='mybutton'>
          <button class="fab fa-telegram" style='font-size:30px;' type='button' v-on:click='signup()'></button><br/><br/>
          <button class="fas fa-trash-restore" style='font-size:30px;' type='reset' value='Reset'></button>
          </div>
        </form>
      </fieldset>

      <p v-else> Already Logged in as {{name}}<br/><br/>
      To logout <router-link to='/logout'>Logout</router-link></p>
      </div>
</template>

<script>
import Vue from 'vue'
import VueNativeNotification from 'vue-native-notification'
var user=localStorage.getItem('username')
Vue.use(VueNativeNotification, {
        requestOnNotify: true
    })
import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
  data () {
    return {
      user: {
        username: '',
        fullname:'',
        password: '',
        phoneno:'',
        email: '',
        favorites:' ',
        read_later: ' '
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
    signup() {
      var a=this.user;
      if(a.username=='' || fullname==''||phoneno==''||email=='')
      {
        this.$notification.show('Connectiyo', {
                    body: "All the fields are mandatory so kindly fill all the details"
          }, {})
          return;
      }
      api.post('/post',a)
      .then(res =>{
          console.log(res);
          this.$notification.show('Connectiyo', {
                    body: "Signup Success"
          }, {})
          document.getElementById('sign').reset();
          api.post('/post-user',a);
      })
      .catch(error => {
        this.$notification.show('Connectiyo', {
                    body: "Signup Failure ... Please Try Again"
        }, {})
        document.getElementById('sign').reset();
      })
    }
  }
}
</script>
<style>
fieldset{
  margin-left : 15%;
  text-align: center;
  margin-top:100px;
  font-size: 30px;
}
/* .frm{
  display: flex;
  align-items: center; 
  flex-direction: column;
  justify-content: center;
} */

button{
  margin-right : 30px;
}
.mybutton{
  text-align: center;
  margin-right : 50px;
}
fieldset{
    text-align: center;
    width : 500px;
    margin-left : 450px;
    margin-top: 50px;
}
input {
  padding : 10px;
   height : 40px;
    text-align: center;
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
legend {
    padding: 0.2em 0.5em;
    border:1px solid black;
    color:rgb(5, 5, 5);
    font-size:90%;
    text-align:center;
    font-size: 20px;
}
</style>