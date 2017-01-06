//var ws = new WebSocket('wss://randomattack3d.herokuapp.com', 'echo-protocol');
var ws = new WebSocket('ws://127.0.0.1:6001', 'echo-protocol');
var getUTF8Size = function( str ) {
  var sizeInBytes = str.split('')
    .map(function( ch ) {
      return ch.charCodeAt(0);
    }).map(function( uchar ) {
      // The reason for this is explained later in
      // the section “An Aside on Text Encodings”
      return uchar < 128 ? 1 : 2;
    }).reduce(function( curr, next ) {
      return curr + next;
    });

  return sizeInBytes;
};

var teamID = 0;

var is_socket_open=false;
function selectTeam(num){
    teamID=num;
}
function startGame(){

    if(is_socket_open){
        msg = JSON.stringify({
            msg:"CreateNewPlayer",
            payload:{
                'name':document.getElementById('username').value,
                'teamID':teamID
            }
        });
       

        msg = LZString.compressToUTF16(msg);

        ws.send(msg);

    }else{
        alert("خطاء في الاتصال بالسيرفر حاولاً مره اخرى!");
        return ;
    }


}
updateHealth = function(tank){
    if(tank==null)
        return ;
    var msg = {'msg':"updateHealth",'payload':{
        UID:tank.UID,
        health:tank.health
    }};
    msg = LZString.compressToUTF16(JSON.stringify(msg));

    ws.send(msg);
}
sendShot = function(tank){
    if(tank==null)
        return ;
    var msg = {'msg':"recivedShot",'payload':{
        UID:tank.UID
    }};
    
    msg = LZString.compressToUTF16(JSON.stringify(msg));
    ws.send(msg);
}
updateTankFunc = function(tank,Ar){
    if(tank == null)
        return ;
    var msg = {'msg':"updateTankAr",'payload':{
        UID:tank.UID,
        Ar:Ar,
        x:tank.x,
        y:tank.y,
        health:tank.health,
        KillCount:tank.KillCount,
    }};
    msg  = JSON.stringify(msg);
    
    msg = LZString.compressToUTF16(msg);
   
    ws.send(msg);
}
ws.addEventListener("open",function(e){
    
    is_socket_open=true;
    
    msg = JSON.stringify({
        msg:"getTeamNum",
        payload:{}
    });

    msg = LZString.compressToUTF16(msg);

    ws.send(msg);

});

ws.addEventListener("message", function(e) {
    // The data is simply the message that we're sending back
    var msg = e.data;
    var msg = LZString.decompressFromUTF16(msg);
    var msg = JSON.parse(msg);
    if(msg.msg=="getTeamNum"){
        var teams = msg.payload;
        document.getElementById('players_0').textContent =teams.teams[0];
        document.getElementById('players_1').textContent =teams.teams[1];
        document.getElementById('players_2').textContent =teams.teams[2];
        return ;
    }
    if(msg.msg=="updateHealth"){
        var tank = msg.payload;
        updateHealth(tank.UID,tank.health);
        return ;
    }
    if(msg.msg=="updateTankAr"){
        var tank = msg.payload;

        updateTankAr(tank.UID,tank.Ar,tank.x,tank.y,tank.health,tank.KillCount);
        return ;
    }
    if(msg.msg=="recivedShot"){
        var tank = msg.payload;
        recivedShot(tank.UID);
        return ;
    }
    
    if(msg.msg=="CreateOrUpdateTank"){
        
        var tank = msg.payload;
        CreateOrUpdateTank(

            tank.name,
            tank.teamID,
            tank.health,
            tank.KillCount,
            tank.x,
            tank.z,
            tank.UID

        );
        
        return ;
    }

    if(msg.msg=="CreateNewPlayer"){
        
        var NewPlayer = msg.payload;
        createNewPlayer(
            NewPlayer.name,
            NewPlayer.teamID,
            NewPlayer.health,
            NewPlayer.KillCount,
            NewPlayer.x,
            NewPlayer.z,
            NewPlayer.UID
        );
        document.getElementById('intro').removeChild(document.getElementById('introinput'));
        return ;
    }

});
