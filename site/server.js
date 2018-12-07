var express = require('express'); //ottaa expressin mukaan
var app = express(); //express funktiot muuttujaan
var fs = require("fs"); //antaa seikkailla fileissä

var bodyParser = require("body-parser"); //jäsentelee pyynnöt req.bodya varten
app.use(bodyParser.urlencoded({ extended: true})); // parse application/x-www-form-urlencoded

app.use(express.static("views")); //pääsy mediaan ja styleen

//menee guestbook sivulle
//app.get('/guestbook', function(req,res){
//  var dataset = require("./guests.json");
//  res.render('pages/guestbook', {data: dataset });
//});

//lataa ejs moduulin
app.set('view engine', 'ejs');

//home
app.get('/', function(req, res) {
  res.render('pages/index');
  });


//new message
app.get("/newmessage", function(req,res) {
  res.render("pages/newmessage");
});

//lisättävät tiedot guestbookiin
app.post("/newmessage", function(req,res){

  const MongoClient = require("mongodb").MongoClient;
  // Connection URL
  //const url = "mongodb://localhost:27017/";
  const url = "mongodb://user:password123@ds026018.mlab.com:26018/ottodb";

  // Database Name
  const dbName = "ottodb";
  const collectionName = "guests";

  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, client) {
      if (err) {
        console.log("Unable to connect to the mongoDB server. Error:", err);
      } else {
        console.log("Connection established to", url);

        const db = client.db(dbName);

        var query = { "username": req.body.username,
                      "country": req.body.country,
                      "message": req.body.message,
                      "date": new Date()
                    };

        db.collection(collectionName)
          .insertOne(query)
          client.close;
            res.redirect("/guestbook");

//  var data = require("./guests.json");
  //data.push({
  //  username: req.body.username,
    //country: req.body.country,
    //message: req.body.message,
    //date: new Date()
  //});
}
});
});

  app.get("/guestbook", function(req, res) {
    //////////////////////////////////////////////

    const MongoClient = require("mongodb").MongoClient;
    // Connection URL
    //const url = "mongodb://localhost:27017/";
    const url = "mongodb://user:password123@ds026018.mlab.com:26018/ottodb";

    // Database Name
    const dbName = "ottodb";
    const collectionName = "guests";

    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      function(err, client) {
        if (err) {
          console.log("Unable to connect to the mongoDB server. Error:", err);
        } else {
          console.log("Connection established to", url);

          const db = client.db(dbName);

          var query = { };
          db.collection(collectionName)
            .find(query)

            .toArray(function(err, result) {
              if (err) {
                console.log(err);
                res.status("400").send({ error: err });
              } else if (result.length) {
                //console.log("Found:", result);

                res.render("pages/guestbook", { collection: result });
              } else {
                console.log('No document(s) found with defined "find" criteria!');
                res.status("400").send({ error: "No document(s) found" });
              }
              //Close connection
              client.close();
            });
        } // else {
      } // function
    );
//insertone
    //////////////////////////////////////////////
  });

  app.listen(8081);
  console.log("8081 is the magic port");

  ///////////////
  // CALLBACK CODE



/*//muuntaa jsoniksi
  var jsonStr = JSON.stringify(data);
//kirjoittaa messagen json tiedostoon
  fs.writeFile("guests.json", jsonStr, err => {
    if (err) throw err;
      console.log("New data saved.");
    });
    //lähettää guestbookkiin
    res.writeHead(302, {
      Location: "/guestbook"
    });
    res.end();
});
*/

//jos ei löydä sivua
app.get("*", function(req, res){
  res.send("Can't find the requested page", 404);
});

//npm install express, ejs, mongodb
//db.collection.deleteOne()
//db.collection.updateOne(<filter>, <update>, <options>)
