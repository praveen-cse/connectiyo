<template>
    <div class='tagsearch' autocomplete='off' >
    <input class='taggg' type='text' placeholder='Enter the tag to search' v-on:keyup="changeInput()" v-model='tag' style='border :none'/>
    <button class="fas fa-search" type='button'  style='margin-left : 20px;' v-on:click ='fun()'></button>
    <div id="result"></div>
    <div class='tagfeedd' id='ff'>
        <strong v-for='entry in arr'>
            <div class='ques'>
           <p><i>{{entry.author}}</i> {{entry.question}} at {{entry.questiontime}}</p>
            <p><i>{{entry.answerer}}</i>  {{entry.answer}}</p>
            </div>
            <button type='button' v-on:click='addFav(entry.question_id)'>Add to Favorites</button>
            <button type='button' v-on:click='addRead(entry.question_id)'>Read Later</button>
            <input type='text' v-if="checkuser(entry.author)" v-model="answer" placeholder="Enter Your Answer Here...">
            <p style='font: 400 11px system-ui;' v-else>You can't have autorization to answer this question</p>
            <button type='button'  v-if="checkuser(entry.author)" v-on:click='addAnswer(entry.question_id,entry.author)'>Answer</button>
        </strong><br/><br/>
    </div> 
</div>
</template>
<script>
var people=[]
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
            arr: [],
            answer : '',
            tag : ''
        }
    },
    methods : {
        matchPeople(input) {
            var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
            return people.filter(function(person) {
            if (person.match(reg)) {
            return person;
            }
        });
        },

        changeInput() {
            console.log(this.tag);
            var autoCompleteResult = this.matchPeople(this.tag);
            document.getElementById("result").innerHTML = autoCompleteResult;
        },
        checkuser(name){
            var s=localStorage.getItem('username');
            if(name == s || s == null)
            {
                return false;
            }
            return true;
        },
        addAnswer(id,name){
            if(this.answer=='')
            {
                this.$notification.show('Connectiyo', {
                    body: 'Enter the Answer Properly'
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
                var mail;
                api.get('/getemail/'+name)
                .then(data=>{
                  api.post('/sendemail/'+data.data);
                })
                this.$notification.show('Connectiyo', {
                    body: 'Answer Added Successfully'
                }, {})
            })
            .catch(err => {
                console.log(err);
            })
            var credit=20;
            api.post('/addcredit/'+ans.author+'/'+credit);
        },
        fun()
        {
            var objj=[],i,k;
            if(this.tag==''){
                this.$notification.show('Connectiyo', {
                    body: 'Enter the tag first'
                }, {})
                return;
            }
            people.push(this.tag);
            api.get('/getanswerbytag/'+this.tag)
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
                    console.log(objj);
                    this.arr.push(objj);
                } 
            })
            .catch(error =>{});
            console.log(this.arr);
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
            api.post('/addFav/'+s+'/'+id);
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
            api.post('/addRead/'+localStorage.getItem('username')+'/'+id);
            this.$notification.show('Connectiyo', {
                body: 'Question marked as Read Later'
            }, {})
        }
    }
}
</script>

<style>
.ques {
    margin-left : 300px;
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
.taggg {
    width: 700px;
    height : 40px;
    text-align: center;
}
</style>
