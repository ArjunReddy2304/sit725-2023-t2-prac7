let express = require('express');
let app = express();
let port = process.env.port || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://reddymalli13:Hi6tnDYoV2nYIF10@cluster0.yosuevd.mongodb.net/?retryWrites=true&w=majority";
let collection;

const { Socket } = require('socket.io');

let http = require('http').createServer(app);

let io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function runDB() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      collection = client.db().collection('Info');
      console.log(collection);
    } catch (ex) {
        console.error(ex);
    }
}

function insertInfo(info,callback) {
    collection.insertOne(info,callback);
}

function getAllInfo(callback){
    collection.find({}).toArray(callback);
}

app.get('/', function (req,res) {
    res.render('index.html');
});

app.post('/api/info', (req,res)=>{
    let info = req.body;
    console.log(info);
    insertInfo(info, (err,result) => {
        if(!err){
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
});

app.get('/api/info', (req,res)=>{
    getAllInfo((err,result)=>{
        console.log(result);
        if(!err){
            res.json({statusCode:200,data:result,message:'success'});
        }
    });
});
io.on('connection',(socket)=>{

    console.log('something');

    socket.on('disconnect', () => {

        console.log('user disconnected');

    });

 

    setInterval(()=>{

        socket.emit('number', parseInt(Math.random()*10));

    }, 1000)

});

http.listen(port, ()=>{
    console.log('express server started');
    runDB();
});