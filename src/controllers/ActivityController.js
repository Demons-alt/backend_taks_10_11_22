const { db } = require("../modules/MySqlConnection");
const response = require("../helpers/BaseRespons");
const RedisService = require("../modules/RedisConnection");
const xlstojson = require("xlsx-to-json-lc");
const { v1 } = require("uuid");
const { result } = require("lodash");


//get data by creator?
const GetActivity = (req, res) =>{
    const Id = req.params.id_ticket
    const sqlQuery = "SELECT * FROM ticket_list_activity WHERE id_ticket = ? "
    db.query(sqlQuery, Id, err, result => {
        const object= {
            data : result
        }
        if (err) {
            //   console.log(err);
            response.Failed(res, err, "FLD20");
          }
          response.Success(res, object, "ASKN20");
    })
}

//fect data from exel table and send to redis for a momment
const UploadExel = (req, res) => {
    xlstojson(
      {
        input: req.files.file.path,
        output: null,
        lowerCaseHeaders: true,
      },
      async function (err, result) {
        const uuid = v1()
        if (err) {
          console.log(err);
        }
        const finalResult = result
          .filter(
            (item) =>
              item.activity_date != "" ||
              item.total_claim != "" ||
              item.description != ""
          )
          .map((item) => {
            return {
              id_ticket: uuid,
              activity_date: item.activity_date,
              total_claim: item.total_claim,
              description: item.description,
            };
          });
        try {
          console.log("store data in redis");
          await RedisService.setEx(uuid, 6000, JSON.stringify(finalResult));
          res.send(JSON.parse(await RedisService.get(uuid)));
        } catch (error) {
          console.log(error);
          res.send(error);
        }
      }
    );
  };

//geting data from redis and post to db
const postData = async (req, res) => {
    const Id = req.params.activityId;
    const redisdata = await RedisService.get(Id);
    const data = JSON.parse(redisdata);
    console.log();
  
    for (const item of data ) {
      try {
        console.log(item);
        db.query(
            `INSERT INTO ticket_list_activity ( id_ticket, description, activity_date, total_claim) VALUE (?,?,?,?)`,
            [item.id_ticket, item.description, item.activity_date, item.total_claim],
            (err, result) => {
              if (err) {
                console.log(err);
              }
              res.send("succes send data")
            })
      } catch (error) {
        console.log(error);
      }
  
      } 
  };

  module.exports = {
    UploadExel,
    postData,
    GetActivity,
  }