const csv = require('csv-parser');
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const subscriptionKey = '99d0310d30c24046a148cbf795a34121';
var jso = []
const request = require('request');

fs.createReadStream('agedefault.csv')
    .pipe(csv())
    .on('data', (row) => {
        // console.log(row);
        jso.push({ id: row.id, gender: row.gender, margin: row.margin, year: row.year})
        // trainface(row.id, row.image)
    })
    .on('end', () => {
        // console.log('CSV file successfully processed');
        // console.log(jso);
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mea");
            dbo.collection("default").insertMany(jso, function (err, res) {
                if (err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                db.close();
            });
        });
        // let options3 = {
        //     uri: 'https://meafacedetection.cognitiveservices.azure.com/face/v1.0/persongroups/mea/train',
        //     headers: {
        //       'Ocp-Apim-Subscription-Key': subscriptionKey
        //     }
        //   };
        //   request.post(options3, (error3, response3, body3) => {
        //     if (error3) {
        //       console.log('Error: ', error3);
        //       console.log(error3)
        //       return;
        //     }
        //     console.log(response3.statusCode)
        //   });
    });