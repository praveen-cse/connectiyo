<template>
    <div id="mForm" >
    <fieldset v-if='checkuser()'>
        <form id='myformm'>
        <h1>Fill the details</h1>
        Password  : <input type='password' v-model='user.password' required/><br/><br/><br/>
        Fullname  : <input type='text' v-model='user.fullname' required/><br/><br/><br/>
        Phone Number  : <input type='tel' pattern="[0-9]{10}" v-model='user.phoneno' required/><br/><br/><br/>
        Email  : <input type='email' v-model='user.email' required/><br/><br/><br/>
        <button type='button' v-on:click='updatedetails()' >Update</button>
    </form>
    </fieldset>
    <p v-else> Please Login to use this feature</p>
    </div>
    </template>
<script>
import Vue from 'vue'
import VueNativeNotification from 'vue-native-notification'
var user=localStorage.getItem('username')
Vue.use(VueNativeNotification, {
        requestOnNotify: true
    })
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
    export default {
        data(){
            return{
                user: {
                password : '',
                fullname: '',
                phoneno : '',
                email : ''
            }
            }
        },
        methods: {
            checkuser()
            {
                if(localStorage.getItem('username')==null){
                    return false;
                }
                return true;
            },
            updatedetails()
            {
            api.post('/updateuser/'+localStorage.getItem('username'),this.user)
            .then(res =>{
                this.$notification.show('Connectiyo', {
                    body: 'Profile Updated'
                }, {})
            })
            .catch(error =>{
                console.log('Error....Check the details');
            })
            document.getElementById('myformm').reset();
            },
        }
    }
    </script>
    
