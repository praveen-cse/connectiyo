<template>
    <div class='userfeed'>
        <p v-if='check()'>You Must be logged in for using the feature</p>
        <strong v-for='entry in field'>
            <div class='ques'>
            <p><i>{{entry.author}}</i> {{entry.question}} at {{entry.questiontime}}</p>
            <p><i>{{entry.answerer}}</i> {{entry.answer}}</p>
            </div>
            <button type='button' class='but' v-on:click='remove(entry.question_id)'>UnFavorite</button>
            <button type='button' v-on:click='addRead(entry.question_id)'>Read Later</button>
            <input type='text' v-if="checkuser(entry.author)" v-model="answer" placeholder="Enter Your Answer Here...">
            <p style='font: 400 11px system-ui;' v-else>You can't have autorization to answer this question</p>
            <button type='button' v-if="checkuser(entry.author)" v-on:click='addAnswer(entry.question_id)'>Answer</button>
        </strong>
    </div>
</template>
<script>
import Vue from 'vue'
import _ from 'lodash'
import router from '../router'
import VueNativeNotification from 'vue-native-notification'
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' })
Vue.use(VueNativeNotification, {
        requestOnNotify: true
    })
export default {
    data(){
        return{
            field : [],
            answer : ''
        }
    },
    methods:{
        check(){
            return !(this.checkuser());
        },
        remove(id)
        {
            var user=localStorage.getItem('username');
            api.post('/removeFav/'+user+'/'+id)
            .then(res=>{
                console.log(res.data);
            })
            this.$notification.show('Connectiyo', {
                    body: 'Removed from Favorites List'
                }, {})
            location.reload();
        },
        checkuser(name){
            var s=localStorage.getItem('username');
            console.log(s);
            if(s == name || s == null)
            {
                return false;
            }
            return true;
        },
        addRead(id)
        {
            var s=localStorage.getItem('username');
            if(s == null)
            {
               this.$notification.show('Connectiyo', {
                    body: 'You Must be logged in for using the feature'
                }, {})
                return;
            }
            api.post('/addRead/'+localStorage.getItem('username')+'/'+id);
            this.$notification.show('Connectiyo', {
                body: 'Question marked as Read Later'
            }, {})
        }
    },
    beforeMount()
    {
        var user=localStorage.getItem('username');
        if(user==null)
        {
            this.$notification.show('Connectiyo', {
                    body: 'Please Login to use this feature'
                }, {})
                return;
        }
        var objj=[];
        api.get('getFav/'+user)
        .then(ress=>{
            var a=ress.data[0].favorites,i;
            a=_.uniq(a,false);
            for(i=0;i<a.length;i++)
            {
                api.get('/getanswerbyid/'+a[i])
                .then(res=>{
                    let objj={}
                    objj.question_id=res.data[0].question_id;
                    objj.question=res.data[0].question;
                    objj.questiontime=res.data[0].question_created;
                    objj.author = res.data[0].questioner;
                    objj.hashtags = res.data[0].hashtags;
                    objj.answer=res.data[0].answer;
                    objj.answerer=res.data[0].author;
                    objj.answertime=res.data[0].answer_created;
                    this.field.push(objj);
                })
            }
        })
    }
}
</script>
<style>
.ques {
    margin-left : 50px;
    margin-bottom : 30px;
    margin-top : 30px;
    padding : 15px;
    text-align : left;
    display: flex;
    width : 700px;
    align-items: stretch;
    flex-direction: column;
    /* background-color: DodgerBlue; */
    /* border-style: dotted; */
    border: 1px solid #e67e22;
}
.userfeed{
    text-align: center;
    margin-left : 200px;
}
.but{
    width : 100px;
    float: right;
    text-align : center; 
    padding : 15px;
}
button{
    margin-right: 20px;
    margin-left: 20px;
}
</style>
