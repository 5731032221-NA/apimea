const csv = require('csv-parser');
const fs = require('fs');
var url = "mongodb://localhost:27017/";
var jso = []
const request = require('request');
var sql = require("mssql");

var config = {
    user: 'SA',
    password: 'Passw0rd',
    server: 'localhost',
    database: 'MEA'
};
fs.createReadStream('profilepic.csv')
    .pipe(csv())
    .on('data', (row) => {
        // console.log(row);
        jso.push({ id: row.id, title: row.title, name: row.name, surname: row.surname, position: row.position, email: row.email })
        // trainface(row.id, row.image)
    })
    .on('end', () => {
        // console.log('CSV file successfully processed');
        // console.log(jso);
        jso.forEach(async (element) => {
            let pool = await sql.connect(config)

            
            // sql.connect(config, function (err,pool) {

                // if (err) console.log(err);
                let request = await pool.request()

                
                // create Request object
                await request.input('id', sql.Int, element.id).input('title', sql.VarChar, element.title).input('name', sql.VarChar, element.name).input('surname', sql.VarChar, element.surname).input('email', sql.VarChar, element.email).input('position', sql.VarChar, element.position)
                request.query('insert into profile (id,title,name,surname,email,position) values (@id,@title,@name,@surname,@email,@position)', function (err, recordset) {

                    if (err) console.log(err)

                    console.log(recordset)
                    // send records as a response
                    // res.send(recordset);

                });
            // });
        })
    });