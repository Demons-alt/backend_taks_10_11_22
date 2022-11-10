const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const formidable = require("express-formidable");
const app = express();
const { get } = require("lodash");

const { consumeQueue } = require("./modules/RabbitMQConnection");
const SMTPServices = require("./modules/SMTPService");
const Activity = require("./routers/ActivitiyRouter");
const Users = require("./routers/UserRouters");
const Tickets = require("./routers/TicketRouter");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
};

// app.use(formidable())
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/activity", Activity);
app.use("/ticket", Tickets);
app.use("/user/", Users);
app.get("/", (req, res) => res.send("Hello World!"));
consumeQueue("Testing", async (ch, msg) => {
  try {
    console.log("Successfuly retrieve queue");
    const message = JSON.parse(msg.content.toString());
    const messageRabbitMq = get(message, "params.message");

    const sendmail = {
      email: messageRabbitMq.email,
      subject: messageRabbitMq.subject,
      id_ticket : messageRabbitMq.id_ticket
    };
    SMTPServices.sendMailfromHtml(sendmail, (err, result) => {
      if (err) {
        console.log(err);
      }
    });

    console.log("Email retrieved : ", messageRabbitMq.email);
    console.log("Subject retrieved : ", messageRabbitMq.subject);
    ch.ack(msg);
  } catch (error) {
    console.log(error);
    ch.ack(msg);
  }
});

module.exports = app;
