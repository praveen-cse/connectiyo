<template>
    <div>
        <div v-if='checkuser()'>
        <button type='button' v-on:click='logout()'>Log Out</button><br/>
        <p>{{msg}}</p>
        </div>
        <p v-else>Please Login to use this feature</p>
    </div>    
</template>

<script>
import Vue from 'vue'
import VueNativeNotification from 'vue-native-notification'
var user=localStorage.getItem('username')
Vue.use(VueNativeNotification, {
        requestOnNotify: true
    })
export default {
    data(){
        return{
            msg : ''
        }
    },
    methods:{
    checkuser()
    {
        var s=localStorage.getItem('username');
            if(s == null)
            {
                return false;
            }
            return true;
    },
    logout()
    {
        localStorage.removeItem('username');
        this.msg='Logged Out Successfully';
        this.$notification.show('Connectiyo', {
                    body: this.msg
        }, {})
    }
    }
}
</script>
