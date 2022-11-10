const app = require('./src/app.js');
const Client = require('./src/modules/RedisConnection');
const db = require('./src/modules/MySqlConnection')
const port = 3000


app.listen(port, async() => {
    await Client.connect(
        console.log('Redis Connected'));

    console.log(`API runging on localhiost ${port}`);
  });