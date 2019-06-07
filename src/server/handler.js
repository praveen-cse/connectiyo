var fs = require("fs");
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const pgp = require("pg-promise")(),
dbConnection = require("./secrets/db_configuration"),
db = pgp(dbConnection);

//sendgrid Configuration
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

//Handler Functions for the HapiJS Server
module.exports={

    // A function that promotes the user to premium
    async promote(req,h){
        var res=[]
        let command = "update user_actions set status='Premium' where username=$1";
        let values=[req.params.name];
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
            console.log(res);
            return res;
    },

    // A function that demotes the user to Normal
    async back(req,h){
        var res=[]
        let command = "update user_actions set status='Normal' where username=$1";
        let values=[req.params.name];
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
            console.log(res);
            return res;
    },

    //A function to retrive basic user details for all users
    async getusers(req,h){
        var res=[]
        let command = "select username,credits,status from user_actions";
        await db
        .any(command)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
            console.log(res);
            return res;
    },

    // A function that verifies the user credentials for login
    async verifyuser (req, h) {
        var res=[]
        let command = "select * from user_details where username = $1 and password = $2";
        let values=[req.params.id,req.params.pass];
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
            console.log(res);
            return res;
    },

    // A function that adds the answer for a question
    async addanswer (req,h){
            const payload=req.payload;
            var res=[];
            let command='insert into answer(author,question_id,answer) values($1,$2,$3)';
            let values=[payload.author,payload.question_id,payload.answer]
            await db
            .any(command,values)
            .then(data => {
                res = data;
                return "Added";
                })
            .catch(error => {return "Failed"});
            return 'Added';
    },

    //A function that marks the question as favourite
    async addfav (req, h) {
        var res=[]
        let command='SELECT * FROM user_actions WHERE $1 = ANY (favorites) and username=$2;'
        let values=[req.params.id,req.params.name];
        db
        .any(command,values)
        .then(ress => {
            if(ress.length==0){
                let c="update user_actions set favorites=array_append(favorites,$1) where username=$2";
                let v=[req.params.id,req.params.name];
                console.log(v)
                db
                .any(c,v)
                .then(data =>{
                })
                .catch(error =>{
                console.log('failure');
            })
        }
        else {
            return ress.length;
        }
        })
        return "done";
    },

    //A function that marks a question as reads_later
    async addread (req, h) {
        var res=[]
        let command='SELECT * FROM user_actions WHERE $1 = ANY (read_later) and username=$2;'
        let values=[req.params.id,req.params.name];
        db
        .any(command,values)
        .then(ress => {
            if(ress.length==0){
                let c="update user_actions set read_later=array_append(read_later,$1) where username=$2";
                let v=[req.params.id,req.params.name];
                db
                .any(c,v)
                .then(data =>{
                })
                .catch(error =>{
                console.log('failure');
            })
        }
        else {
            return ress.length;
        }
        })
        return "done";
    },

    //A function that removes a question from favourite list
    async removefav (req, h) {
        var res=[]
        let c="update user_actions set favorites=array_remove(favorites,$1) where username=$2";
        let v=[req.params.id,req.params.name];
        console.log(v)
        db
        .any(c,v)
        .then(data =>{
        })
        .catch(error =>{
        console.log('failure');
        })
    return "done";
    },

    //A Function that removes a question from read_later list
    async removeread (req, h) {
        var res=[]
        let c="update user_actions set read_later=array_remove(read_later,$1) where username=$2";
        let v=[req.params.id,req.params.name];
        db
        .any(c,v)
        .then(data =>{
        })
        .catch(error =>{
        console.log('failure');
        })
    return "done";
    },

    //A function to retrive the mail address for the specified user
    async getemail (request, h) {
        var res;
        let err="";
        let command =
              "select email from user_details where username=$1";
        let values = [request.params.name];
        await db
            .any(command, values)
            .then(data => {
                console.log(data[0].email);
                res=data[0].email;
            })
            .catch(error => {err=error.detail;})
            return res;
    },

    //A function that makes email notification for questioner once someone answered for a question
    async sendemail (req, h) {
        let email = req.params.email;
        let  msg = {
                   to: '',
                   from: 'connectiyo.offical@gmail.com',
                   subject: 'Connectiyo - A way to connect people',
                   text: 'Someone Answered for your question',
                   html: '<p><i>Alert :</i> Someone have answered to your question<p><a href="http://localhost:8080/">Click </a> to check </strong>',
                 };
         msg.to=email;
         console.log(msg)
         try{
           await sgMail.send(msg);
         }
         catch(e){
             console.log("error")
         }
         return "mail sent";
    },

    //A function that retrives the user details 
    async user_details (request, h) {
        const payload = request.payload;
        let promises=[];
        let result=[];
        let err="";
        let command =
              "INSERT INTO user_details(username,fullname,password,phoneno,email) VALUES ($1,$2,$3,$4,$5)";
        let values = [payload.username,payload.fullname,payload.password,payload.phoneno,payload.email];
        promises.push(
        db
            .any(command, values)
            .then(data => {
                result.push(values);
            })
            .catch(error => {err=error.detail;})
        );
        await Promise.all(promises);
        if (result.length==0){
            var a={
                "Err code" : "10003",
                "Err Msg" : err
            };
            console.log(a);
            return false;
        }
        return true;
    },

    //A function that retrives the user actions
    async user_actions (request, h) {
        const payload = request.payload;
        let promises=[];
        let result=[];
        let err="";
        let command =
              "INSERT INTO user_actions(username,favorites,read_later,credits,status) VALUES ($1,$2,$3,$4,$5)";
        let values = [payload.username,'','',0,'active'];
        promises.push(
        db
            .any(command, values)
            .then(data => {
                result.push(values);
            })
            .catch(error => {err=error.detail;})
        );
        await Promise.all(promises);
        return result;
    },

    //A function that updates the user details
    async updateuser (request, h) {
        const payload = request.payload;
        let promises=[];
        let result=[];
        let username=request.params.username;
        let err="";
        let command =
              "update user_details set fullname=$2,password=$3,phoneno=$4,email=$5 where username=$1";
        let values = [username,payload.fullname,payload.password,payload.phoneno,payload.email];
        promises.push(
        db
            .any(command, values)
            .then(data => {
                result.push(values);
            })
            .catch(error => {err=error.detail;})
        );
        await Promise.all(promises);
        return result;
    },

    //A function that adds a question
    async addquestion (request, h) {
        const payload = request.payload;
        let promises=[];
        let result=[];
        let err="";
        let command ="INSERT INTO question(question,questioner,hashtags) VALUES ($1,$2,$3)";
        let values = [payload.ques,payload.questioner,payload.hashtags];
        console.log(values);
        promises.push(
        db
            .any(command, values)
            .then(data => {
                result.push(values);
            })
            .catch(error => {console.log(error);})
        );
        await Promise.all(promises);
        return result;
    },

    //A function that retrives the favorite list of a given user
    async getFav (request, h) {
        var res=[];
        let command = "select favorites from user_actions where username = $1";
        let values=[request.params.username];
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
            return res;
    },

    //A function that retrives the read later list of a given user
    async getRead (request, h) {
        var res=[];
        let command = "select read_later from user_actions where username = $1";
        let values=[request.params.username];
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
            return res;
    },

    //A function that retrives the actions of a specified user
    async user_creden (request, h) {
        var res=[];
        let command = "select username,credits,status,favorites,read_later from user_actions where username = $1";
        let values=[request.params.username];
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
            return res;
    },

    //A function that retrives the details of a specified user
    async getuser_details (request, h) {
        var res=[];
        let command = "select * from user_details where username = $1";
        let values=[request.params.username];
        console.log(values);
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
            return res;
    },

    //A function that that retrives all the question asked by the given questioner id
    async getanswer (request,h){
        var res=[];
        let command = "select * from answer full join question on question.question_id=answer.question_id where question.questioner = $1 order by question.question_created";
        let values=[request.params.question];
        console.log(values);
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
        console.log(res);
            return res;
    },

    //A function that retrives answer for a specified user ID
    async getanswerbyid (request,h){
        var res=[];
        let command = "select * from answer full join question on question.question_id=answer.question_id where question.question_id=$1";
        let values=[request.params.id];
        console.log(values);
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
        console.log(res);
            return res;
    },

    //A function that gives the question-answer for a specified tag
    async answerbyid (request,h){
        var res=[];
        let command = "select *,question.question_id from question full join answer on question.question_id=answer.question_id where strpos(question.hashtags,$1) >0 or strpos(question.hashtags,$2) >0";
        let values=[request.params.tag+',',','+request.params.tag];
        console.log(values);
        await db
        .any(command,values)
        .then(data => {
            res = data;
            })
        .catch(error => console.log("ERROR:", error.detail));
        console.log(res);
            return res;
    },

    //A function that adds credits to the user based on the user interaction
    async addcredit (request,h){
        var res=[];
        let command="update user_actions set credits=credits+$2 where username=$1";
        let values=[request.params.id,request.params.credit];
        await db
        .any(command,values)
        .then(data =>{
            res=data;
        })
        .catch(error=>console.log('Error'+error));
        return res;
    }  
}