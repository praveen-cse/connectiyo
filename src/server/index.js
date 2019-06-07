const Hapi = require('@hapi/hapi');
const Joi = require('joi')
const pgp = require("pg-promise")(),
dbConnection = require("./secrets/db_configuration"),
db = pgp(dbConnection)
var handler=require('./handler')
redis = require("async-redis"),
amqp = require("amqplib/callback_api"),
client = redis.createClient();
const _ = require("lodash");


// Hapi Server Creation
const init = async () => {
    const server = Hapi.server({
        port: 3000, host: 'localhost', "routes": {
            "cors": {
                origin: ["*"],
            }
        }
    });


    //Authorization Phase
    await server.register([{
          plugin: require('./my-scheme'),
        }])
      server.auth.strategy("my-strategy", "my-scheme", {name: 'pk',
      key : "helloooo"})
  
      
      //Before authorization
      server.ext('onPreAuth', function (request, h){
          console.log("This is in PreAuth");
          return h.continue;
      });


      //After Authorization
      server.ext('onPostAuth', function (request, h){
          console.log("This is in onPostAuth");
          return h.continue;
      });



      server.route({ // A route for promoting the user from Normal to Premium
        method : 'POST',
        path : '/promote/{name}',
        handler : handler.promote
    });


    server.route({ // A route for retrive the email address of a particular user
        method : 'GET',
        path: '/getemail/{name}',
        handler : handler.getemail
    });


    server.route({ // A route for demoting the user from Premium to Normal
        method : 'POST',
        path : '/back/{name}',
        handler : handler.back
    });


    server.route({
        method : 'GET', // A route for retrive [username,credits,status] of all users For Cronjob Working
        path : '/getusers',
        handler : handler.getusers
    });


    server.route({
        method: 'GET', // A route for verifying the user for login
        path: '/{id}/{pass}',
        handler: handler.verifyuser,
        // options: {
        //     auth: {strategy: 'my-strategy', mode: 'required'},
        // }
    });


    server.route({
        method : 'POST', // A route for adding answer for a specific question
        path: '/addAnswer',
        handler : handler.addanswer
    }),


    server.route({
        method : 'POST', // A route for making a question as favorites for a specific user
        path :'/addFav/{name}/{id}',
        handler: handler.addfav
    }),


    server.route({
        method : 'POST', // A route for making a question as Read Later for a specific user
        path :'/addRead/{name}/{id}',
        handler: handler.addread
    }),


    server.route({
        method : 'POST', // A route to unfavorite a question 
        path :'/removeFav/{name}/{id}',
        handler: handler.removefav
    }),


    server.route({
        method : 'POST', // A route to make a question readed
        path :'/removeRead/{name}/{id}',
        handler: handler.removeread
    }),


    server.route({
        method : 'POST', // A route to send emails for the answers
        path : '/sendemail/{email}', 
        handler : handler.sendemail
    })


    server.route({
        method: 'POST', // A route for updating the user details
        path: '/post',
        handler: handler.user_details,
        // options: {
        //     auth: {strategy: 'my-strategy', mode: 'required'},
        //     validate: {
        //         payload: {
        //             username : Joi.any().required(),
        //             fullname: Joi.string().required(),
        //             password: Joi.any().required(),
        //             phoneno:Joi.string().required(),
        //             email : Joi.string().required()
        //         }
        //     }
        // }
    });


    server.route({
        method: 'POST', // A route for updating the actions
        path: '/post-user',
        handler: handler.user_actions
        /*options: {
            //auth: {strategy: 'my-strategy', mode: 'required'},
            validate: {
                payload: {
                    username : Joi.any().required(),
                    fullname: Joi.string().required(),
                    password: Joi.any().required(),
                    phoneno:Joi.number().max(10)
                }
            }
        }*/
    });



    server.route({
        method: 'POST', //A route for updating user details
        path: '/updateuser/{username}',
        handler: handler.updateuser
    });



    server.route({
        method: 'POST', //A route for adding question
        path: '/addquestion', 
        handler: handler.addquestion
        /*options: {
            //auth: {strategy: 'my-strategy', mode: 'required'},
            validate: {
                payload: {
                    username : Joi.any().required(),
                    fullname: Joi.string().required(),
                    password: Joi.any().required(),
                    phoneno:Joi.number().max(10)
                }
            }
        }*/
    });


    server.route({
        method: 'GET', //A route for retriving usercredentials
        path: '/getusercredentials/{username}',
        handler: handler.user_creden
        });

    server.route({
        method : 'GET', //A route for retriving userdetails
        path:'/getuserdetails/{username}',
        handler: handler.getuser_details
        });


    server.route({
            method : 'GET', //A route for answers for a particular question
            path : '/getanswer/{question}',
            handler : handler.getanswer
        }),


    server.route({
            method : 'GET', // A route for get all the answers based on specified tag
            path : '/getanswerbytag/{tag}',
            handler : handler.answerbyid
        }),


    server.route({
            method : 'POST', // A route for to add credit for a specified user
            path : '/addcredit/{id}/{credit}',
            handler : handler.addcredit
        }),


    server.route({
            method : 'GET', // A route to retrive the favorites for a specified user
            path : '/getFav/{username}',
            handler : handler.getFav
        }),

    server.route({
            method : 'GET', // A route to retrive the read_later for a specified user
            path : '/getRead/{username}',
            handler : handler.getRead
        }),


    server.route({
            method : 'GET', // A route to get answers for a specified question
            path : '/getanswerbyid/{id}',
            handler : handler.getanswerbyid
        }),


    server.route({
            method: "GET", // A redis cache example for retriving all the user details
            path: "/user-cache/{name}",
            handler: async function(req, res) {
                let id = req.params.name;
              let command = "select * from user_details where username='"+id+"'";
              let cache = await isPresentInCache(id);
              if (!_.isEmpty(cache)) return JSON.parse(cache);
              await db
                .any(command)
                .then(async data => {
                  res = data[0];
                  await client.set("Users_" + id, JSON.stringify(res));
                })
                .catch(error => console.log("ERROR:", error));
              return res;
            },
            // options: {
            //     auth: {strategy: 'my-strategy', mode: 'required'},
            // }
        });
    await server.start();
    console.log('Server running on %s', JSON.stringify(server.info));
};


async function isPresentInCache(id) { // A function to check whether the given user's details are present in cache or not
    try {
      let cache = await client.get("Users_" + id);
      if (!_.isEmpty(cache)) 
      {
          console.log(cache);
        return cache;
      }
      return {};
    } catch (err) {
      console.log(err);
    }
  }
  
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();