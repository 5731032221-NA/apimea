const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
var cors = require('cors')
var multer = require('multer')
var multerAzure = require('multer-azure')
const request = require('request');
global.atob = require("atob");
const CryptoJS = require("crypto-js");
// const axios = require('axios');
// const bodyParser = require('body-parser')
var ObjectId = require('mongodb').ObjectID;
var master_key = 'meafacialkeycam1';
app.use(express.json())
const subscriptionKey = '99d0310d30c24046a148cbf795a34121';
const issue2options = {
  origin: true,
  methods: ["POST"],
  credentials: true,
  maxAge: 3600
};




app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST,DELETE");
  return next();
});

app.get('/', function (req, res) {
  res.send('hello world')
})

app.post('/posttrainimage', function (req, res) {
  let options = {
    uri: 'https://meafacedetection.cognitiveservices.azure.com/face/v1.0/persongroups/mea/persons',
    body: '{"name": "' + req.body.id + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  };
  request.post(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      res.send(error)
      return;
    }
    let par2 = JSON.parse(body);
    // console.log(par3); //{ personId: 'c244aa5d-0973-4665-8ac1-16ac9bfca564' }
    //{ personId: 'afd06242-8bef-4118-8696-b39093dd0247' }
    let options2 = {
      uri: 'https://meafacedetection.cognitiveservices.azure.com/face/v1.0/persongroups/mea/persons/' + par2.personId + '/persistedFaces?detectionModel=detection_02',
      headers: {

        'Ocp-Apim-Subscription-Key': subscriptionKey
      },
      body: '{"url": ' + '"' + req.body.imageUrl + '"}',
    };
    request.post(options2, (error2, response2, body2) => {
      if (error2) {
        console.log('Error: ', error2);
        res.send(error2)
        return;
      }
      let options3 = {
        uri: 'https://meafacedetection.cognitiveservices.azure.com/face/v1.0/persongroups/mea/train',
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey
        }
      };
      request.post(options3, (error3, response3, body3) => {
        if (error3) {
          console.log('Error: ', error3);
          res.send(error3)
          return;
        }
        res.send(response3.statusCode)
      });
      // {"persistedFaceId":"c2aac01b-ce86-4179-a47f-3c4b9d430d8
      //{"persistedFaceId":"3f6e9828-1802-43d8-9801-114af362d11c"}
    });
  });

});


app.get('/gethistoricalemo', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("historical");
    // try{
    dbo.collection("emo").find().project({_id: 0}).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      // result.forEach(function (item) {

      //   if (item.encimmage != "" && item.encimmage != null) {
      //     // console.log(item.encimmage);
      //     var bytes = CryptoJS.AES.decrypt(item.encimmage, 'secret key 123');
      //     item['encimmage'] = bytes.toString(CryptoJS.enc.Utf8);
      //   }
      // });
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});

app.get('/gethistoricalcheckin', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("historical");
    // try{
    dbo.collection("checkin").find().project({_id: 0}).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      // result.forEach(function (item) {

      //   if (item.encimmage != "" && item.encimmage != null) {
      //     // console.log(item.encimmage);
      //     var bytes = CryptoJS.AES.decrypt(item.encimmage, 'secret key 123');
      //     item['encimmage'] = bytes.toString(CryptoJS.enc.Utf8);
      //   }
      // });
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});

app.get('/getmeaprofile', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
    dbo.collection("profile").find().project({encimage: 0}).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      // result.forEach(function (item) {

      //   if (item.encimmage != "" && item.encimmage != null) {
      //     // console.log(item.encimmage);
      //     var bytes = CryptoJS.AES.decrypt(item.encimmage, 'secret key 123');
      //     item['encimmage'] = bytes.toString(CryptoJS.enc.Utf8);
      //   }
      // });
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});

app.get('/getmeaprofileandimage', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
    dbo.collection("profile").find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      result.forEach(function (item) {

        if (item.encimage != "" && item.encimage != null) {
          // console.log(item.encimmage);
          var bytes = CryptoJS.AES.decrypt(item.encimage, 'meaprofilepic');
          item['encimage'] = bytes.toString(CryptoJS.enc.Utf8);
        }
      });
      res.json(result);
      db.close();
    });
  });
});

app.get('/getimagebyid/:id', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
      var query = { id: req.params.id };
      dbo.collection("profile").find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      result.forEach(function (item) {

        if (item.encimage != "" && item.encimage != null) {
          // console.log(item.encimmage);
          var bytes = CryptoJS.AES.decrypt(item.encimage, 'meaprofilepic');
          item['encimage'] = bytes.toString(CryptoJS.enc.Utf8);
        }
      });
      res.json(result);
      db.close();
    });
  });
});

app.get('/countmeaprofile', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
    dbo.collection("profile").find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result.length);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});


app.get('/getuserprofile/:id', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
    var query = { id: req.params.id };
    dbo.collection("profile").find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});

app.get('/getmeaprofile/:id', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
    var query = { _id: ObjectId(req.params.id) };
    dbo.collection("profile").find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});

app.post('/postmeaprofile/:id', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
    var query = { _id: ObjectId(req.params.id) };
    var newvalues = { $set: { title: req.body.title, name: req.body.name, surname: req.body.surname, email: req.body.email, position: req.body.position } };
    dbo.collection("profile").updateOne(query, newvalues, function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});

app.post('/postmeapic/:id', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
    var query = { _id: ObjectId(req.params.id) };
    var newvalues = { $set: { encimage: req.body.image } };
    dbo.collection("profile").updateOne(query, newvalues, function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});


app.post('/postmeaprofile', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // console.log("req", req.body);
    // res.send(req.body);
    var myobj = { id: req.body.id, title: req.body.title, name: req.body.name, surname: req.body.surname, email: req.body.email, position: req.body.position, image: req.body.image };
    dbo.collection("profile").insertOne(myobj, function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });

  });
});

app.delete('/deletemeaprofile/:id', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // console.log("req", req.body);
    // res.send(req.body);
    var query = { _id: ObjectId(req.params.id) };
    dbo.collection("profile").deleteMany(query, function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });

  });
});

app.get('/getmeadefault', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{

    dbo.collection("default").find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});

app.get('/getmeadefault/:id', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let year = date_ob.getFullYear();
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // try{
    var query = { id: req.params.id };
    dbo.collection("default").find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      // console.log(year);
      // console.log(result[0].year);
      // console.log(parseInt(result[0].year));
      // console.log(year - parseInt(result[0].year));
      result[0].age = year - parseInt(result[0].year) -1958;
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});

app.get('/getcropimage/:id', cors(issue2options), function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("image");
    // try{
    var query = { id: req.params.id };
    dbo.collection("crop").find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      var rawData = atob(result[0].date);


      var iv = rawData.substring(0, 16);
      var crypttext = rawData.substring(16);

      //Parsers
      crypttext = CryptoJS.enc.Latin1.parse(crypttext);
      iv = CryptoJS.enc.Latin1.parse(iv);
      key = CryptoJS.enc.Utf8.parse(master_key);

      // Decrypt
      var plaintextArray = CryptoJS.AES.decrypt(
        { ciphertext: crypttext },
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      // Can be Utf8 too
      output_plaintext = CryptoJS.enc.Latin1.stringify(plaintextArray);
      res.json({ "data": output_plaintext });
      //console.log(result);

      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});


// app.get('/getcheckin', function (req, res) {
//   res.json([{ "_id": "5e97ad6fdf114e7270e2c215", "id": "1433406", "checkin": "07:57", "checkindatetime": "20200416075711", "checkinMonth": "2020-04", "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 1, "sadness": 0, "surprise": 0 } }, "checkinEmo": "neutral", "checkinImageCrop": "2020-04-16-1-07571137-crop.jpg", "camerain": 1, "checkout": "", "checkoutEmotion": { "gender": "", "age": 0 }, "checkoutEmo": "", "checkoutImageCrop": "", "cameraout": 0, "checkoutdatetime": "", "checkoutMonth": "" }, { "_id": "5e97b282df114e7270e2c22a", "id": "1674425", "checkin": "08:18", "checkindatetime": "20200416081853", "checkinMonth": "2020-04", "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 1, "sadness": 0, "surprise": 0 } }, "checkinEmo": "neutral", "checkinImageCrop": "2020-04-16-1-08185324-crop.jpg", "camerain": 1, "checkout": "", "checkoutEmotion": { "gender": "", "age": 0 }, "checkoutEmo": "", "checkoutImageCrop": "", "cameraout": 0, "checkoutdatetime": "", "checkoutMonth": "" }, { "_id": "5e97b284df114e7270e2c238", "id": "1576001", "checkin": "08:18", "checkindatetime": "20200416081856", "checkinMonth": "2020-04", "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 1, "sadness": 0, "surprise": 0 } }, "checkinEmo": "neutral", "checkinImageCrop": "2020-04-16-1-08185624-crop.jpg", "camerain": 1, "checkout": "", "checkoutEmotion": { "gender": "", "age": 0 }, "checkoutEmo": "", "checkoutImageCrop": "", "cameraout": 0, "checkoutdatetime": "", "checkoutMonth": "" }, { "_id": "5e97b285df114e7270e2c23d", "id": "1559425", "checkin": "08:18", "checkindatetime": "20200416081854", "checkinMonth": "2020-04", "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 1, "sadness": 0, "surprise": 0 } }, "checkinEmo": "neutral", "checkinImageCrop": "2020-04-16-1-08185468-crop.jpg", "camerain": 1, "checkout": "", "checkoutEmotion": { "gender": "", "age": 0 }, "checkoutEmo": "", "checkoutImageCrop": "", "cameraout": 0, "checkoutdatetime": "", "checkoutMonth": "" }, { "_id": "5e97b297df114e7270e2c245", "id": "2515908", "checkin": "08:18", "checkindatetime": "20200416081850", "checkinMonth": "2020-04", "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 1, "sadness": 0, "surprise": 0 } }, "checkinEmo": "neutral", "checkinImageCrop": "2020-04-16-1-08185049-crop.jpg", "camerain": 1, "checkout": "", "checkoutEmotion": { "gender": "", "age": 0 }, "checkoutEmo": "", "checkoutImageCrop": "", "cameraout": 0, "checkoutdatetime": "", "checkoutMonth": "" }])
// });
app.get('/getcheckin', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});


app.get('/getprofile', function (req, res) {

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("Profile");
    // try{
    dbo.collection("employee").find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});





app.get('/getcheckinbydate/:dateparem', function (req, res) {
  // let date_ob = new Date();
  // let date = ("0" + date_ob.getDate()).slice(-2);

  // // current month
  // let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // // current year
  // let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    //console.log("checkin." +req.params.dateparem)
    dbo.collection("checkin." + req.params.dateparem).find().toArray(function (err, result) {
      if (err) res.send(err.stack);
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });
});


app.get('/insertmock', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";


  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("checkin");
    //var dbo = db.db("mea");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();
    let hours = (parseInt(date_ob.getHours()) + 7).toString();

    // current minutes
    let minutes = date_ob.getMinutes();


    // current seconds
    let seconds = date_ob.getSeconds();
    var myobj = [{ "_id": "5e76115c2fa0df8a9141e941", "id": "1733701", "checkin": "20:06", "checkindatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds), "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0.004, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0.995, "sadness": 0.001, "surprise": 0 }, "blur": { "blurLevel": "medium", "value": 0.33 } }, "checkinImageCrop": "https://oneteamblob.blob.core.windows.net/facedetection/2020-03-211-200634-crop.jpg", "camerain": 1, "checkout": "20:08", "checkoutEmotion": { "gender": "female", "age": 23, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.004, "neutral": 0.994, "sadness": 0, "surprise": 0.001 }, "blur": { "blurLevel": "low", "value": 0.19 } }, "checkoutImageCrop": "https://oneteamblob.blob.core.windows.net/facedetection/2020-03-212-200839-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds) }, { "_id": "5e7611602fa0df8a9141e948", "id": "2006503", "checkin": "20:06", "checkindatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds), "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0.001, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0.989, "sadness": 0.01, "surprise": 0 }, "blur": { "blurLevel": "high", "value": 0.98 } }, "checkinImageCrop": "https://oneteamblob.blob.core.windows.net/facedetection/2020-03-211-200639-crop.jpg", "camerain": 1, "checkout": "20:08", "checkoutEmotion": { "gender": "female", "age": 23, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.001, "neutral": 0.998, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "medium", "value": 0.6 } }, "checkoutImageCrop": "https://oneteamblob.blob.core.windows.net/facedetection/2020-03-212-200847-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds) }, { "_id": "5e7611662fa0df8a9141e94f", "id": "1537934", "checkin": "20:06", "checkindatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds), "checkinEmotion": { "gender": "male", "age": 30, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.001, "neutral": 0.999, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "low", "value": 0.23 } }, "checkinImageCrop": "https://oneteamblob.blob.core.windows.net/facedetection/2020-03-211-200645-crop.jpg", "camerain": 1, "checkout": "20:08", "checkoutEmotion": { "gender": "male", "age": 36, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.652, "neutral": 0.347, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "low", "value": 0.02 } }, "checkoutImageCrop": "https://oneteamblob.blob.core.windows.net/facedetection/2020-03-212-200856-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + seconds) }];
    //dbo.collection("checkattendance").drop(function(err,delOK){
    dbo.collection("checkin." + year + "-" + month + "-" + date).insertMany(myobj, function (err, result) {
      // dbo.collection("lastid").drop(function(err,delOK){
      if (err) throw err;
      res.send("inserted");
      db.close();
    });
  });

});


app.get('/mock', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";

  const client1 = new MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("checkin");
    //var dbo = db.db("mea");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();
    //dbo.collection("checkattendance").drop(function(err,delOK){
    dbo.collection("checkin." + year + "-" + month + "-" + date).drop(function (err, delOK) {
      // dbo.collection("lastid").drop(function(err,delOK){
      if (err) throw err;
      if (delOK) res.send("Collection deleted");
      db.close();
    });
  });

  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("checkin");
    //var dbo = db.db("mea");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();
    let hours = ("0" + (parseInt(date_ob.getHours()) + 7).toString()).slice(-2);

    // current minutes
    let minutes = ("0" + (date_ob.getMinutes())).slice(-2);


    // current second
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    // var myobj = [{ "_id": "5e76115c2fa0df8a9141e941", "id": "1733701", "checkin": "20:06", "checkindatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 1).toString()).slice(-2)), "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0.004, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0.995, "sadness": 0.001, "surprise": 0 }, "blur": { "blurLevel": "medium", "value": 0.33 } }, "checkinImageCrop": "2020-03-261-154303-crop.jpg", "camerain": 1, "checkout": "20:08", "checkoutEmotion": { "gender": "female", "age": 23, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.004, "neutral": 0.994, "sadness": 0, "surprise": 0.001 }, "blur": { "blurLevel": "low", "value": 0.19 } }, "checkoutImageCrop": "2020-03-262-154534-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 2).toString()).slice(-2)) }, { "_id": "5e7611602fa0df8a9141e948", "id": "2006503", "checkin": "20:06", "checkindatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 3).toString()).slice(-2)), "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0.001, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0.989, "sadness": 0.01, "surprise": 0 }, "blur": { "blurLevel": "high", "value": 0.98 } }, "checkinImageCrop": "2020-03-261-154308-crop.jpg", "camerain": 1, "checkout": "20:08", "checkoutEmotion": { "gender": "female", "age": 23, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.001, "neutral": 0.998, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "medium", "value": 0.6 } }, "checkoutImageCrop": "2020-03-262-154542-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 4).toString()).slice(-2)) }, { "_id": "5e7611662fa0df8a9141e94f", "id": "1537934", "checkin": "20:06", "checkindatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 5).toString()).slice(-2)), "checkinEmotion": { "gender": "male", "age": 30, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0.999, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "low", "value": 0.23 } }, "checkinImageCrop": "2020-03-261-154314-crop.jpg", "camerain": 1, "checkout": "20:08", "checkoutEmotion": { "gender": "male", "age": 36, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.652, "neutral": 0.347, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "low", "value": 0.02 } }, "checkoutImageCrop": "2020-03-262-154552-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 6).toString()).slice(-2)) }];
    var myobj = [{ "_id": "5e870e41905cd096c1fd3a4e", "id": "1733701", "checkin": ("06:" + minutes), "checkindatetime": (year + "" + month + "" + date + "06" + minutes + "" + ("0" + (parseInt(seconds) + 1).toString()).slice(-2)), "checkinMonth": "2020-04", "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0.004, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0.995, "sadness": 0.001, "surprise": 0 }, "blur": { "blurLevel": "medium", "value": 0.33 } }, "checkinEmo": "contempt", "checkinImageCrop": "2020-04-031-172151-crop.jpg", "camerain": 1, "checkout": (hours + ":" + minutes), "checkoutEmotion": { "gender": "female", "age": 23, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.004, "neutral": 0.994, "sadness": 0, "surprise": 0.001 }, "blur": { "blurLevel": "low", "value": 0.19 } }, "checkoutEmo": "happiness", "checkoutImageCrop": "2020-04-032-172321-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 2).toString()).slice(-2)), "checkoutMonth": "2020-04" }, { "_id": "5e870e46905cd096c1fd3a60", "id": "2006503", "checkin": (hours + ":" + minutes), "checkindatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 3).toString()).slice(-2)), "checkinMonth": "2020-04", "checkinEmotion": { "gender": "female", "age": 19, "emotion": { "anger": 0, "contempt": 0.001, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0.989, "sadness": 0.01, "surprise": 0 }, "blur": { "blurLevel": "high", "value": 0.98 } }, "checkinEmo": "sadness", "checkinImageCrop": "2020-04-031-172157-crop.jpg", "camerain": 1, "checkout": (hours + ":" + minutes), "checkoutEmotion": { "gender": "female", "age": 23, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.001, "neutral": 0.998, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "medium", "value": 0.6 } }, "checkoutEmo": "happiness", "checkoutImageCrop": "2020-04-032-172329-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 4).toString()).slice(-2)), "checkoutMonth": "2020-04" }, { "_id": "5e870e4c905cd096c1fd3a7d", "id": "1537934", "checkin": ("06:" + minutes), "checkindatetime": (year + "" + month + "" + date + "06" + minutes + "" + ("0" + (parseInt(seconds) + 5).toString()).slice(-2)), "checkinMonth": "2020-04", "checkinEmotion": { "gender": "male", "age": 30, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0, "neutral": 0.999, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "low", "value": 0.23 } }, "checkinEmo": "anger", "checkinImageCrop": "2020-04-031-172203-crop.jpg", "camerain": 1, "checkout": (hours + ":" + minutes), "checkoutEmotion": { "gender": "male", "age": 36, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.652, "neutral": 0.347, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "low", "value": 0.02 } }, "checkoutEmo": "happiness", "checkoutImageCrop": "2020-04-032-172339-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 6).toString()).slice(-2)), "checkoutMonth": "2020-04" }, { "_id": "5e870e4c905cd096c1fd3a72", "id": "2126709", "checkin": ("06:" + minutes), "checkindatetime": (year + "" + month + "" + date + "06" + minutes + "" + ("0" + (parseInt(seconds) + 7).toString()).slice(-2)), "checkinMonth": "2020-04", "checkinEmotion": { "gender": "male", "age": 30, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.001, "neutral": 0.999, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "low", "value": 0.23 } }, "checkinEmo": "happiness", "checkinImageCrop": "2020-04-031-172203-crop.jpg", "camerain": 1, "checkout": (hours + ":" + minutes), "checkoutEmotion": { "gender": "male", "age": 36, "emotion": { "anger": 0, "contempt": 0, "disgust": 0, "fear": 0, "happiness": 0.652, "neutral": 0.347, "sadness": 0, "surprise": 0 }, "blur": { "blurLevel": "low", "value": 0.02 } }, "checkoutEmo": "happiness", "checkoutImageCrop": "2020-04-032-172339-crop.jpg", "cameraout": 2, "checkoutdatetime": (year + "" + month + "" + date + "" + hours + "" + minutes + "" + ("0" + (parseInt(seconds) + 8).toString()).slice(-2)), "checkoutMonth": "2020-04" }]
    //dbo.collection("checkattendance").drop(function(err,delOK){
    dbo.collection("checkin." + year + "-" + month + "-" + date).insertMany(myobj, function (err, result) {
      // dbo.collection("lastid").drop(function(err,delOK){
      if (err) throw err;
      res.send("inserted");
      db.close();
    });
  });

});

app.get('/removedetect', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("checkin");
    //var dbo = db.db("mea");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();
    //dbo.collection("checkattendance").drop(function(err,delOK){
    dbo.collection("checkin." + year + "-" + month + "-" + date).drop(function (err, delOK) {
      // dbo.collection("lastid").drop(function(err,delOK){
      if (err) throw err;
      if (delOK) res.send("Collection deleted");
      db.close();
    });
  });

});

app.get('/getdetect', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("detect");
    // try{
    //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});


app.get('/getmonthlyemo', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    //console.log("checkin." + year + "-" + month + "-" + date)
    var arr = {}
    var count = parseInt(date);
    var datearr = ([...Array(parseInt(date)).keys()].map(x => ++x))
    datearr.forEach(datej => {
      let j = ("0" + datej).slice(-2);
      dbo.collection("checkin." + year + "-" + month + "-" + j).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);
        // console.log(j);
        result.forEach(element => {
          if (element.checkinEmo == "happiness" || element.checkinEmo == "surprise") {
            if (arr[element.id] == null) {
              arr[element.id] = 1;
            } else {
              arr[element.id]++;
            }

          }

          if (element.checkoutEmo == "happiness" || element.checkoutEmo == "surprise") {
            if (arr[element.id] == null) {
              arr[element.id] = 1;
            } else {
              arr[element.id]++;
            }

          }
        });
        count--;
        if (count == 0) {
          // console.log("done");
          res.json(arr);
          db.close();
        }



      });
    });


  });

});


app.get('/getdailyhappy', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");



    dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      // console.log(j);
      // let maxhh = 0;
      // let maxmm = 0;

      var arr = {}
      result.forEach(element => {


        if (element.checkinEmo == "happiness" || element.checkinEmo == "surprise") {
          arr[element.id] = (element.checkinEmotion.emotion.happiness * 100 + element.checkinEmotion.emotion.surprise * 100) / 2;

        }

        if (element.checkoutEmo == "happiness" || element.checkoutEmo == "surprise") {
          if (arr[element.id] == null) {
            arr[element.id] = (element.checkoutEmotion.emotion.happiness * 100 + element.checkoutEmotion.emotion.surprise * 100);

          } else {
            arr[element.id] += (element.checkoutEmotion.emotion.happiness * 100 + element.checkoutEmotion.emotion.surprise * 100);
          }

        }


        // console.log("done");


      });
      res.json(arr);
      db.close();
    });



  });

});


app.get('/getdailyworktime', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");



    dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      // console.log(j);
      // let maxhh = 0;
      // let maxmm = 0;
      let checkouthh = date_ob.getHours();;
      let checkoutmm = date_ob.getMinutes();
      var arr = {}
      result.forEach(element => {


        if (element.checkoutdatetime != '') {
          checkouthh = parseInt(element.checkoutdatetime.substring(8, 10));
          checkoutmm = parseInt(element.checkoutdatetime.substring(10, 12));

        }
        // if ((  checkouthh- parseInt(element.checkindatetime.substring(8, 10)) > maxhh ) || ((checkouthh -  parseInt(element.checkindatetime.substring(8, 10)) == maxhh) && ( checkoutmm - parseInt(element.checkindatetime.substring(10, 12)) > checkoutmm))) {
        // if (arr[element.id] == null) {

        if (parseInt(element.checkindatetime.substring(8, 10)) < 7 || ((parseInt(element.checkindatetime.substring(8, 10)) == 7) && (parseInt(element.checkindatetime.substring(10, 12)) < 41))) {
          arr[element.id] = ((checkouthh - parseInt(element.checkindatetime.substring(8, 10))) * 60) + (checkoutmm - parseInt(element.checkindatetime.substring(10, 12)));
        }else {
          arr[element.id] = -1* (((checkouthh - parseInt(element.checkindatetime.substring(8, 10))) * 60) + (checkoutmm - parseInt(element.checkindatetime.substring(10, 12))));
        }

        // } else {
        //   arr[element.id]++;
        // }
        // console.log(arr);

        // }
      });

      // console.log("done");
      res.json(arr);
      db.close();

    });


  });

});

app.get('/getmonthlyontime', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    //console.log("checkin." + year + "-" + month + "-" + date)
    var arr = {}
    var count = parseInt(date);
    var datearr = ([...Array(parseInt(date)).keys()].map(x => ++x))
    datearr.forEach(datej => {
      let j = ("0" + datej).slice(-2);
      dbo.collection("checkin." + year + "-" + month + "-" + j).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);
        // console.log(j);
        result.forEach(element => {
          if (parseInt(element.checkindatetime.substring(8, 10)) < 7 || ((parseInt(element.checkindatetime.substring(8, 10)) == 7) && (parseInt(element.checkindatetime.substring(10, 12)) < 41))) {
            if (arr[element.id] == null) {
              arr[element.id] = 1;
            } else {
              arr[element.id]++;
            }
            // console.log(arr);

          }
        });
        count--;
        if (count == 0) {
          // console.log("done");
          res.json(arr);
          db.close();
        }



      });
    });


  });

});

app.get('/getmonthlyovertime', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    //console.log("checkin." + year + "-" + month + "-" + date)
    var arr = {}
    var count = parseInt(date);
    var datearr = ([...Array(parseInt(date)).keys()].map(x => ++x))
    datearr.forEach(datej => {
      let j = ("0" + datej).slice(-2);
      dbo.collection("checkin." + year + "-" + month + "-" + j).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);
        // console.log(j);
        result.forEach(element => {
          if (parseInt(element.checkindatetime.substring(8, 10)) > 17 || ((parseInt(element.checkindatetime.substring(8, 10)) == 16) && (parseInt(element.checkindatetime.substring(10, 12)) > 30))) {
            if (arr[element.id] == null) {
              arr[element.id] = 1;
            } else {
              arr[element.id]++;
            }
            // console.log(arr);

          }
        });
        count--;
        if (count == 0) {
          // console.log("done");
          res.json(arr);
          db.close();
        }



      });
    });


  });

});

app.get('/getdetect', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("detect");
    // try{
    //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});



app.get('/countemo', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    let anger = 0,
      contempt = 0,
      disgust = 0,
      fear = 0,
      happiness = 0,
      neutral = 0,
      sadness = 0,
      surprise = 0;
    // try{
    //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkattendance").find({ "Date": year + "-" + month + "-" + date }).toArray(function (err, result) {
      if (err) res.json("[]");

      // //console.log(result);

      for (let i = 0; i < result.length; i++) {
        let emotion1 = result[i].checkin.emotion.emotion;
        let emotion2 = result[i].checkout.emotion.emotion;

        //console.log("emo:", emotion1);
        let maxProp = null
        let maxValue = -1
        let secProp = null
        let secValue = -1

        for (var prop in emotion1) {
          if (emotion1.hasOwnProperty(prop)) {

            let value = emotion1[prop]
            if (value > maxValue) {
              secValue = maxValue;
              secProp = maxProp
              maxValue = value;
              maxProp = prop
            } else if (secValue < value) {
              secValue = value;
              secProp = prop
            }
          }
        }

        if (maxProp == 'neutral') {
          if (maxValue == 1) {
            neutral++;
          }
          else if (maxValue < 1) {
            if (secProp == 'anger') anger++;
            else if (secProp == 'contempt') contempt++;
            else if (secProp == 'disgust') disgust++;
            else if (secProp == 'fear') fear++;
            else if (secProp == 'happiness') happiness++;
            else if (secProp == 'sadness') sadness++;
            else if (secProp == 'surprise') surprise++;
          }
        }
        else if (maxProp == 'anger') anger++;
        else if (maxProp == 'contempt') contempt++;
        else if (maxProp == 'disgust') disgust++;
        else if (maxProp == 'fear') fear++;
        else if (maxProp == 'happiness') happiness++;
        else if (maxProp == 'sadness') sadness++;
        else if (maxProp == 'surprise') surprise++;

        // let maxProp = null
        // let maxValue = -1
        // let secProp = null
        // let secValue = -1

        // for (var prop in emotion2) {
        //   if (emotion2.hasOwnProperty(prop)) {

        //     let value = emotion2[prop]
        //     if (value > maxValue) {
        //       secValue = maxValue;
        //       secProp = maxProp
        //       maxValue = value;
        //       maxProp = prop
        //     } else if (secValue < value) {
        //       secValue = value;
        //       secProp = prop
        //     }
        //   }
        // }

        // if (result[i].checkout.emotion != "") {
        //   if (maxProp == 'neutral') {
        //     if (maxValue == 1) {
        //       neutral++;
        //     }
        //     else if (maxValue < 1) {
        //       if (secProp == 'anger') anger++;
        //       else if (secProp == 'contempt') contempt++;
        //       else if (secProp == 'disgust') disgust++;
        //       else if (secProp == 'fear') fear++;
        //       else if (secProp == 'happiness') happiness++;
        //       else if (secProp == 'sadness') sadness++;
        //       else if (secProp == 'surprise') surprise++;
        //     }
        //   }
        //   else if (maxProp == 'anger') anger++;
        //   else if (maxProp == 'contempt') contempt++;
        //   else if (maxProp == 'disgust') disgust++;
        //   else if (maxProp == 'fear') fear++;
        //   else if (maxProp == 'happiness') happiness++;
        //   else if (maxProp == 'sadness') sadness++;
        //   else if (maxProp == 'surprise') surprise++;
        // }


      }

      res.json(
        {
          anger: anger,
          contempt: contempt,
          disgust: disgust,
          fear: fear,
          happiness: happiness,
          sadness: sadness,
          surprise: surprise,
          neutral: neutral
        }
      );
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});

app.get('/getcheckinbycamera/:cam', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    var query = { "camerain": parseInt(req.params.cam) };
    dbo.collection("checkin." + year + "-" + month + "-" + date).find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});


app.get('/getcheckoutbycamera/:cam', function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    var query = { "cameraout": parseInt(req.params.cam) };
    dbo.collection("checkin." + year + "-" + month + "-" + date).find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});


//////////////////////////////////////////////////////////////////////////////////////////////////

///////////////API For Dahboard/////////////////////
app.get('/getgrapghperiod', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getgrapghperiod");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      let period = [
        { "time": 6, "in": 0, "out": 0 },
        { "time": 8, "in": 0, "out": 0 },
        { "time": 10, "in": 0, "out": 0 },
        { "time": 12, "in": 0, "out": 0 },
        { "time": 14, "in": 0, "out": 0 },
        { "time": 16, "in": 0, "out": 0 },
        { "time": 18, "in": 0, "out": 0 },
        { "time": 20, "in": 0, "out": 0 }];

      for (let i = 0; i < result.length; i++) {
        if ((result[i].checkin).substring(0, 2) == "05" || (result[i].checkin).substring(0, 2) == "06") { (period[0].in)++; }
        if ((result[i].checkin).substring(0, 2) == "07" || (result[i].checkin).substring(0, 2) == "08") { (period[1].in)++; }
        if ((result[i].checkin).substring(0, 2) == "09" || (result[i].checkin).substring(0, 2) == "10") { (period[2].in)++; }
        if ((result[i].checkin).substring(0, 2) == "11" || (result[i].checkin).substring(0, 2) == "12") { (period[3].in)++; }
        if ((result[i].checkin).substring(0, 2) == "13" || (result[i].checkin).substring(0, 2) == "14") { (period[4].in)++; }
        if ((result[i].checkin).substring(0, 2) == "15" || (result[i].checkin).substring(0, 2) == "16") { (period[5].in)++; }
        if ((result[i].checkin).substring(0, 2) == "17" || (result[i].checkin).substring(0, 2) == "18") { (period[6].in)++; }
        if ((result[i].checkin).substring(0, 2) == "19" || (result[i].checkin).substring(0, 2) == "20") { (period[7].in)++; }

        if ((result[i].checkout).substring(0, 2) == "05" || (result[i].checkout).substring(0, 2) == "06") { (period[0].out)++; }
        if ((result[i].checkout).substring(0, 2) == "07" || (result[i].checkout).substring(0, 2) == "08") { (period[1].out)++; }
        if ((result[i].checkout).substring(0, 2) == "09" || (result[i].checkout).substring(0, 2) == "10") { (period[2].out)++; }
        if ((result[i].checkout).substring(0, 2) == "11" || (result[i].checkout).substring(0, 2) == "12") { (period[3].out)++; }
        if ((result[i].checkout).substring(0, 2) == "13" || (result[i].checkout).substring(0, 2) == "14") { (period[4].out)++; }
        if ((result[i].checkout).substring(0, 2) == "15" || (result[i].checkout).substring(0, 2) == "16") { (period[5].out)++; }
        if ((result[i].checkout).substring(0, 2) == "17" || (result[i].checkout).substring(0, 2) == "18") { (period[6].out)++; }
        if ((result[i].checkout).substring(0, 2) == "19" || (result[i].checkout).substring(0, 2) == "20") { (period[7].out)++; }
      }
      //console.log(period);
      res.json(period);
      db.close();
    });
  });

});


app.get('/getgrapghagebygender/:gender', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getgrapghperiod");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }

  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    //console.log("checkin." + year + "-" + month + "-" + date)
    var query = { "checkinEmotion.gender": req.params.gender };
    var query2 = { "checkoutEmotion.gender": req.params.gender };
    dbo.collection("checkin." + year + "-" + month + "-" + date).find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      dbo.collection("checkin." + year + "-" + month + "-" + date).find(query2).toArray(function (err2, result2) {
        if (err2) res.json("[]");
        //console.log(result);
        let data = [
          { "age": "20-29", "count": 0 },
          { "age": "30-39", "count": 0 },
          { "age": "40-49", "count": 0 },
          { "age": "50-59", "count": 0 },
          { "age": "60+", "count": 0 }];

        for (let i = 0; i < result.length; i++) {
          if (result[i].checkinEmotion.age < 30) { (data[0].count)++; }
          else if (result[i].checkinEmotion.age < 40) { (data[1].count)++; }
          else if (result[i].checkinEmotion.age < 50) { (data[2].count)++; }
          else if (result[i].checkinEmotion.age < 60) { (data[3].count)++; }
          else (data[4].count)++;



        }
        for (let i = 0; i < result2.length; i++) {
          if (result2[i].checkoutEmotion.age < 30) { (data[0].count)++; }
          else if (result2[i].checkoutEmotion.age < 40) { (data[1].count)++; }
          else if (result2[i].checkoutEmotion.age < 50) { (data[2].count)++; }
          else if (result2[i].checkoutEmotion.age < 60) { (data[3].count)++; }
          else (data[4].count)++;
        }
        //console.log(period);
        res.json(data);
        db.close();
      });
    });
  });

});

app.get('/getgrapghagebygender/:gender/:happy', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getgrapghperiod");

  const uri = "mongodb://localhost:27017/";
  qr = {};
  if (req.params.happy == "happy") qr = { $in: ["happiness", "surprise"] };
  else if (req.params.happy == "unhappy") qr = { $in: ["anger", "contempt", "disgust", "fear", "sadness"] };
  else qr = "neutral"
  //, { useNewUrlParser: true }

  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    //console.log("checkin." + year + "-" + month + "-" + date)
    var query = { "checkinEmotion.gender": req.params.gender, checkinEmo: qr };
    var query2 = { "checkoutEmotion.gender": req.params.gender, checkoutEmo: qr };
    dbo.collection("checkin." + year + "-" + month + "-" + date).find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      dbo.collection("checkin." + year + "-" + month + "-" + date).find(query2).toArray(function (err2, result2) {
        if (err2) res.json("[]");
        //console.log(result);
        let data = [
          { "age": "20-29", "count": 0 },
          { "age": "30-39", "count": 0 },
          { "age": "40-49", "count": 0 },
          { "age": "50-59", "count": 0 },
          { "age": "60+", "count": 0 }];

        for (let i = 0; i < result.length; i++) {
          if (result[i].checkinEmotion.age < 30) { (data[0].count)++; }
          else if (result[i].checkinEmotion.age < 40) { (data[1].count)++; }
          else if (result[i].checkinEmotion.age < 50) { (data[2].count)++; }
          else if (result[i].checkinEmotion.age < 60) { (data[3].count)++; }
          else (data[4].count)++;
        }
        for (let i = 0; i < result2.length; i++) {
          if (result2[i].checkoutEmotion.age < 30) { (data[0].count)++; }
          else if (result2[i].checkoutEmotion.age < 40) { (data[1].count)++; }
          else if (result2[i].checkoutEmotion.age < 50) { (data[2].count)++; }
          else if (result2[i].checkoutEmotion.age < 60) { (data[3].count)++; }
          else (data[4].count)++;
        }
        //console.log(period);
        res.json(data);
        db.close();
      });
    });
  });

});




app.get('/getcountlateweek', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");



    var dbo = db.db("checkin");
    var dbo2 = db.db("mea");
    dbo2.collection("profile").find().toArray(function (err2, result2) {
      if (err2) res.json("[]");
      //console.log("checkin." + year + "-" + month + "-" + date)
      dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);
        let ontime = 0;
        let late = 0;
        let absence = result2.length;



        for (let i = 0; i < result.length; i++) {
          if ((result[i].checkin).substring(0, 2) == "05" || (result[i].checkin).substring(0, 2) == "06" || ((result[i].checkin).substring(0, 2) == "07" && (result[i].checkin).substring(3, 5) <= 30)) {
            absence--;
            ontime++;
          }
          if (((result[i].checkin).substring(0, 2) == "07" && (result[i].checkin).substring(3, 5) > 30) || (result[i].checkin).substring(0, 2) >= "08") {
            absence--;
            late++;
          }
        }
        ontime = ontime / 44 * 100;
        late = late / 44 * 100;
        absence = absence / 44 * 100;
        let jsonresponse = {
          "ontime": ontime, "late": late, "absence": absence
        }
        //console.log(jsonresponse);
        res.json(jsonresponse);
        db.close();
      });
    });
  });

});




app.get('/getcountlate', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    var dbo2 = db.db("mea");
    dbo2.collection("profile").find().toArray(function (err2, result2) {
      if (err2) res.json("[]");
      //console.log("checkin." + year + "-" + month + "-" + date)
      //console.log("checkin." + year + "-" + month + "-" + date)
      dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);
        let ontime = 0;
        let late = 0;
        let absence = result2.length;
        let overtime = 0;

        for (let i = 0; i < result.length; i++) {
          if ((result[i].checkin).substring(0, 2) == "05" || (result[i].checkin).substring(0, 2) == "06" || ((result[i].checkin).substring(0, 2) == "07" && (result[i].checkin).substring(3, 5) <= 30)) {
            absence--;
            ontime++;
          }
          if (((result[i].checkin).substring(0, 2) == "07" && (result[i].checkin).substring(3, 5) > 41) || (result[i].checkin).substring(0, 2) >= "08") {
            absence--;
            late++;
          }
          if (((result[i].checkout).substring(0, 2) == "15" && (result[i].checkout).substring(3, 5) > 30) || (result[i].checkout).substring(0, 2) >= "16") {
            overtime++;
          }
        }
        // ontime = ontime;
        // late = late;
        // absence = absence;
        let jsonresponse = {
          "ontime": ontime, "late": late, "absence": absence, "overtime": overtime
        }
        //console.log(jsonresponse);
        res.json(jsonresponse);
        db.close();
      });
    });
  });

});

app.get('/getmealate', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    var dbo2 = db.db("mea");
    dbo2.collection("profile").find().toArray(function (err2, result2) {
      if (err2) res.json("[]");
      //console.log("checkin." + year + "-" + month + "-" + date)
      //console.log("checkin." + year + "-" + month + "-" + date)
      dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);

        let mea = [];
        for (let i = 0; i < result.length; i++) {

          if (((result[i].checkin).substring(0, 2) == "07" && (result[i].checkin).substring(3, 5) > 41) || (result[i].checkin).substring(0, 2) >= "08") {
            result2.forEach(element => {
              if (element.id == result[i].id) {
                element.checkin = result[i].checkin
                mea.push(element);
              }
            });
          }

        }

        //console.log(jsonresponse);
        res.json(mea);
        db.close();
      });
    });
  });

});

app.get('/getmeaontime', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    var dbo2 = db.db("mea");
    dbo2.collection("profile").find().toArray(function (err2, result2) {
      if (err2) res.json("[]");
      //console.log("checkin." + year + "-" + month + "-" + date)
      //console.log("checkin." + year + "-" + month + "-" + date)
      dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);
        let mea = [];

        for (let i = 0; i < result.length; i++) {
          if ((result[i].checkin).substring(0, 2) == "05" || (result[i].checkin).substring(0, 2) == "06" || ((result[i].checkin).substring(0, 2) == "07" && (result[i].checkin).substring(3, 5) <= 30)) {
            result2.forEach(element => {
              if (element.id == result[i].id) {
                element.checkin = result[i].checkin
                mea.push(element);
              }
            });
          }

        }

        res.json(mea);
        db.close();
      });
    });
  });

});

app.get('/getmeaabsent', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    var dbo2 = db.db("mea");
    dbo2.collection("profile").find().toArray(function (err2, result2) {
      if (err2) res.json("[]");
      //console.log("checkin." + year + "-" + month + "-" + date)
      //console.log("checkin." + year + "-" + month + "-" + date)
      dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);
        let mea = result2;
        // var count = 1;

        for (let j = mea.length - 1; j > -1; j--) {
          for (let i = 0; i < result.length; i++) {
            if (mea[j].id == result[i].id) {
              mea.splice(j, 1);

            }
          }
        }

        res.json(mea);
        db.close();
      });
    });
  });

});

app.get('/getmeaovertime', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    var dbo2 = db.db("mea");
    dbo2.collection("profile").find().toArray(function (err2, result2) {
      if (err2) res.json("[]");
      //console.log("checkin." + year + "-" + month + "-" + date)
      //console.log("checkin." + year + "-" + month + "-" + date)
      dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
        if (err) res.json("[]");
        //console.log(result);
        let mea = [];

        for (let i = 0; i < result.length; i++) {

          if (((result[i].checkout).substring(0, 2) == "15" && (result[i].checkout).substring(3, 5) > 30) || (result[i].checkout).substring(0, 2) >= "16") {
            result2.forEach(element => {
              if (element.id == result[i].id) {
                element.checkout = result[i].checkout
                mea.push(element);
              }
            });
          }
        }

        res.json(mea);
        db.close();
      });
    });
  });

});


app.get('/getcountexitbygender/:gender', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    //console.log("checkin." + year + "-" + month + "-" + date)

    var query = { "checkinEmotion.gender": req.params.gender };
    var query2 = { "checkoutEmotion.gender": req.params.gender };
    let entryhh = 0;
    let entrymm = 0;
    let exithh = 0;
    let exitmm = 0;
    dbo.collection("checkin." + year + "-" + month + "-" + date).find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      dbo.collection("checkin." + year + "-" + month + "-" + date).find(query2).toArray(function (err, result2) {
        if (err) res.json("[]");
        //console.log(result);
        // let ontime = 0;
        // let late = 0;
        // let absence = 42;
        let entry = result.length;
        let exit = result2.length;


        result.forEach((element) => {
          entryhh += parseInt(element.checkin.substring(0, 2));
          entrymm += parseInt(element.checkin.substring(3, 5));
        })

        result2.forEach((element) => {
          exithh += parseInt(element.checkout.substring(0, 2));
          exitmm += parseInt(element.checkout.substring(3, 5));
        })


        let jsonresponse = {
          "entry": entry, "exit": exit,
          "entryhh": entryhh, "entrymm": entrymm,
          "exithh": exithh, "exitmm": exitmm
        }
        //console.log(jsonresponse);
        res.json(jsonresponse);
        db.close();
      });
    });
  });

});

function arrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }

  return a;
}

app.get('/getmeabygender/:gender', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    var dbo2 = db.db("mea");
    //console.log("checkin." + year + "-" + month + "-" + date)

    var query = { "checkinEmotion.gender": req.params.gender };
    var query2 = { "checkoutEmotion.gender": req.params.gender };
    dbo2.collection("profile").find().toArray(function (err2, result3) {
      if (err2) res.json("[]");
      dbo.collection("checkin." + year + "-" + month + "-" + date).find(query).toArray(function (err, result) {
        if (err) res.json("[]");
        dbo.collection("checkin." + year + "-" + month + "-" + date).find(query2).toArray(function (err, result2) {
          if (err) res.json("[]");


          conc = arrayUnique(result.concat(result2));

          let mea = [];
          // var count = 1;


          for (let i = 0; i < conc.length; i++) {
            for (let j = 0; j < result3.length; j++) {
              if (result3[j].id == conc[i].id) {
                result3[j]['checkin'] = conc[i]['checkin'];
                result3[j]['checkout'] = conc[i]['checkout'];
                mea.push(result3[j]);

              }
            }
          }


          res.json(mea);
          db.close();
        });
      });
    });
  });

});

app.get('/getmeabygender/:gender/:happy', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");
  let qr = "neutral"
  if (req.params.happy == "happy") qr = { $in: ["happiness", "surprise"] };
  else if (req.params.happy == "unhappy") qr = { $in: ["anger", "contempt", "disgust", "fear", "sadness"] };


  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    var dbo2 = db.db("mea");
    //console.log("checkin." + year + "-" + month + "-" + date)
    var query = { "checkinEmotion.gender": req.params.gender, checkinEmo: qr };
    var query2 = { "checkoutEmotion.gender": req.params.gender, checkoutEmo: qr };
    dbo2.collection("profile").find().toArray(function (err2, result3) {
      if (err2) res.json("[]");
      dbo.collection("checkin." + year + "-" + month + "-" + date).find(query).toArray(function (err, result) {
        if (err) res.json("[]");
        dbo.collection("checkin." + year + "-" + month + "-" + date).find(query2).toArray(function (err, result2) {
          if (err) res.json("[]");

          conc = arrayUnique(result.concat(result2));

          let mea = [];
          // var count = 1;


          for (let i = 0; i < conc.length; i++) {
            for (let j = 0; j < result3.length; j++) {
              if (result3[j].id == conc[i].id) {
                result3[j]['checkin'] = conc[i]['checkin'];
                result3[j]['checkout'] = conc[i]['checkout'];
                mea.push(result3[j]);

              }
            }
          }

          res.json(mea);
          db.close();
        });
      });
    });
  });
});


app.get('/getcountexitbygender/:gender/:happy', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();


  //console.log("getcountlate");
  let qr = "neutral"
  if (req.params.happy == "happy") qr = { $in: ["happiness", "surprise"] };
  else if (req.params.happy == "unhappy") qr = { $in: ["anger", "contempt", "disgust", "fear", "sadness"] };
  let entryhh = 0;
  let entrymm = 0;
  let exithh = 0;
  let exitmm = 0;

  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    //console.log("checkin." + year + "-" + month + "-" + date)
    var query = { "checkinEmotion.gender": req.params.gender, checkinEmo: qr };
    var query2 = { "checkoutEmotion.gender": req.params.gender, checkoutEmo: qr };
    dbo.collection("checkin." + year + "-" + month + "-" + date).find(query).toArray(function (err, result) {
      if (err) res.json("[]");
      dbo.collection("checkin." + year + "-" + month + "-" + date).find(query2).toArray(function (err, result2) {
        if (err) res.json("[]");
        let entry = result.length;
        let exit = result2.length;


        result.forEach((element) => {
          entryhh += parseInt(element.checkin.substring(0, 2));
          entrymm += parseInt(element.checkin.substring(3, 5));
        })

        result2.forEach((element) => {
          exithh += parseInt(element.checkout.substring(0, 2));
          exitmm += parseInt(element.checkout.substring(3, 5));
        })


        let jsonresponse = {
          "entry": entry, "exit": exit,
          "entryhh": entryhh, "entrymm": entrymm,
          "exithh": exithh, "exitmm": exitmm
        }

        //console.log(jsonresponse);
        res.json(jsonresponse);
        db.close();
      });
    });
  });

});






app.get('/getemograph', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(function (err, result) {
      if (err) res.json("[]");

      let period = [
        { "time": 6, "happy": 0, "unhappy": 0, "neutral": 0 },
        { "time": 8, "happy": 0, "unhappy": 0, "neutral": 0 },
        { "time": 10, "happy": 0, "unhappy": 0, "neutral": 0 },
        { "time": 12, "happy": 0, "unhappy": 0, "neutral": 0 },
        { "time": 14, "happy": 0, "unhappy": 0, "neutral": 0 },
        { "time": 16, "happy": 0, "unhappy": 0, "neutral": 0 },
        { "time": 18, "happy": 0, "unhappy": 0, "neutral": 0 },
        { "time": 20, "happy": 0, "unhappy": 0, "neutral": 0 }];

      console.log(result);
      for (let i = 0; i < result.length; i++) {
        let emotion1 = result[i].checkinEmotion.emotion;
        let emotion2 = result[i].checkoutEmotion.emotion;

        //console.log("emo:", emotion1);
        let maxProp = null
        let maxValue = -1
        let secProp = null
        let secValue = -1

        let maxProp2 = null
        let maxValue2 = -1
        let secProp2 = null
        let secValue2 = -1

        for (var prop in emotion1) {
          if (emotion1.hasOwnProperty(prop)) {

            let value = emotion1[prop]
            if (value > maxValue) {
              secValue = maxValue;
              secProp = maxProp
              maxValue = value;
              maxProp = prop
            } else if (secValue < value) {
              secValue = value;
              secProp = prop
            }
          }
        }
        if (maxProp == 'neutral') {
          if (maxValue == 1) {
            if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].neutral)++; }
            if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].neutral)++; }
            if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].neutral)++; }
            if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].neutral)++; }
            if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].neutral)++; }
            if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].neutral)++; }
            if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].neutral)++; }
            if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].neutral)++; }
          }
          else if (maxValue < 1) {
            if (secProp == 'anger') {
              if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp == 'contempt') {
              if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp == 'disgust') {
              if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp == 'fear') {
              if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp == 'happiness') {
              if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].happy)++; }
            }
            else if (secProp == 'sadness') {
              if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp == 'surprise') {
              if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].happy)++; }
              if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].happy)++; }
            }
          }
        }
        else if (maxProp == 'anger') {
          if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp == 'contempt') {
          if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp == 'disgust') {
          if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp == 'fear') {
          if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp == 'happiness') {
          if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].happy)++; }
        }
        else if (maxProp == 'sadness') {
          if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp == 'surprise') {
          if ((result[i].checkindatetime).substring(8, 10) == "05" || (result[i].checkindatetime).substring(8, 10) == "06") { (period[0].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "07" || (result[i].checkindatetime).substring(8, 10) == "08") { (period[1].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "09" || (result[i].checkindatetime).substring(8, 10) == "10") { (period[2].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "11" || (result[i].checkindatetime).substring(8, 10) == "12") { (period[3].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "13" || (result[i].checkindatetime).substring(8, 10) == "14") { (period[4].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "15" || (result[i].checkindatetime).substring(8, 10) == "16") { (period[5].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "17" || (result[i].checkindatetime).substring(8, 10) == "18") { (period[6].happy)++; }
          if ((result[i].checkindatetime).substring(8, 10) == "19" || (result[i].checkindatetime).substring(8, 10) == "20") { (period[7].happy)++; }
        }
        for (var prop2 in emotion2) {
          if (emotion2.hasOwnProperty(prop2)) {

            let value2 = emotion2[prop2]
            if (value2 > maxValue2) {
              secValue2 = maxValue2;
              secProp2 = maxProp2
              maxValue2 = value2;
              maxProp2 = prop2
            } else if (secValue2 < value2) {
              secValue2 = value2;
              secProp2 = prop2
            }
          }
        }

        if (maxProp2 == 'neutral') {
          if (maxValue2 == 1) {
            if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].neutral)++; }
            if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].neutral)++; }
            if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].neutral)++; }
            if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].neutral)++; }
            if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].neutral)++; }
            if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].neutral)++; }
            if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].neutral)++; }
            if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].neutral)++; }
          }
          else if (maxValue2 < 1) {
            if (secProp2 == 'anger') {
              if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp2 == 'contempt') {
              if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp2 == 'disgust') {
              if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp2 == 'fear') {
              if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp2 == 'happiness') {
              if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].happy)++; }
            }
            else if (secProp2 == 'sadness') {
              if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
            }
            else if (secProp2 == 'surprise') {
              if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].happy)++; }
              if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].happy)++; }
            }
          }
        }
        else if (maxProp2 == 'anger') {
          if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp2 == 'contempt') {
          if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp2 == 'disgust') {
          if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp2 == 'fear') {
          if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp2 == 'happiness') {
          if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].happy)++; }
        }
        else if (maxProp2 == 'sadness') {
          if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].unhappy)--; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].unhappy)--; }
        }
        else if (maxProp2 == 'surprise') {
          if ((result[i].checkoutdatetime).substring(8, 10) == "05" || (result[i].checkoutdatetime).substring(8, 10) == "06") { (period[0].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "07" || (result[i].checkoutdatetime).substring(8, 10) == "08") { (period[1].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "09" || (result[i].checkoutdatetime).substring(8, 10) == "10") { (period[2].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "11" || (result[i].checkoutdatetime).substring(8, 10) == "12") { (period[3].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "13" || (result[i].checkoutdatetime).substring(8, 10) == "14") { (period[4].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "15" || (result[i].checkoutdatetime).substring(8, 10) == "16") { (period[5].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "17" || (result[i].checkoutdatetime).substring(8, 10) == "18") { (period[6].happy)++; }
          if ((result[i].checkoutdatetime).substring(8, 10) == "19" || (result[i].checkoutdatetime).substring(8, 10) == "20") { (period[7].happy)++; }
        }

      }

      // let happy = happiness + surprise;
      // let unhappy = anger + contempt + disgust + fear + sadness ;

      console.log(period);
      res.json(period);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});



app.get('/countemoperiodweek', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {

    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    // //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkattendance").find().toArray(function (err, result) {
      if (err) res.json("[]");
      let happy = 0, unhappy = 0, neutral = 0;

      let period = [
        { "day": "28-02-2020", "happy": 24, "unhappy": 13, "neutral": 3 },
        { "day": "29-02-2020", "happy": 16, "unhappy": 22, "neutral": 2 },
        { "day": "01-03-2020", "happy": 20, "unhappy": 16, "neutral": 4 },
        { "day": "02-03-2020", "happy": 25, "unhappy": 10, "neutral": 5 },
        { "day": "03-03-2020", "happy": 19, "unhappy": 18, "neutral": 3 },
        { "day": "04-03-2020", "happy": 25, "unhappy": 10, "neutral": 5 },
        { "day": "05-03-2020", "happy": 0, "unhappy": 0, "neutral": 0 }];


      for (let i = 0; i < result.length; i++) {
        let emotion1 = result[i].checkin.emotion.emotion;

        //console.log("emo:", emotion1);
        let maxProp = null
        let maxValue = -1
        let secProp = null
        let secValue = -1

        for (var prop in emotion1) {
          if (emotion1.hasOwnProperty(prop)) {

            let value = emotion1[prop]
            if (value > maxValue) {
              secValue = maxValue;
              secProp = maxProp
              maxValue = value;
              maxProp = prop
            } else if (secValue < value) {
              secValue = value;
              secProp = prop
            }
          }
        }

        if (maxProp == 'neutral') {
          if (maxValue == 1) {
            period[6].neutral++;
          }
          else if (maxValue < 1) {
            if (secProp == 'anger') period[6].unhappy--;
            else if (secProp == 'contempt') period[6].unhappy--;
            else if (secProp == 'disgust') period[6].unhappy--;
            else if (secProp == 'fear') period[6].unhappy--;
            else if (secProp == 'happiness') period[6].happy++;
            else if (secProp == 'sadness') period[6].unhappy--;
            else if (secProp == 'surprise') period[6].happy++;
          }
        }
        else if (maxProp == 'anger') period[6].unhappy--;
        else if (maxProp == 'contempt') period[6].unhappy--;
        else if (maxProp == 'disgust') period[6].unhappy--;
        else if (maxProp == 'fear') period[6].unhappy--;
        else if (maxProp == 'happiness') period[6].happy++;
        else if (maxProp == 'sadness') period[6].unhappy--;
        else if (maxProp == 'surprise') period[6].happy++;

      }


      res.json(period);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});



app.get('/countemoweek', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = (("0" + date_ob.getDate()).slice(-2));

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    let anger = 6,
      contempt = 41,
      disgust = 11,
      fear = 6,
      happiness = 99,
      neutral = 22,
      sadness = 25,
      surprise = 30;
    // try{
    //console.log("checkin." + year + "-" + month + "-" + date)
    //{ Date: { $gt: new Date(year + "-" + month + "-" + date), $lt: new Date(year + "-" + month + "-" + date) } }
    dbo.collection("checkattendance").find({ Date: year + "-" + month + "-" + date }).toArray(function (err, result) {
      if (err) res.json("[]");

      // //console.log(result);

      for (let i = 0; i < result.length; i++) {
        let emotion1 = result[i].checkin.emotion.emotion;
        let emotion2 = result[i].checkout.emotion.emotion;

        //console.log("emo:", emotion1);
        let maxProp = null
        let maxValue = -1
        let secProp = null
        let secValue = -1

        for (var prop in emotion1) {
          if (emotion1.hasOwnProperty(prop)) {

            let value = emotion1[prop]
            if (value > maxValue) {
              secValue = maxValue;
              secProp = maxProp
              maxValue = value;
              maxProp = prop
            } else if (secValue < value) {
              secValue = value;
              secProp = prop
            }
          }
        }

        if (maxProp == 'neutral') {
          if (maxValue == 1) {
            neutral++;
          }
          else if (maxValue < 1) {
            if (secProp == 'anger') anger++;
            else if (secProp == 'contempt') contempt++;
            else if (secProp == 'disgust') disgust++;
            else if (secProp == 'fear') fear++;
            else if (secProp == 'happiness') happiness++;
            else if (secProp == 'sadness') sadness++;
            else if (secProp == 'surprise') surprise++;
          }
        }
        else if (maxProp == 'anger') anger++;
        else if (maxProp == 'contempt') contempt++;
        else if (maxProp == 'disgust') disgust++;
        else if (maxProp == 'fear') fear++;
        else if (maxProp == 'happiness') happiness++;
        else if (maxProp == 'sadness') sadness++;
        else if (maxProp == 'surprise') surprise++;


        for (var prop in emotion2) {
          if (emotion2.hasOwnProperty(prop)) {

            let value = emotion2[prop]
            if (value > maxValue) {
              secValue = maxValue;
              secProp = maxProp
              maxValue = value;
              maxProp = prop
            } else if (secValue < value) {
              secValue = value;
              secProp = prop
            }
          }
        }

        if (result[i].checkout.emotion != "") {
          if (maxProp == 'neutral') {
            if (maxValue == 1) {
              neutral++;
            }
            else if (maxValue < 1) {
              if (secProp == 'anger') anger++;
              else if (secProp == 'contempt') contempt++;
              else if (secProp == 'disgust') disgust++;
              else if (secProp == 'fear') fear++;
              else if (secProp == 'happiness') happiness++;
              else if (secProp == 'sadness') sadness++;
              else if (secProp == 'surprise') surprise++;
            }
          }
          else if (maxProp == 'anger') anger++;
          else if (maxProp == 'contempt') contempt++;
          else if (maxProp == 'disgust') disgust++;
          else if (maxProp == 'fear') fear++;
          else if (maxProp == 'happiness') happiness++;
          else if (maxProp == 'sadness') sadness++;
          else if (maxProp == 'surprise') surprise++;
        }


      }

      res.json(
        {
          anger: anger,
          contempt: contempt,
          disgust: disgust,
          fear: fear,
          happiness: happiness,
          sadness: sadness,
          surprise: surprise,
          neutral: neutral
        }
      );
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});



app.get('/getcheckattendance', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    // //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkattendance").find().toArray(function (err, result) {
      if (err) res.json("[]");


      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});

app.get('/getcheckattendance', cors(issue2options), function (req, res) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    // //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkattendance").find().toArray(function (err, result) {
      if (err) res.json("[]");


      res.json(result);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});




app.get('/getcheckattendancetable/:dateparem', cors(issue2options), function (req, res) {
  let date = req.params.dateparem;
  // let date_ob = new Date();
  // let date = ("0" + date_ob.getDate()).slice(-2);

  // // current month
  // let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // // current year
  // let year = date_ob.getFullYear();
  //console.log("getcheckin");
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    // //console.log("checkin." + year + "-" + month + "-" + date)
    dbo.collection("checkattendance").find({ "Date": req.params.dateparem }).toArray(function (err, result) {
      if (err) res.json("[]");
      var arr = [];
      for (let i = 0; i < result.length; i++) {
        let emotion1 = result[i].checkin.emotion.emotion;
        let emotion2 = result[i].checkout.emotion.emotion;
        let maxProp = null
        let maxValue = -1
        let secProp = null
        let secValue = -1
        var e_in;
        var e_out;

        for (var prop in emotion1) {
          if (emotion1.hasOwnProperty(prop)) {

            let value = emotion1[prop]
            if (value > maxValue) {
              secValue = maxValue;
              secProp = maxProp
              maxValue = value;
              maxProp = prop
            } else if (secValue < value) {
              secValue = value;
              secProp = prop
            }
            e_in = maxProp;
          }

          if (maxProp == 'neutral') {
            if (maxValue == 1) {
              e_in = "neutral";
            }
            else if (maxValue < 1) {
              if (secProp == 'anger') e_in = "anger";
              else if (secProp == 'contempt') e_in = "contempt";
              else if (secProp == 'disgust') e_in = "disgust";
              else if (secProp == 'fear') e_in = "fear";
              else if (secProp == 'happiness') e_in = "happiness";
              else if (secProp == 'sadness') e_in = "sadness";
              else if (secProp == 'surprise') e_in = "surprise";
            }
          }
          else if (maxProp == 'anger') e_in = "anger";
          else if (maxProp == 'contempt') e_in = "contempt";
          else if (maxProp == 'disgust') e_in = "disgust";
          else if (maxProp == 'fear') e_in = "fear";
          else if (maxProp == 'happiness') e_in = "happiness";
          else if (maxProp == 'sadness') e_in = "sadness";
          else if (maxProp == 'surprise') e_in = "surprise";

        }

        for (var prop in emotion2) {
          if (emotion2.hasOwnProperty(prop)) {

            let value = emotion2[prop]
            if (value > maxValue) {
              secValue = maxValue;
              secProp = maxProp
              maxValue = value;
              maxProp = prop
            } else if (secValue < value) {
              secValue = value;
              secProp = prop
            }
            e_out = maxProp;
          }
          if (maxProp == 'neutral') {
            if (maxValue == 1) {
              e_out = "neutral";
            }
            else if (maxValue < 1) {
              if (secProp == 'anger') e_out = "anger";
              else if (secProp == 'contempt') e_out = "contempt";
              else if (secProp == 'disgust') e_out = "disgust";
              else if (secProp == 'fear') e_out = "fear";
              else if (secProp == 'happiness') e_out = "happiness";
              else if (secProp == 'sadness') e_out = "sadness";
              else if (secProp == 'surprise') e_out = "surprise";
            }
          }
          else if (maxProp == 'anger') e_out = "anger";
          else if (maxProp == 'contempt') e_out = "contempt";
          else if (maxProp == 'disgust') e_out = "disgust";
          else if (maxProp == 'fear') e_out = "fear";
          else if (maxProp == 'happiness') e_out = "happiness";
          else if (maxProp == 'sadness') e_out = "sadness";
          else if (maxProp == 'surprise') e_out = "surprise";

        }
        if (e_out = null) { e_out = "" }
        var obj = {
          "id": "",
          "name": result[i].name,
          "time_in": result[i].checkin.time,
          "emo_in": e_in,
          "time_out": result[i].checkout.time,
          "emo_out": e_out,
        }
        arr.push(obj);
      }


      res.json(arr);
      db.close();
    });
    // }catch(err){
    // //console.log(err.stack);
    // res.json("[]");}
  });

});

var blobPath = 'name';

var upload = multer({
  storage: multerAzure({
    connectionString: 'DefaultEndpointsProtocol=https;AccountName=oneteamblob;AccountKey=qcv7bSwg5vFNZRt1gY9XLPcv6OWKdKakKCj5znpUQRNQTPAOkLbhnCuZpt/1m4Gc9f5tV55x0CEzcVWjCubTaQ==;EndpointSuffix=core.windows.net', //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
    account: 'oneteamblob', //The name of the Azure storage account
    key: 'qcv7bSwg5vFNZRt1gY9XLPcv6OWKdKakKCj5znpUQRNQTPAOkLbhnCuZpt/1m4Gc9f5tV55x0CEzcVWjCubTaQ==', //A key listed under Access keys in the storage account pane
    container: 'meapicture',  //Any container name, it will be created if it doesn't exist
    blobPathResolver: function (req, file, callback) {
      // axios.get('http://20.188.110.129:3000/uploadid').then(response => {
      //   console.log("response",response);
      //   console.log("res",response.data);
      //   blobPath = response.data.id+ '.jpg';
      //   callback(null, blobPath);
      // })
      // .catch(error => {
      //   console.log(error);
      // });
      request('http://localhost:3000/uploadid', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        // console.log(body);
        blobPath = body[0].id + '.jpg';
        callback(null, blobPath);
      });
      // https.get('http://20.188.110.129:3000/uploadid').then(response => response.json())
      // .then(id => {
      //   blobPath = id+ '.jpg'; //Calculate blobPath in your own way.
      // //blobPath = 'vision.png'
      //   callback(null, blobPath);
      // })

    }
  })
})

app.post('/uploadid/:id', function (req, res) {
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");
    // res.send(req.body);
    // var myobj = { id: req.params.id,"lastid": true };
    dbo.collection("lastid").updateOne(
      { "lastid": true },
      { $set: { "id": req.params.id } },
      //
      { upsert: true }
      , function (err, result) {
        if (err) res.send(err);
        //console.log(result);
        res.json(result);
        db.close();
      });


  });

})
app.get('/uploadid', function (req, res) {
  const uri = "mongodb://localhost:27017/";
  //, { useNewUrlParser: true }
  const client = new MongoClient.connect(uri, function (err, db) {
    //console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("mea");

    dbo.collection("lastid").find().toArray(function (err, result) {
      if (err) res.json("[]");
      //console.log(result);
      res.json(result);
      db.close();
    });

  });

})


app.post('/upload', upload.any(), function (req, res, next) {
  // blobPath = req.
  // console.log(req.files);
  res.json('{"Uploaded":"' + blobPath + '"}');
})



app.listen(process.env.PORT || 3000)
