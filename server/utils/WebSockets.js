var users = [];

class WebSockets {  
  connection(client) {
    // add identity of user mapped to the socket id
    client.on("identity", (userId) => {
      users.push({
        socketId: client.id,
        userId: userId,
      });
    });

    client.on("alertPartnerOnline", (userID) => {
      // client, client.to
      if(typeof userID !== "object") {
        let user = users.find(user => user.userId === userID)
        if(user){
          // console.log("partner online", user, users, userID)
          client.to(user.socketId).emit("isPartnerOnline", true )
          return;
        } 
        console.log("partner offline", user, users, userID)
      }
    });

    client.on("isOnline", (userID) => {
      // client, client.to
      if(typeof userID !== "object") {
        let user = users.find(user => user.userId === userID)
        if(user){          
          // console.log("online", user, users, userID)
          client.emit("isOnline", true, userID )
          return;
        } 
        client.emit("isOnline", false, userID )
      }
    });

    client.on("isTyping", (isTyping, userID) => {
      // client, client.to
      if(typeof userID !== "object") {
        let user = users.find(user => user.userId === userID)
        if(user){
          client.to(user.socketId).emit("isTyping", isTyping )
          return;
        } 
      }
    });

    client.on("sendChat", (message, userID, fromID) => {
      let user = users.find(user => user.userId === userID)
      console.log(user, users, userID, fromID)
      if(user){
        client.to(user.socketId).emit("receiveChat", message, fromID )
        client.to(user.socketId).emit("isTyping", false )
      }
     });

    // event fired when the chat room is disconnected
    client.on("disconnect", () => {
      users = users.filter((user) => user.socketId !== client.id);
      client.broadcast.emit("isPartnerOnline", false )
    });


    // subscribe person to chat & other user as well
    client.on("subscribe", (room, otherUserId = "") => {
      subscribeOtherUser(room, otherUserId, users);
      client.join(room);
    });

    // mute a chat room
    client.on("unsubscribe", (room) => {
      client.leave(room);
    });
  }
}

function subscribeOtherUser(room, otherUserId, users) {  
  const userSockets = users.filter(
    (user) => user.userId === otherUserId
    );
    
  userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected[userInfo.socketId];
      if (socketConn) {
        socketConn.join(room);
      }
  });
}

export default new WebSockets();