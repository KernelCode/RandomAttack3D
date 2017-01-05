var ws = new WebSocket('wss://polar-dawn-54951.herokuapp.com:45778', 'echo-protocol');


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
    ws.send(JSON.stringify(msg));
}
sendShot = function(tank){
    if(tank==null)
        return ;
    var msg = {'msg':"recivedShot",'payload':{
        UID:tank.UID
    }};
    ws.send(JSON.stringify(msg));
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

    ws.send(JSON.stringify(msg));
}
ws.addEventListener("open",function(e){
    
    is_socket_open=true;

});

ws.addEventListener("message", function(e) {
    // The data is simply the message that we're sending back
    var msg = e.data;
    console.log(e.data);
    var msg = JSON.parse(msg);
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

