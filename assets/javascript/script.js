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

// New Train from Collapse
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
        freq: freq,
    }

    //database.ref("trains/").push(newTrain);
    var key = database.ref("trains/").push(newTrain).getKey(); // this pushes the information and grabs the ID from the db
    console.log("key is "+key)

    database.ref("trains/"+key).update({key:key});

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


//Updating train from Modal
$(document).on("click", ".updateTrain", function(event){
    event.preventDefault();
    var name = $("#nameUpdate").val().trim();
    var destination = $("#destinationUpdate").val().trim();
    var start = $("#startUpdate").val().trim();
    var freq = $("#frequencyUpdate").val().trim();
    
    trainId = $(this).attr('id'); 
    console.log(trainId)

    //only updates each key if not empty
    if (name!=="") { 
        database.ref("trains/"+trainId).update({name:name});
      }
    if (destination!=="") {
        database.ref("trains/"+trainId).update({destination:destination});
      }
    if (start!=="") {
        database.ref("trains/"+trainId).update({start:start});
      }
    if (freq!=="") {
        database.ref("trains/"+trainId).update({freq:freq});
      }

    $("#nameUpdate").val("")
    $("#destinationUpdate").val("")
    $("#startUpdate").val("")
    $("#frequencyUpdate").val("")
});

// pulling from database when a child is added
database.ref("trains/").on("child_added", function(childSnapshot) {
console.log(childSnapshot.val());

    var newRecord=childSnapshot.val();
    var startTime = moment(newRecord.start, "hh:mm").format("LT")
    var startTimeU = moment(newRecord.start, "hh:mm").format("X"); // Use 'X' for unix time
    console.log("StartTimeU: "+startTimeU) 

    var freq = newRecord.freq;
    console.log("every "+freq+" min")

    key = newRecord.key;
    console.log("dbID for train: "+key)

    //math to get the minutes remainding until next train
    var tRemainder = moment().diff(moment.unix(startTimeU), "minutes") % freq;
    var timeRemain = freq - tRemainder;
    console.log("min remaining: "+timeRemain)

    var nextTrain = moment().add(timeRemain, "minutes").format("LT");
    console.log("nextTrain: "+nextTrain)

    $("tbody").append("<tr class='"+key+"'><td>"+newRecord.name+"</td><td>"+newRecord.destination+"</td><td>"+newRecord.freq+" min</td><td>"+nextTrain+"</td><td>"+timeRemain+"  min</td><td>"+startTime+"</td><td><button class='btn btn-outline-secondary btn-sm remove "+newRecord.name+"' id='"+key+"' style='font-size:8px; padding-left:4px; padding-right:4px'>Remove</button><button type='button' class='btn btn-outline-secondary btn-sm update "+newRecord.name+"' data-toggle='modal' data-target='#exampleModal' id='"+key+"' style='font-size:8px; padding-left:4px; padding-right:4px'>Update</button></td>")


    //modal --- appended to the end of the tr for each line and called by update button
    var modal = $("tbody").append("<div class='modal fade' id='exampleModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='exampleModalLabel'>Update Train Info</h5><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'> <form><div class='form-group'><input type='text' class='form-control' id='nameUpdate' placeholder='Train'></div><div class='form-group'><input type='text' class='form-control' id='destinationUpdate' placeholder='Destination'></div><div class='form-group'><input type='text' class='form-control' id='startUpdate' placeholder='HH:mm - military time'></div><div class='form-group'><input type='number' class='form-control' id='frequencyUpdate' placeholder='minutes'></div> <button type='submit' class='btn btn-outline-info updateTrain' data-dismiss='modal' >Save changes</button></div></div> </form> </div></div>")
});  

// displays updated line on table when child is updated
database.ref("trains/").on("child_changed", function(childSnapshot) {
    console.log(childSnapshot.val());
    
    var newRecord=childSnapshot.val();
    var startTime = moment(newRecord.start, "hh:mm").format("LT")
    var startTimeU = moment(newRecord.start, "hh:mm").format("X"); // Use 'X' for unix time
    console.log("StartTimeU: "+startTimeU) 
    
    var freq = newRecord.freq;
    console.log("every "+freq+" min")
    
    key = newRecord.key;
    console.log("dbID for train: "+key)
    
    //math to get the minutes remainding until next train
    var tRemainder = moment().diff(moment.unix(startTimeU), "minutes") % freq;
    var timeRemain = freq - tRemainder;
    console.log("min remaining: "+timeRemain)
    
    var nextTrain = moment().add(timeRemain, "minutes").format("LT");
    console.log("nextTrain: "+nextTrain)
    
    // replaces <tr> with updated child
    $("."+trainId).replaceWith("<tr class='"+key+"'><td>"+newRecord.name+"</td><td>"+newRecord.destination+"</td><td>"+newRecord.freq+" min</td><td>"+nextTrain+"</td><td>"+timeRemain+"  min</td><td>"+startTime+"</td><td><button class='btn btn-outline-secondary btn-sm remove "+newRecord.name+"' id='"+key+"' style='font-size:8px; padding-left:4px; padding-right:4px'>Remove</button><button type='button' class='btn btn-outline-secondary btn-sm update "+newRecord.name+"' data-toggle='modal' data-target='#exampleModal' id='"+key+"' style='font-size:8px; padding-left:4px; padding-right:4px'>Update</button></td>")
    });

//modal update button  --- 
$(document).on("click", ".update", function(event){
    event.preventDefault();
     var updateId = $(this).attr('id'); 
    console.log(updateId)
    $(".updateTrain").attr('id', updateId) // adds train ID in modal submit button

});

//remove button for each train
$(document).on("click", ".remove", function(event){
    event.preventDefault();
    $(this).closest ('tr').remove();
     trainId = $(this).attr('id'); 
    console.log(trainId)
    database.ref("trains/"+trainId).remove();
});

//displays date and time on page
$(".currentTime").text(moment().format("llll"))
console.log(moment().format("hh:mm"))


// disables remove and update buttons for fixed trains ---

$(document).on("mouseover", function(){ // for laptop / desktop
    $(".Brightline").attr("disabled",true);//can also use .css("display","none")  or .addClass('btn-disabled');
    $(".Hogwarts").attr("disabled",true);
    $(".AmTrak").attr("disabled",true);
    $(".Blue").attr("disabled",true)
});

$(document).on("touchstart",function(){  // for mobile touchscreen devices
    $(".Brightline").attr("disabled",true);
    $(".Hogwarts").attr("disabled",true);
    $(".AmTrak").attr("disabled",true);
    $(".Blue").attr("disabled",true)
});