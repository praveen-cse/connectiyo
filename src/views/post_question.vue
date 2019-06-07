<template>
    <div class='center'>
    <div  v-if='checkuser()' class="form-popup" id="myForm">
        <fieldset>
        <form class="form-container" id='forr'>
            <h1>Add Question</h1>
            <label>Question  :</label><input type='text' v-model='question.question' required/><span id='requir'>*</span><br/><br/><br/>
            <label>Tags  : </label><p id='hash' v-model='question.hashtags'>{{question.hashtags}}</p><input type='text' id='ne' v-model='temp'/><span id='requir'>*</span><input type='button' style='margin-left : 50px' onclick="document.getElementById('ne').value='';" v-on:click="add();" value='+add tag'/><br/><br/>
            <button type='button' class="btn" v-on:click='addquestion();' value='POST'>Post</button><br/><br/>
            <button type='reset' class='btn'>Reset</button><br/>
            </form>
        </fieldset>
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
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
export default {
    data(){
        return {
            question : {
                question : '',
                hashtags : ''
            },
            temp : ''
        }
    },
    methods : {
        checkuser(){
            var s=localStorage.getItem('username');
            if(s == null)
            {
                this.$notification.show('Connectiyo', {
                    body: 'You Must be logged in for using the feature'
                }, {})
                return false;
            }
            return true;
        },
        addquestion(){
            if(this.question.question == '')
            {
                this.$notification.show('Connectiyo', {
                    body: 'Enter Question first'
                }, {})
                return;
            }
            var a={
                ques : this.question.question,
                questioner : localStorage.getItem('username'),
                hashtags : this.question.hashtags
            };
            console.log(a);
            api.post('/addquestion',a)
            .then(res =>{
                this.$notification.show('Connectiyo', {
                    body: 'Question Added Successfully'
                }, {})
            })
            .catch(error => {
                this.$notification.show('Connectiyo', {
                    body: 'Error on Question add'
                }, {})
            })
            var credit=5;
            api.post('/addcredit/'+a.questioner+'/'+credit);
            document.getElementById('forr').reset();
            this.question.hashtags = '';
        },
        add(){
            if(this.temp=='')
            {
                this.$notification.show('Connectiyo', {
                    body: 'Enter the tag first'
                }, {})
                return;
            }
            this.question.hashtags += this.temp + ',';
        }
    }
}
</script>
<style>
input {
  padding : 10px;
   height : 40px;
    text-align: center;
}
</style>