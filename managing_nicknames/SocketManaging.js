/**
 * Created by xavier.moreno on 17/04/2015.
 */
nicknames=[];
module.exports = function (io) { // io stuff here... io.on('conection.....
    io.sockets.on('connection', function (socket) {
        socket.on('nickname', function (data,callback) {
            if (nicknames.indexOf(data) != -1){
                callback(false);
            }
            else {
                callback(true);
                nicknames.push(data);
                socket.nickname = data;
                console.log('nicknames are: ' + nicknames)
                io.sockets.emit('nicknames',nicknames)
            }
        });
        socket.on('disconnect', function () {
            if (!socket.nickname) return;
            if (socket.nickname.indexOf(socket.nickname) > -1) {
                nicknames.splice(nicknames.indexOf(socket.nickname), 1)
            }
            console.log('nicknames are: ' + nicknames);
            io.sockets.emit('nicknames',nicknames)
        });

        socket.on('user message', function (data) {
            io.sockets.emit('user message',{
                nick: socket.nickname,
                message:data
            });
        });
    })
}
