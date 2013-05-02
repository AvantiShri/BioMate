Parse.$ = jQuery;

Parse.initialize("C9TPknemAEmJzz1xcKFbBC855l64A4T4R2EFjxBH", "iJGffHXEvURl0BDlT0PeeL7ex2s0qT7uJA6BJvEV");


var currentUser = Parse.User.current();
if (currentUser == null) {
	var logInUrl = "biomate_login.html";
	if ($.getUrlVar('scriptId')) {
		//Show the notification
		logInUrl = logInUrl + "?scriptId=" + $.getUrlVar('scriptId');
		//alert(logInUrl);
	} else {
		//alert("nothing");
	}
	window.location = logInUrl;
}

else{
$(document).ready(function(){
	
	// create some fake data
//    var chunks = [];
//    Parameter.createParameter("alias4", "prefixFlag4", "userFriendyName4", "defaultVal4",
//                              InputType.STRING, true, "warnings4", "tooltip4", parameterCreated);
//    function parameterCreated(parameter) {
//        CommandChunk.createCommandChunk(CommandChunkType.PARAMETER, parameter, chunkCreated);
//        StaticText.createStaticText("static text4", staticTextCreated);
//    }
//    function staticTextCreated(staticText) {
//        CommandChunk.createCommandChunk(CommandChunkType.STATIC_TEXT, staticText, chunkCreated);
//    }
//    function chunkCreated(chunk) {
//        chunks.push(chunk);
//        if(chunks.length == 2) {
//            ScriptData.createScriptData(chunks, "caveats4", "instructions4", scriptDataCreated);
//        }
//    }
//    function scriptDataCreated(scriptData) {
//        Script.createScript(currentUser, "script4", scriptData, scriptCreated);
//    }
//    function scriptCreated(script) {
//        History.createHistory(currentUser, script, done);
//        Note.createNote(currentUser, script, "script4 awesome note", done);
//        script.shareScript();
//        UserScript.createUserScript(currentUser, script, done);
//    }
//    function done(data) {
//    } 
    
	//Center the "info" bubble in the  "circle" div
	var divTop = ($("#divCircle").height() - $("#middleBubble").height())/2;
	var divLeft = ($("#divCircle").width() - $("#middleBubble").width())/2;
	$("#divCircle").disableSelection();
	$("#middleBubble").css("top",divTop + "px");
	$("#middleBubble").css("left",divLeft + "px");

	//Arrange the icons in a circle centered in the div
	numItems = $( "#divCircle img" ).length; //How many items are in the circle?
	start = 0; //the angle to put the first image at. a number between 0 and 2pi
	step = (2*Math.PI)/numItems; //calculate the amount of space to put between the items.

	//Now loop through the buttons and position them in a circle
	$( "#divCircle img" ).each(function( index ) {
		radius = ($("#divCircle").width() - $(this).width())/2; //The radius is the distance from the center of the div to the middle of an icon
		//the following lines are a standard formula for calculating points on a circle. x = cx + r * cos(a); y = cy + r * sin(a)
		//We have made adjustments because the center of the circle is not at (0,0), but rather the top/left coordinates for the center of the div
		//We also adjust for the fact that we need to know the coordinates for the top-left corner of the image, not for the center of the image.
		tmpTop = (($("#divCircle").height()/2) + radius * Math.sin(start)) - ($(this).height()/2);
		tmpLeft = (($("#divCircle").width()/2) + radius * Math.cos(start)) - ($(this).width()/2);
		start += step; //add the "step" number of radians to jump to the next icon
		
		//set the top/left settings for the image
		$(this).css("top",tmpTop);
		$(this).css("left",tmpLeft);
	});

	//set the highlight and bubble default based on the homepageGridDefault class
	currentGridSelector = $(".homepageGridDefault").attr("id");
	$("#" + currentGridSelector).attr("src", "../images/"+ currentGridSelector + "-on.png");
	$("#middleBubble").html("<p></br><b>" + $(".homepageGridDefault").data("bubble1") + "</b></p>");

	//Setup the grid to change the highlighted bubble on mouseover ans click
	$("#divCircle img").mouseover(function(){
		//if the selected option has changed, deactivate the current selection
		if(currentGridSelector != $(this).attr("id"))
		{
			$("#" + currentGridSelector).attr("src", "../images/"+ currentGridSelector + "-off.png");
		}
		//turn on the new selection
		$(this).attr("src", "../images/"+ $(this).attr("id") + "-on.png");
		//set the content of the center bubble
		$("#middleBubble").html("<p><b></br>" + $(this).data("bubble1") + "</b></p>");
		currentGridSelector = $(this).attr("id");
	});

	$("#divCircle img").mouseleave(function(){
		//if the selected option has changed, deactivate the current selection
		if(currentGridSelector != $(this).attr("id"))
		{
			$("#" + currentGridSelector).attr("src", "../images/"+ currentGridSelector + "-off.png");
		}
		//turn off the new selection
		$(this).attr("src", "../images/"+ $(this).attr("id") + "-off.png");
		//set the content of the center bubble
		$("#middleBubble").html("<p><b></br>" + "" + "</b></p>");
		currentGridSelector = null;
	});
	var curScName = "";
	var collName = "";
	var sName = document.getElementById("curScriptName");
	var cName = document.getElementById("collabName");
	if ($.getUrlVar('scriptId')) {
		//Show the notification
		var sid = $.getUrlVar('scriptId');
		Script.getScriptById(sid, function(script){
			curScName = script.get("name");
			collName = script.get("owner").get("name");
			console.log(curScName, collName);
			cName.innerHTML = collName;
			sName.innerHTML = curScName;
			$("#notify").modal("show");
			UserScript.getUserScriptByUserScript(currentUser, script, function(userScript){
				if(!userScript)
					UserScript.createUserScript(currentUser, script, function(){alert(sid + " created!!");});
			});
		});
		
	} else {
		//alert("nothing");
	}
	
	var userSpan = document.getElementById("userName");
	userSpan.innerHTML = currentUser.get("name");
	
	$("#btnSignOut").click(function(e){
		Parse.User.logOut();
		window.location = "biomate_login.html";
	});
	
    // load history listing
	$(".history").on('click', function(){ 
		$("#historyTableBody").empty();
        History.getUserHistory(currentUser, 10, loadHistory);
	});
    
    // callback to load user history
    function loadHistory(history) {
        var len = history.length;
        for(var i = 0; i < len; ++i) {
            var hist = history[i];
            var script = hist.get("script");
            var owner = script.get("owner");
            $("#historyTableBody").append(
                "<tr scriptId='" + script.id + "'><td>" + script.get("name") +
                "</td><td>" + owner.get("name") +
                "</td><td>" + dateToString(hist.createdAt) +
                "</td><td>" + (owner.id === currentUser.id ? "<a href='programmer_facing.html?scriptId=" + script.id + "'>Edit</a> &nbsp " : "") + 
                "<a href='lab_bench_view.html?scriptId=" + script.id + "'>Use Script</a>" + 
                "</td></tr>");
        }
    }
	
    // load notes listing
	$(".notes").on('click', function(){ 		
        $("#notesTableBody").empty();
        Note.getUserNotes(currentUser, loadNotes);
	});
    
    // callback to load user notes
    function loadNotes(notes) {
        var len = notes.length;
        for(var i = 0; i < len; ++i) {
            var note = notes[i];
            var script = note.get("script");
            var owner = script.get("owner");
            $("#notesTableBody").append(
                "<tr noteId='" + note.id + "'><td>Note on " + script.get("name") +
                "</td><td>" + owner.get("name") +
                "</td><td>" + dateToString(note.updatedAt) +
                "</td></tr>");
        }
    }
	
	// show the text for a specific note
	$(document).on("click", "#notesTableBody tr", function () {
        var noteId = $(this).attr("noteId");
        Note.getNoteById(noteId, loadNote);
	});
    
    // callback to show a specific note
    function loadNote(note) {
        var script = note.get("script");
        var owner = script.get("owner");
        var text = note.get("text");
        $("#noteHeader").html("Note on " + script.get("name") + " (" + owner.get("name") + ")");
        $("#noteText").html(text);
		$("#noteTextPopup").modal();
		$("#noteTable").modal("hide");
    }
});
}
