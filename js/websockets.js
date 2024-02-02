/* 
    websockets.js file to handle websockets communecations 
*/

var ws = new WebSocket("wss://138.68.89.86:6001", "echo-protocol");
//var ws = new WebSocket('ws://127.0.0.1:6001', 'echo-protocol');

ws.sendToString = function (msg) {
  var msgc = LZString.compressToUTF16(JSON.stringify(msg));

  this.send(msgc);
};

var teamID = 0;

var is_socket_open = false;

function selectTeam(num) {
  teamID = num;
}

function startGame() {
  if (is_socket_open) {
    msg = {
      msg: "CreateNewPlayer",

      payload: {
        name: document.getElementById("username").value,

        teamID: teamID,

        delta_server: delta,
      },
    };

    ws.sendToString(msg);
  } else {
    alert("خطاء في الاتصال بالسيرفر حاولاً مره اخرى!");

    return;
  }
}

updateHealth = function (tank) {
  if (tank == null) return;

  var msg = {
    msg: "updateHealth",
    payload: {
      UID: tank.UID,

      health: tank.health,
    },
  };

  ws.sendToString(msg);
};

sendNoneMove = function (tank) {
  if (tank == null) return;

  var msg = {
    msg: "sendNoneMove",
    payload: {
      UID: tank.UID,
      x: tank.x,
      z: tank.z,
    },
  };

  ws.sendToString(msg);
};
sendShot = function (tank) {
  if (tank == null) return;

  var msg = {
    msg: "recivedShot",
    payload: {
      UID: tank.UID,
    },
  };

  ws.sendToString(msg);
};
getTankData = function (UID) {
  var msg = {
    msg: "getTankData",
    payload: {
      UID: UID,
    },
  };

  ws.sendToString(msg);
};
updateTankFunc = function (tank, Ar) {
  if (tank == null) return;

  if (Ar == "up") Ar = "1";

  if (Ar == "down") Ar = "2";

  if (Ar == "left") Ar = "3";

  if (Ar == "right") Ar = "4";

  var msg = {
    msg: "updateTankAr",
    payload: {
      u: tank.UID,
      a: Ar,
      x: tank.x,
      z: tank.z,
      h: tank.health,
      k: tank.KillCount,
    },
  };

  ws.sendToString(msg);
};
ws.addEventListener("open", function (e) {
  is_socket_open = true;

  msg = {
    msg: "getTeamNum",
    payload: {},
  };

  ws.sendToString(msg);
});

window.addEventListener(
  "beforeunload",
  function (e) {
    ws.close();
  },
  false
);

ws.addEventListener("message", function (e) {
  var msg = e.data;

  var msg = LZString.decompressFromUTF16(msg);

  msg = JSON.parse(msg);

  if (msg.msg == "getTeamNum") {
    var teams = msg.payload;
    document.getElementById("players_0").textContent = teams.teams[0];
    document.getElementById("players_1").textContent = teams.teams[1];
    document.getElementById("players_2").textContent = teams.teams[2];

    return;
  }
  if (msg.msg == "getTankData") {
    var tank = msg.payload;

    CreateOrUpdateTank(
      tank.name,
      tank.teamID,
      tank.health,
      tank.KillCount,
      tank.x,
      tank.z,
      tank.UID,
      tank.delta_server
    );

    return;
  }
  if (msg.msg == "sendNoneMove") {
    var tank = msg.payload;

    NoneMove(tank.UID, tank.x, tank.z);

    return;
  }
  if (msg.msg == "updateHealth") {
    var tank = msg.payload;

    updateHealth(tank.UID, tank.health);

    return;
  }

  if (msg.msg == "updateTankAr") {
    var tank = msg.payload;

    if (tank.a == "1") tank.a = "up";

    if (tank.a == "2") tank.a = "down";

    if (tank.a == "3") tank.a = "left";

    if (tank.a == "4") tank.a = "right";

    updateTankAr(tank.u, tank.a, tank.x, tank.z, tank.h, tank.k);

    return;
  }

  if (msg.msg == "recivedShot") {
    var tank = msg.payload;

    recivedShot(tank.UID);

    return;
  }

  if (msg.msg == "") {
    var tank = msg.payload;

    NoneMove(tank.UID);

    return;
  }

  if (msg.msg == "CreateOrUpdateTank") {
    var tank = msg.payload;

    CreateOrUpdateTank(
      tank.name,
      tank.teamID,
      tank.health,
      tank.KillCount,
      tank.x,
      tank.z,
      tank.UID,
      tank.delta_server
    );

    return;
  }

  if (msg.msg == "CreateNewPlayer") {
    var NewPlayer = msg.payload;
    createNewPlayer(
      NewPlayer.name,
      NewPlayer.teamID,
      NewPlayer.health,
      NewPlayer.KillCount,
      NewPlayer.x,
      NewPlayer.z,
      NewPlayer.UID,
      NewPlayer.delta_server
    );
    document.getElementById("intro").removeChild(document.getElementById("introinput"));
    return;
  }
});
