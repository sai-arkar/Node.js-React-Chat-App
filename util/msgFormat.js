const moment = require("moment");

function formatMessage(msg){
     return {
          msg,
          time: moment().format("h:mm a")
     }
}

module.exports = formatMessage;