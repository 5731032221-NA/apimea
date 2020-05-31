var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mea");
    //var dbo = db.db("mea");
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();
    //dbo.collection("checkattendance").drop(function(err,delOK){
    // dbo.collection("checkin." + year + "-" + month + "-" + date).drop(function(err,delOK) {


    dbo.collection("default").drop(function (err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
        db.close();
    });
});
