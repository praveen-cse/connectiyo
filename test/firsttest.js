var expect=require('chai').expect;
var request=require('request');
var mock=require('./mock-data');
var chai=require('chai'), chaiHttp = require('chai-http');
var src=require('../src/server/handler')
chai.use(chaiHttp);
var sample={
    payload:{
        username : 'nnn',
        password : 'nnn',
        fullname : 'naan naan naan',
        phoneno : '9876543345',
        email : 'nnn@gmail.com'
    }
}
var sample1={
    payload:{
        username : 'kk',
        password : 'k',
        fullname : 'naan naan naan',
        phoneno : '9876543345',
        email : 'kk@gmail.com'
    }
}
var sample2={
    payload:{
        ques : 'Who is Chan?',
        questioner : 'kpk',
        hashtags : 'playboy,coder,topper,'
    }
}
var sample3={
    payload:{
        author : 'pk',
        question_id : '31',
        answer : 'Dhoni'
    }
}
it('Login Test',function(done){
    request('http://localhost:3000/pk/pk',function(error,response,body){
        expect(body).to.equal(mock.user);
        done();
    })
})

it('User Credentials Test',function(done){
    request('http://localhost:3000/getusercredentials/pk',function(error,response,body){
        expect(body).to.equal(mock.usercredentials);
        done();
    })
})

it('Tag Search Test',function(done){
    request('http://localhost:3000/getanswerbytag/ICC',function(error,response,body){
        expect(body).to.equal(mock.answer);
        done();
    })
})

it('User details Test',function(done){
    request('http://localhost:3000/getuserdetails/pk',function(error,response,body){
        expect(body).to.equal(mock.userdetails);
        done();
    })
})

it('User Signup Test - Fail ',function(done){
    src.user_details(sample).then(data =>
        {
            expect(JSON.stringify(data)).to.equal(mock.error);
        })
        done();
})

it('User Signup Test - Succ',function(done){
    src.user_details(sample1).then(data =>
        {
            expect(JSON.stringify(data)).to.equal(mock.succ);
        })
        done();
})

it('Post Question - Succ',function(done){
    src.addquestion(sample2).then(data =>
        {
            expect(JSON.stringify(data)).to.equal(mock.succ1);
        })
        done();
})

it('Add Read Test',function(done){
    chai.request('http://localhost:3000/')
        .post("addRead/pk/34")
        .end(function(err,res){
            expect(res.text).to.equal(mock.read);
        });
        done();
    })

it('Add Favorites Test',function(done){
    chai.request('http://localhost:3000/')
        .post("addFav/pk/34")
        .end(function(err,res){
            expect(res.text).to.equal(mock.fav);
        });
        done();
    })

it('Add Answer',function(done){
    src.addanswer(sample3).then(data =>
    {
        console.log(data);
        expect(data).to.equal('Added');
    })
    done();
})