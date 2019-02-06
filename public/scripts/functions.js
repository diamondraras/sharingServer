function insertMessage(pseudo,message) {
  var button = document.createElement('button')
  var glyphicon = document.createElement('span')
  var pseudoSpan = document.createElement('span')
  var messageDiv = document.createElement('div')
  var separation = document.createElement('div')
  var pre = document.createElement('pre')
  button.className="btn btn-primary btn-lg col-md-2"
  glyphicon.className="glyphicon glyphicon-user"
  pseudoSpan.className="pseudo"
  separation.className="separation"
  pre.className="message"
  pseudoSpan.innerHTML=pseudo
  messageDiv.innerHTML=escapeHtml(message)
  button.appendChild(glyphicon)
  pre.appendChild(messageDiv)
  separation.appendChild(button)
  separation.appendChild(pseudoSpan)
  separation.appendChild(pre)
  show(separation,allMessages)
}

function show(element,parent) {
  parent.insertBefore(element,parent.firstChild)
  var child = parent.firstChild
  var height = child.offsetHeight
  var pas = Math.floor(height/10)
  child.style.height=0+"px"
  child.style.opacity=0

    for (var i = 0; i <= 10; i++) {
      (function (f) {
        setTimeout(function () {
          child.style.height=f*pas+"px"
          if(f==10){
            child.style.height=height
          }
        },10*i)
      })(i)
    }

    for (var i = 0; i < 100; i++) {
      (function (f) {
        setTimeout(function () {
          child.style.opacity=f/100
        },10*i)
      })(i)
    }
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("pseudo");
    if (user != "") {
        showInput(user);
        pseudo=user
        socket.emit('testPseudo',pseudo)
    }
    else {
      start.style.display='block'
    }
}

function showInput(pseudo) {
  pseudoElt.innerHTML=pseudo
  sendMessage.style.display='block';
  start.style.display='none';
}


function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
