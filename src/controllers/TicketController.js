const { db } = require("../modules/MySqlConnection");
const response = require("../helpers/BaseRespons");
const { produceQueue } = require('../modules/RabbitMQConnection');

//add ticket to db?
const AddTicket = (req, res) => {
  const {
    ticket_type,
    created_by,
    current_approval_name,
    current_approval_role,
    status,
  } = req.body;

  const sqlQuery = `INSERT INTO ticket (ticket_type, created_by, current_approval_name, current_approval_role,status) VALUE (?,?,?,?,?)`;

  db.query(
    sqlQuery,
    [
      ticket_type,
      created_by,
      current_approval_name,
      current_approval_role,
      status,
    ],
    (err, result) => {
      const object = {
        message: "Success Add Ticket",
      };
      if (err) {
        console.log(err);
        response.Failed(res, err, "FILD10");
      }

      response.Success(res, object, "ASKN10");
    }
  );
};

// get all tickets just for testing not in project
const AllTickets = (req, res) => {
  const sqlQuery = "SELECT ticket_type,created_by,status FROM ticket";

  db.query(sqlQuery, (err, result) => {
    const object = {
      data: result,
    };
    if (err) {
      console.log(err);
      response.Failed(res, err, "FLD20");
    }
    // res.send(result)
    response.Success(res, result, "ASKN20");
  });
};

//get ticket by creator?
const OneTicket = (req, res) => {
  const email = req.body.email;
  const Id = req.params.ticketId;
  const sqlQuery = `SELECT * FROM ticket WHERE created_by = '${Id}'`;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      // console.log(err);
      response.Failed(res, err, "FLD30");
    }

    response.Success(res, result, "ASKN30");
  });
};

// update ticket status
const updateStatus = (req, res) => {
  const status = req.body.status;
  const sqlQuery = `UPDATE ticket SET status = '${status}' WHERE ticket_id = ${req.params.ticketId}`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      response.Failed(res, err, "FLD40");
    }
    console.log(status);
    response.Success(res, "Status Updated", "ASKN40");
  });
};

//get summary my tickets
const GetSummary = (req, res) => {
  const sqlQuery = `select COUNT(if(status='pending',1,NULL)) as pending, COUNT(if(status='reject',1,NULL)) as reject, COUNT(if(status='approve',1,NULL)) as approve from ticket;`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      // console.log(err);
      response.Failed(res, err, "FLD30");
    }

    response.Success(res, result, "ASKN30");
  });
};

const ProduceControl = async (req, res) => {
    const email = req.body.email
    const id_ticket = req.body.id_ticket
    try {
      produceQueue({email: email,
                              subject :  'Rembestmen',
                              id_ticket : id_ticket
    }, 'Testing', (err) => {
        if (err) throw err;
        console.log('Success Produce Queue');
      })
      return res.send( 'Success');
    } catch (error) {
      console.log(error);
     res.send( error);
    }
  };
  

module.exports = {
  AddTicket,
  AllTickets,
  OneTicket,
  GetSummary,
  updateStatus,
  ProduceControl,
};
