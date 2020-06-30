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
    dbo.collection("profile").updateMany({}, { "$set": { "individual_confidence": 0.55 } }, function(err, res) {
        if (err) throw err;
       console.log("Collection insert ," + res);
        db.close();
    });
});
