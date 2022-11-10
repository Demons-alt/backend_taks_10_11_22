const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const nodemailer = require('nodemailer')
const {db} = require('./MySqlConnection');



const readHtml = function (path, callback) {
    fs.readFile(path,{encoding: 'utf-8' }, function(err, html){
        if (err) {
            throw err
        }
        else {
            callback(null, html)
        }
    }) 
}

const sendMailfromHtml = function (args, callback) {
    readHtml(path.join(__dirname, '../assets/EmailTemplate.html'), function(err, html){
        const SqlQuery = `SELECT * FROM ticket_list_activity WHERE id_ticket = ${args.id_ticket}`
        db.query(SqlQuery ,function(err, rows, fields) {
            if (err) throw err;      
            const DataArray = rows
        // const image = path.join(__dirname,'../asset/image')
        const template = handlebars.compile(html);
        const SmtpConfig = {
            pool: false,
            host: 'smtp.gmail.com',
            port: '587',
            secure: false,
            requireTLS: true,
            auth: {
                user: 'fahm3411@gmail.com',
                pass: 'xwqaznyorulbsecf'
            },
            logger: true,
            debug: true
        }
        const transporter = nodemailer.createTransport(SmtpConfig)
        const replacements = {
            data1:[
                {
                    product: 'Test1',
                    description: 'desc product Test1',
                    price: '5500'
                },
                {
                    product: 'Test2',
                    description: 'desc product Test2',
                    price:'6600'
                },
                {
                    product: 'Test3',
                    description: 'desc product Test3',
                    price:'9900'
                },
                {
                    product: 'Test4',
                    description: 'desc product Test4',
                    price: '8800'
                },
            ], DataArray
        }
        const sendHtml = template(replacements)
        // const attachments = [
        //     {
        //         path : `${image}/mustegak3.JPG`,
        //         cid : 'image1'
        //     },
        //     {
        //         path : `${image}/IMG_20220202_085429.jpg`,
        //         cid : 'sleep'
        //     }   
        // ]
        const mailOption = {
            from: args.from || '"Fred Foo 👻" <fahm3411@gmail.com>',
            to: args.email,
            subject: args.subject,
            html: sendHtml,
            // attachments
        }

        transporter.sendMail(mailOption, function(error, info){
            if(error) {
                console.log(error);
            } else {
                console.log("Message sent: %s" , info.response);
                return
            }
            return callback(error)
        })
    })
    })
}

module.exports = {
    sendMailfromHtml
}