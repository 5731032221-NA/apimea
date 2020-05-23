const MongoClient = require('mongodb').MongoClient;
var http = require('http');
let date_now = new Date(2020, 4, 8);
let date = ("0" + date_now.getDate()).slice(-2);

// current month
let month = ("0" + (date_now.getMonth() + 1)).slice(-2);

// current year
let year = date_now.getFullYear();

let date_today = new Date(year + "-" + month + "-" + date);


const uri = "mongodb://localhost:27017/";
const client = new MongoClient.connect(uri, async function (err, db) {
    ////console.log("connext");
    if (err) res.json("[]");
    var dbo = db.db("checkin");
    // try{
    http.get('http://localhost:3000/getdailyhappy', function (getdailyhappy) {

        if (getdailyhappy.statusCode == 200) {
            let output = '';
            getdailyhappy.on('data', (chunk) => {
                output += chunk;
            });

            getdailyhappy.on('end', () => {
                let gethappy = JSON.parse(output);
                // console.log(gethappy);
                http.get('http://localhost:3000/getdailyworktime', function (getdailyworktime) {
                    if (getdailyworktime.statusCode == 200) {
                        let output2 = '';
                        getdailyworktime.on('data', (chunk2) => {
                            output2 += chunk2;
                        });

                        getdailyworktime.on('end', () => {
                            let getworktime = JSON.parse(output2);
                            let bestemp = {};
                            let happy = {};
                            let MEAlover = {};
                            let MEAlover2 = {};


                            Object.keys(gethappy).forEach((element) => {
                                if (happy[element] == null) happy[element] = gethappy[element];
                                else happy[element] += gethappy[element];

                                if (getworktime[element] > 480) {
                                    if (MEAlover[element] == null) MEAlover[element] = gethappy[element];
                                    else MEAlover[element] += gethappy[element];
                                }

                                if (MEAlover2[element] == null) MEAlover2[element] = gethappy[element];
                                else MEAlover2[element] += gethappy[element];

                            })

                            Object.keys(getworktime).forEach((element) => {
                                // if (bestemp[element] == null) bestemp[element] = getworktime[element];
                                // else bestemp[element] += getworktime[element];
                                bestemp[element] = getworktime[element];
                                if (getworktime[element] > 480) {
                                    if (MEAlover[element] == null) MEAlover[element] = Math.abs(getworktime[element]) / 4.80;
                                    else MEAlover[element] += Math.abs(getworktime[element]) / 4.80;
                                }

                                if (MEAlover2[element] == null) MEAlover2[element] = Math.abs(getworktime[element]) / 4.80;
                                else MEAlover2[element] += Math.abs(getworktime[element]) / 4.80;


                            })

                            var bestemphighestVal = Math.max.apply(null, Object.values(bestemp)),
                                bestempval = Object.keys(bestemp).find(function (a) {
                                    return bestemp[a] === bestemphighestVal;
                                });
                            if (bestemphighestVal < 0) {
                                var bestemphighestVal = Math.min.apply(null, Object.values(bestemp)),
                                    bestempval = Object.keys(bestemp).find(function (a) {
                                        return bestemp[a] === bestemphighestVal;
                                    });
                            }


                            var happyhighestVal = Math.max.apply(null, Object.values(happy)),
                                happyval = Object.keys(happy).find(function (a) {
                                    return happy[a] === happyhighestVal;
                                });

                            var MEAloverhighestVal = Math.max.apply(null, Object.values(MEAlover)),
                                MEAloverval = Object.keys(MEAlover).find(function (a) {
                                    return MEAlover[a] === MEAloverhighestVal;
                                });

                            var MEAloverhighestVal2 = Math.max.apply(null, Object.values(MEAlover2)),
                                MEAloverval2 = Object.keys(MEAlover2).find(function (a) {
                                    return MEAlover2[a] === MEAloverhighestVal2;
                                });
                            // console.log("getworktime",getworktime);

                            // dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(async function (err, result) {
                            //     if (err) res.json("[]");

                            let historydb = db.db("historical");
                            var myobj = { dateint: parseInt(year + month + date), thebest: bestempval, happiness: happyval, mealover: MEAloverval };
                            if (Object.keys(MEAlover).length === 0) {
                                myobj = { dateint: parseInt(year + month + date), thebest: bestempval, happiness: happyval, mealover: MEAloverval2 };
                            }
                            historydb.collection("top").insertOne(myobj, function (err, res) {

                                // var myobj = { name: "Company Inc", address: "Highway 37" };
                                // dbo.collection("customers").insertOne(myobj, function(err, res) {
                                if (err) throw err;

                                dbo.collection("checkin." + year + "-" + month + "-" + date).find().toArray(async function (err, result) {
                                    dbmea = db.db("mea");
                                    dbmea.collection("profile").find().project({ encimage: 0 }).toArray(async function (err, resultmea) {
                                        if (err) res.json("[]");
                                        let ontime = 0;
                                        let late = 0;
                                        let absence = resultmea.length;
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
                                        // let historydb = db.db("historical");
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

                            });
                            // });

                        })
                    }
                });

            })
        }

    });



});
process.stdin.resume();