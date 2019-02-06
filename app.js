var express = require('express'),
app = express(),
server = require('http').Server(app),
io = require('socket.io')(server),
ejs = require('ejs'),
bodyParser = require('body-parser'),
multer = require('multer'),
http = require("http"),
path = require("path"),
io = require('socket.io')(server),
ip = require('ip'),
siofu = require("socketio-file-upload"),
fs = require("fs");

console.log("adresse ip : "+ip.address());
console.log(('port : 8888'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
var messages = []
var pseudos = []
var writters = []
var files_folder_path = process.cwd()+'\\files'
app.set('view engine','ejs')
//Middleware


app.use(urlencodedParser)
app.use(jsonParser)
app.use(siofu.router)
app.use(express.static(path.join(__dirname, 'public')));
//Routes

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './files');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage : storage}).single('test');

app.get('/upload',function (request, response) {
  response.redirect('/')
})

app.get('/', function(request, response){
  fs.readdir(files_folder_path, function(err, items) {
  res = response
  res.render('page.ejs',{items : items,chat : messages})
})
  });

app.get('/:file',function (request, response) {
  var requested_file_path = __dirname + '\\files\\'+request.params.file;
    requested_file_path = requested_file_path.replace(/%20/g,' ')
    requested_file_path = requested_file_path.replace(/%3C/g,'/')
  response.download(requested_file_path)
})

  app.post('/upload', function (request, response) {
    upload(request,response,function(err) {
          if(err) {
              return response.end("Error uploading file.");
          }
          path = process.cwd()+'\\files'
          fs.readdir(path, function(err, items) {
          response.render('page.ejs',{items : items,chat : messages})
      })
    })
  })

  io.sockets.on('connection', function(socket) {

    var uploader = new siofu();
    uploader.dir = files_folder_path;
    uploader.listen(socket);

   socket.on('testPseudo',function (message) {
     var pseudoValidation = true;
     for(var i = 0 ; i<pseudos.length ; i++){
       if(pseudos[i]==message){
         pseudoValidation=false;
       }
     }

     if (!(/([^\s])/.test(message) && message!=null)) {
       pseudoValidation=false
     }

     socket.emit('pseudoValidation',pseudoValidation)
     if (pseudoValidation) {
       pseudos.push(message)
       console.log(message+" entre dans le chat");

     }

   })
   socket.on('envoyer',function (data) {
     messages.push(data);
     console.log(data['pseudo']+" a écrit : \""+data['message']+"\"");
     socket.broadcast.emit('newMessage',data)
   })
   socket.on('write',function (pseudo) {
     var contains = false
     for(var i = 0 ; i<writters.length ; i++){
       if(writters[i]==pseudo){
         contains = true
       }
    }
    if (!contains) {
      socket.broadcast.emit('write',pseudo)
      writters.push(pseudo)
      }
   })
   socket.on('blur',function (pseudo) {
     delete writters[writters.indexOf(pseudo)]
     socket.broadcast.emit('blur',pseudo)
   })
    });

server.listen(8888);
console.log("Server available...");
