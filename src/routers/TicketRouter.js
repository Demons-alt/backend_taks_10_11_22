const express = require("express");
const ticketRouter = express.Router();

const {
  AddTicket,
  AllTickets,
  OneTicket,
  GetSummary,
  updateStatus,
  ProduceControl,
} = require("../controllers/TicketController");

ticketRouter.get("/all", AllTickets);
ticketRouter.put("/update/:ticketId", updateStatus);
ticketRouter.post("/add", AddTicket);
ticketRouter.get("/summary", GetSummary);
ticketRouter.get("/list/:ticketId", OneTicket);
ticketRouter.post("/produce", ProduceControl);
ticketRouter.get("/test", (req, res) => {
  res.send("This is work :)");
});

module.exports = ticketRouter;
