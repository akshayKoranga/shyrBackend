
var {checkCode} = require('./../../utils/codes');
//
// var checkUserCode = (req, res, io) => {
//   io.socket.on('newCode', (data) => {
//     checkCode(data.event_id , data.code , (response) => {
//       socket.emit('checkCode',response);
//     });
//   });
// }
//
// module.exports = {
//   checkUserCode
// };

module.exports = exports = function checkUserCode(io){
  io.sockets.on('newCode', (data) => {
      checkCode(data.event_id , data.code , (response) => {
        sockets.emit('checkCode',response);
      });
    });
}
