<template>
    <div class='user-display' v-if='checkuser()'>
        <span style="font-size:40px;"> WELCOME </span><br/>
            Username : {{user.username}}<br/>
            Fullname : {{user.fullname}}<br/>
            PhoneNo : {{user.phoneno}}<br/>
            Email : {{user.email}}<br/>
            Favourites - Count : {{user.favorites}}<br/>
            Read later - Count : {{user.readlater}}<br/>
            Credits : {{user.credits}}<br/>
            Type : {{user.type}} <br/>
    </div>
    <p v-else>Please Login to use this feature</p>
</template>
<script>
import Vue from 'vue'
import _ from 'lodash'
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
            user:{
                username: '',
                fullname : '',
                phoneno :'',
                email : '',
                favorites : '',
                readlater : '',
                credits : '',
                type:''
            }
        }
    },
    methods :{
        checkuser(){
            var s=localStorage.getItem('username');
            if(s == null)
            {
                return false;
            }
            return true;
        },
    },
    beforeMount()
    {
        var payload=localStorage.getItem('username');
        api.get('/getuserdetails/'+payload)
        .then(res =>{
            this.user.username=res.data[0].username;
            this.user.fullname=res.data[0].fullname;
            this.user.phoneno=res.data[0].phoneno;
            this.user.email=res.data[0].email;
            })
        api.get('/getusercredentials/'+payload)
        .then (res =>{
            console.log(res);
            this.user.favorites=_.uniq(res.data[0].favorites).length;
            this.user.readlater=_.uniq(res.data[0].read_later).length;
            this.user.credits=res.data[0].credits;
            this.user.type=res.data[0].status;
            })
    }
}

</script>
