const csv = require('csv-parser');
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const subscriptionKey = '99d0310d30c24046a148cbf795a34121';
var jso = []
const request = require('request');

function trainface(id,imageUrl){
    console.log(id,imageUrl)
    let options = {
        uri: 'https://meafacedetection.cognitiveservices.azure.com/face/v1.0/persongroups/mea/persons',
        body: '{"name": "'+id+'"}',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': subscriptionKey
        }
      };
      request.post(options, (error, response, body) => {
        if (error) {
          console.log('Error: ', error);
          console.log(error)
          return;
        }
        let par2 = JSON.parse(body);
        // console.log(par3); //{ personId: 'c244aa5d-0973-4665-8ac1-16ac9bfca564' }
        //{ personId: 'afd06242-8bef-4118-8696-b39093dd0247' }
        let options2 = {
          uri: 'https://meafacedetection.cognitiveservices.azure.com/face/v1.0/persongroups/mea/persons/'+par2.personId+'/persistedFaces?detectionModel=detection_02',
          headers: {
    
            'Ocp-Apim-Subscription-Key': subscriptionKey
          },
          body: '{"url": "' + imageUrl + '"}',
        };
        request.post(options2, (error2, response2, body2) => {
          if (error2) {
            console.log('Error: ', error2);
            console.log(error2)
            return;
          }

          // {"persistedFaceId":"c2aac01b-ce86-4179-a47f-3c4b9d430d8
          //{"persistedFaceId":"3f6e9828-1802-43d8-9801-114af362d11c"}
        });
      });
}

fs.createReadStream('profilepic.csv')
    .pipe(csv())
    .on('data', (row) => {
        // console.log(row);
        jso.push({ id: row.id, title: row.title, name: row.name, surname: row.surname, position: row.position, email: row.email , image: row.image ,faceid: row.faceid, encimage: row.encimage})
        // trainface(row.id, row.image)
    })
    .on('end', () => {
        // console.log('CSV file successfully processed');
        // console.log(jso);
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mea");
            dbo.collection("profile").insertMany(jso, function (err, res) {
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