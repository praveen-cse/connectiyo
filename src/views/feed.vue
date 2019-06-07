<template>
<div class='userfeed'>
        <p v-if='check()'>You Must be logged in for using the feature</p>
        <strong v-for='entry in field'>
            <div class='ques'>
            <p><i>{{entry.author}}</i> {{entry.question}} at {{entry.questiontime}}</p>
            <p><i>{{entry.answerer}}</i> {{entry.answer}}</p>
            </div>
            <button type='button' v-on:click='addFav(entry.question_id)'>Add to Favorites</button>
            <button type='button' v-on:click='addRead(entry.question_id)'>Read Later</button>
             <input type='text' v-if="checkuser(entry.author)" v-model="answer" placeholder="Enter Your Answer Here...">
             <p style='font: 400 11px system-ui;' v-else>You can't have autorization to answer this question</p>
            <button type='button' v-if="checkuser(entry.author)" v-on:click='addAnswer(entry.question_id)'>Answer</button>
        </strong>
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
            field: [],
            answer : ''
        }
    },
    methods:{
        check(){
            return !(this.checkuser());
        },
        checkuser(name){
            var s=localStorage.getItem('username');
            if(name == s || s == null)
            {
                return false;
            }
            return true;
        },
        addAnswer(id){
            if(this.answer=='')
            {
                this.$notification.show('Connectiyo', {
                    body: 'Enter the answer first'
                }, {})
                return;
            }
            console.log(id);
            var ans={
                answer : this.answer,
                question_id : id,
                author : localStorage.getItem('username')
            }
            console.log(ans);
            api.post('/addAnswer',ans)
            .then(res =>{
                this.$notification.show('Connectiyo', {
                    body: 'Answer Added'
                }, {})
            })
            .catch(err => {
                console.log(err);
            })
            var credit=20;
            api.post('/addcredit/'+ans.author+'/'+credit);
        },
        fillFeed()
        {
            var a=localStorage.getItem('username');
            if(a==null)
            {
                this.$notification.show('Connectiyo', {
                    body: 'You Must be logged in for using the feature'
                }, {})
                return;
            }
            var objj=[],i;
            api.get('/getanswer/'+a)
            .then (res =>{
                console.log(res);
                for(i=0;i<res.data.length;i++)
                {
                    let objj={}
                    objj.question_id=res.data[i].question_id;
                    objj.question=res.data[i].question;
                    objj.questiontime=res.data[i].question_created;
                    objj.author = res.data[i].questioner;
                    objj.hashtags = res.data[i].hashtags;
                    objj.answer=res.data[i].answer;
                    objj.answerer=res.data[i].author;
                    objj.answertime=res.data[i].answer_created;
                    this.field.push(objj);
                } 
            })
            .catch(error =>{});
        },
        addFav(id)
        {
            var s=localStorage.getItem('username');
            if(s == null)
            {
                this.$notification.show('Connectiyo', {
                    body: 'You Must be logged in for using the feature'
                }, {})
                return;
            }
            api.post('/addFav/'+s+'/'+id)
            .then(res=>{
                console.log(res);
            })
            this.$notification.show('Connectiyo', {
                body: 'Question added to Favorites Successfully'
            }, {})
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
            api.post('/addRead/'+localStorage.getItem('username')+'/'+id)
            .then(res=> {
            })
            this.$notification.show('Connectiyo', {
                body: 'Question marked as Read Later'
            }, {})
        }
    },
    beforeMount()
    {
        this.fillFeed();
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
    margin-left : 100px;
}
</style>
