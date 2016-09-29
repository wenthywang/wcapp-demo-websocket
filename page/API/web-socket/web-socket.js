  var socketOpen=false;
var  socketMsgQueue = [];
Page({
  data:{
    items:[

    ],

  },
    onReady: function() {
   wx.connectSocket({
   url:"ws://127.0.0.1:8080/demo/websocket",
  success:function(res)
  {
    console.log('ok');
    wx.onSocketOpen(function(res){
    socketOpen=true;
    for(var i = 0 ; i <socketMsgQueue.length; i++){
 	    this.sendSocketMessage( socketMsgQueue[i])
     }
    socketMsgQueue = [];
    }),
    wx.onSocketMessage(function(res){

     var thisapp = getApp();
     var thispage = thisapp.getCurrentPage();
    var changedData ={}
    console.log( thispage.data.items.length);
    var index = thispage.data.items.length;
    changedData['items[' + index + '].text'] = res.data;
    thispage.setData(changedData)
    console.log("收到服务器内容：" + res.data)
    })
  },
  fail: function(res){
    console.log(res);
  }
    });
  },
 sendSocketMessage:function(msg)
 {
    if(socketOpen){
    wx.sendSocketMessage({
       data:msg
    });
  }else{
     socketMsgQueue.push(msg)
  }
 },
 bindSendMessage:function(e)
 {
    console.log(e);
    var msg =e.detail.value.msg;
    this.sendSocketMessage(msg);
 }


})