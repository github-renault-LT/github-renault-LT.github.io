var clientId = "aivi_" + Math.random();
// Create a client instance
var client = new Paho.MQTT.Client("m21.cloudmqtt.com", 33038, clientId);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

function connectClientNow() {
	var login    = document.getElementById("login").value;
	var password = document.getElementById("password").value;
	if ((login != undefined) && (password != undefined)) {
		// connect the client
		client.connect({
		  mqttVersion: 4,
		  useSSL: true,
		  userName: login,
		  password: password,
		  onSuccess: onConnect,
		  onFailure: onFailure
		});
	}
}

function publishMessage(topic, message) {
  if ((topic == undefined) || (topic.indexOf('+') != -1) || (topic.indexOf('#') != -1)) {
	// not a valid topic
	// we should also test for other not allowed chars...
	return false
  }

  var mqttMessage = new Paho.MQTT.Message(message);
  mqttMessage.destinationName = topic;
  client.send(mqttMessage);
}

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("MSG/1");
  client.subscribe("MSG/2");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
	console.log("onConnectionLost:", responseObject.errorMessage);
	setTimeout(function() { client.connect() }, 5000);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  //var tdTopic = document.createElement("td");
  //tdTopic.textContent = message.destinationName;

  //var tdMsg = document.createElement("td");
  var data = "";
  try {
	//tdMsg.textContent = message.payloadString;
	data = message.payloadString;
	var now = new Date().toUTCString();
    showReceivedMessage(message.destinationName, data)
  } catch (e) {
	//tdMsg.textContent = "*** Binary data ***";
	/*
	var pre = document.createElement("pre");
	var base64 = btoa(String.fromCharCode.apply(null, message.payloadBytes));
	pre.textContent = base64.replace(/(.{72})/g, "$1\n");
	var note = document.createElement("em");
	note.textContent = "Binary data (base64 encoded)"
	tdMsg.appendChild(note);
	tdMsg.appendChild(pre)
	*/
  }

  /*
  var tr = document.createElement("tr");
  tr.appendChild(tdTopic);
  tr.appendChild(tdMsg);

  document.getElementById("msgs").appendChild(tr);
  */

}

function onFailure(invocationContext, errorCode, errorMessage) {
  var errDiv = document.getElementById("error");
  errDiv.textContent = "Could not connect to WebSocket server, most likely you're behind a firewall that doesn't allow outgoing connections to port 33038";
  /* errDiv.style.display = "block"; */
}
