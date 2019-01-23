// Initialize Firebase
var config = {
    apiKey: "AIzaSyD2n-geuVwYDFWq6sJJ2BQlM81vNEN_6ko",
    authDomain: "trainschedule-ced3f.firebaseapp.com",
    databaseURL: "https://trainschedule-ced3f.firebaseio.com",
    projectId: "trainschedule-ced3f",
    storageBucket: "trainschedule-ced3f.appspot.com",
    messagingSenderId: "811590552576"
  };
  firebase.initializeApp(config);

database = firebase.database();



$("#submit").on("click", function(event){
    event.preventDefault();
    var name = $("#nameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var start = $("#startInput").val().trim();
    var freq = $("#frequencyInput").val().trim();
    
    if (name==""||destination==""||start==""||freq=="") {
        return false;
      }

    else{
    var newTrain = {
        name: name,
        destination: destination,
        start: start,
        freq: freq
    }
    database.ref("trains/").push(newTrain);

    $("#nameInput").val("")
    $("#destinationInput").val("")
    $("#startInput").val("")
    $("#frequencyInput").val("")

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.freq);
    }
});

database.ref("trains/").on("child_added", function(childSnapshot) {
     
    

console.log(childSnapshot.val());

var newRecord=childSnapshot.val();

/* var startTime = newRecord.start; */

var startTimeU = moment(newRecord.start, "hh:mm").format("X"); // Use 'X' for unix time
console.log("StartTimeU: "+startTimeU) 

var freq = newRecord.freq;
console.log("every "+freq+" min")

/* var startTime = moment.unix(startTimeU).format("LT"); // had hh:mm
console.log("startTime: "+startTime)

var tDiff =  moment().subtract(moment(startTimeU), "minutes");
console.log("moment(): "+moment())
console.log("tDiff: "+tDiff)

 var timeAppart = tDiff % freq;
 console.log(timeAppart+" appart")

 var timeRemain = freq - timeAppart;
 console.log(timeRemain+" remain") */

/* var nextTrain = moment.unix(startTimeU).add(freq, 'minutes').format('LT');
console.log("nextTrain: "+nextTrain); */

var tRemainder = moment().diff(moment.unix(startTimeU), "minutes") % freq;
var timeRemain = freq - tRemainder;

var nextTrain = moment().add(timeRemain, "minutes").format("LT");
console.log("nextTrain: "+nextTrain)




$("tbody").append("<tr><td>"+newRecord.name+"</td><td>"+newRecord.destination+"</td><td>"+newRecord.freq+"</td><td>"+nextTrain+"</td><td>"+timeRemain+"  min</td><td>"+startTime+"</td>")

});
$(".currentTime").text(moment().format("llll"))
console.log(moment().format("hh:mm"))