var files = document.getElementsByTagName('a')
var label = document.getElementById('label')
var file_input = document.getElementById('file_input')
var socket = io.connect(document.location.href);
var siofu = new SocketIOFileUpload(socket);
var start = document.getElementById('start')
var sendMessage = document.getElementById('sendMessage')
var pseudoElt = document.getElementById('pseudo')
var textStart = document.getElementById('textStart')
var envoyer = document.getElementById('envoyer')
var progression = document.getElementById('progression')
var message = document.getElementById('message')
var allMessages = document.getElementById('allMessages')
var whoWrite = document.getElementById('whoWrite')
var checkbox_progress = document.getElementById('checkbox_progress')
var button_upload = document.getElementById('button_upload')
var pseudo
var home1 = document.getElementById('home1')
var button_siofu = document.getElementById('button_siofu')
home1.href=document.location.href
home2.href=document.location.href
checkCookie()

button_siofu.addEventListener('click',function (e) {
  document.getElementById('hidden_progress').style.display = "block"
},false)

checkbox_progress.addEventListener('change',function (e) {
  if (checkbox_progress.checked) {
    button_siofu.style.display="inline-block"
    button_upload.style.display="none"
  }
  else {
      button_upload.style.display="inline-block"
      button_siofu.style.display="none"
  }
},false)

siofu.listenOnSubmit(button_siofu, file_input);

siofu.addEventListener("progress", function(event){
    var percent = event.bytesLoaded / event.file.size * 100;
    progression.style.width = percent+"%"
});

siofu.addEventListener("complete", function(event){
  window.location.reload()
});

file_input.addEventListener('change',function (e) {
  label.innerHTML=file_input.value.substring(file_input.value.lastIndexOf('\\')+1)
},false);


start.addEventListener('click',function (e) {
  pseudo = prompt("Entrer votre pseudo :")
  if (/([^\s])/.test(pseudo) && pseudo!=null) {
    socket.emit('testPseudo',pseudo)
    socket.on('pseudoValidation',function (boolean) {
      if(boolean){
        setCookie("pseudo", pseudo, 365);
        showInput(pseudo)
      }
      else {
        $('#start').removeClass('btn-primary')
        $('#start').addClass('btn-danger')
        $('#icon').removeClass('glyphicon-comment')
        $('#icon').addClass('glyphicon-warning-sign')
        textStart.innerHTML=" Pseudo déjà utilisé ! Veuillez utiliser un autre pseudo"
      }
    })
  }
},false)

$('#nextFocus').focus(function () {
    $('#envoyer').focus()
})

envoyer.addEventListener('click',function(e){
  e.preventDefault()
  if (/([^\s])/.test(message.value)) {
    socket.emit('envoyer',{pseudo:pseudo , message:message.value})
    insertMessage(pseudo,message.value)
    message.value=""
  }
  $('textarea').focus()
},false)

socket.on('newMessage',function(data){
  insertMessage(data['pseudo'],data['message'])
})

socket.on('write',function (pseudo) {
    var writter = document.createElement('div')
    var strong = document.createElement('strong')
    strong.innerHTML=pseudo
    var text = document.createElement('span')
    text.innerHTML=" est entrain d'écrire..."
    writter.appendChild(strong)
    writter.appendChild(text)
    show(writter,whoWrite)
})
socket.on('blur',function (pseudo) {
  var child = whoWrite.firstChild
  if(child.firstChild.innerHTML==pseudo){
    whoWrite.removeChild(child)
  }else{
    while(child.nextSibling){
      if(child.firstChild.innerHTML==pseudo){
        whoWrite.removeChild(child)
        break
      }
        child=child.nextSibling
    }
  }
})
message.addEventListener('focus',function (e) {
  socket.emit('write', pseudo)
},false)

message.addEventListener('keydown',function (e) {
  socket.emit('write', pseudo)
},false)

message.addEventListener('blur',function (e) {
  socket.emit('blur', pseudo)
},false)

$(function () {
  $('a').click(function(){
    var pos = $($(this).attr('href')).offset().top;
    $('body, html').animate({scrollTop:pos}, 1000);
    })
});
