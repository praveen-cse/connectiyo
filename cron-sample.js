let axios=require('axios');
const api = axios.create({ baseURL: 'http://localhost:3000' })
let cron = require('cron');
let cronConfig = {
  cronTime: '*/60 * * * * *',
  runOnInit: true,
  job: function () {
    var res=[],i
    api.get('http://localhost:3000/getusers')
    .then(res=>{
      for(i=0;i<res.data.length;i++)
      {
        if(res.data[i].credits >= 100 && res.data[i].status=='Normal')
        {
          api.post('/promote/'+res.data[i].username)
          console.log('Promoted to Premium for user '+res.data[i].username)
        }
        else if(res.data[i].credits < 100 && res.data[i].status=='Premium')
        {
          api.post('/back/'+res.data[i].username)
          console.log('Demoted to Normal for user '+res.data[i].username)
        }
      }
    })
    console.log('Running')
  }
}

new cron.CronJob({
  cronTime: cronConfig.cronTime,
  onTick: cronConfig.job,
  start: true,
  runOnInit: cronConfig.runOnInit
});