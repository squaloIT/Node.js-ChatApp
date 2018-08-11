var moment = require("moment");

var date = moment();
date.add(100,'y').subtract(8,'month');
// console.log(date.format("MMM Do Y"));

//10:35 am
var someTimestamp = moment().valueOf();
console.log(someTimestamp);
console.log(date.format("H:mm a"));