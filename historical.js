const MongoClient = require('mongodb').MongoClient;
let date_now = new Date();
let date = ("0" + date_now.getDate()).slice(-2);

// current month
let month = ("0" + (date_now.getMonth() + 1)).slice(-2);

// current year
let year = date_now.getFullYear();

let date_today = new Date(year+"-"+month+"-"+date);


const uri = "mongodb://localhost:27017/";
const client = new MongoClient.connect(uri, async function (err, db) {
    ////console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{

    dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(async function (err, result) {
        if (err) res.json("[]");
        let ontime = 0;
        let late = 0;
        let absence = result.length;
        let overtime = 0;

        var neutral = 0;
        var happy = 0;
        var unhappy = 0;
        ////console.log(result);
        // let itemsProcessed = 0;
        result.forEach(element => {
            // asyncForEach(result, async (element) => {
            if (element.checkinEmo == 'neutral') {
                neutral++;
            }
            else if (element.checkinEmo == "happiness" || element.checkinEmo == "surprise") {
                happy++;
            }
            else unhappy++;

            if (element.checkoutEmo == 'neutral') {
                neutral++;
            }
            else if (element.checkoutEmo == "happiness" || element.checkoutEmo == "surprise") {
                happy++;
            }
            else unhappy++;




            if ((element.checkin).substring(0, 2) == "05" || (element.checkin).substring(0, 2) == "06" || ((element.checkin).substring(0, 2) == "07" && (element.checkin).substring(3, 5) <= 30)) {
                absence--;
                ontime++;
            }
            if (((element.checkin).substring(0, 2) == "07" && (element.checkin).substring(3, 5) > 41) || (element.checkin).substring(0, 2) >= "08") {
                absence--;
                late++;
            }
            if (((element.checkout).substring(0, 2) == "15" && (element.checkout).substring(3, 5) > 30) || (element.checkout).substring(0, 2) >= "16") {
                overtime++;
            }
            //console.log(neutral, happy, unhappy)
            // itemsProcessed++;
            // if (itemsProcessed === result.length) {

            // }



        });
        var historydb = db.db("historical");
        historydb.collection("emo").update({ "name": "Neutral" }, { $set: { "name": "Neutral" }, $push: { "data": [Date.parse(date_today), neutral] } }, { upsert: true }, function (err, res) {
            if (err) throw err;
            //console.log("1 document inserted");
            historydb.collection("emo").update({ "name": "Happy" }, { $set: { "name": "Happy" }, $push: { "data": [Date.parse(date_today), happy] } }, { upsert: true }, function (err, res) {
                if (err) throw err;
                //console.log("1 document inserted");
                historydb.collection("emo").update({ "name": "Unhappy" }, { $set: { "name": "Unhappy" }, $push: { "data": [Date.parse(date_today), unhappy] } }, { upsert: true }, function (err, res) {
                    if (err) throw err;
                    //console.log("1 document inserted");
                    historydb.collection("checkin").update({ "name": "Ontime" }, { $set: { "name": "Ontime" }, $push: { "data": [Date.parse(date_today), ontime] } }, { upsert: true }, function (err, res) {
                        if (err) throw err;
                        //console.log("1 document inserted");
                        historydb.collection("checkin").update({ "name": "Late" }, { $set: { "name": "Late" }, $push: { "data": [Date.parse(date_today), late] } }, { upsert: true }, function (err, res) {
                            if (err) throw err;
                            //console.log("1 document inserted");
                            historydb.collection("checkin").update({ "name": "Absence" }, { $set: { "name": "Absence" }, $push: { "data": [Date.parse(date_today), absence] } }, { upsert: true }, function (err, res) {
                                if (err) throw err;
                                //console.log("1 document inserted");
                                historydb.collection("checkin").update({ "name": "Overtime" }, { $set: { "name": "Overtime" }, $push: { "data": [Date.parse(date_today), overtime] } }, { upsert: true }, function (err, res) {
                                    if (err) throw err;
                                    //console.log("1 document inserted");
                                    db.close();
                                    
                                });
                            });
            
                        });
            
                    });
                });

            });

        });
        //console.log("done")



        // res.json(result);
        // db.close();
    });
    
});
process.stdin.resume();