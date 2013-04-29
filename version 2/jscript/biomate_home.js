Parse.$ = jQuery;

Parse.initialize("tFiHdHJHbyxrNdkAmCPjisX3ezUdfURfqPDUH85C", "Z7yWpLNyF0enW6oyX7VaN4iBArhgM9ZASwZMl4va");


var currentUser = Parse.User.current();
if (currentUser == null) {
	window.location = "biomate_login.html";
}

else{
$(document).ready(function(){
	
    // create some fake data
//    ScriptData.createScriptData([], "caveats3", "instructions3", scriptDataCreated);
//    function scriptDataCreated(scriptData) {
//        Script.createScript(currentUser, "script3", scriptData, scriptCreated);
//    }
//    function scriptCreated(script) {
//        History.createHistory(currentUser, script, historyCreated);
//    }
//    function historyCreated(history) {
//        console.log(history);
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
	
	$("#btnSignOut").click(function(e){
		Parse.User.logOut();
		window.location = "biomate_login.html";
	});
	
    // load history listing
	$(".history").on('click', function(){ 
		//var m = $("#historyTable");
		//$("#historyTable").modal('toggle');
		//console.log(m);
        
        History.getUserHistory(Parse.User.current(), 10, loadHistory);
	});
    
    // callback to load user history
    function loadHistory(history) {
        var len = history.length;
        for(var i = 0; i < len; ++i) {
            var hist = history[i];
            var script = hist.get("script");
            var owner = script.get("owner");
            $("#historyTableBody").append(
                "<tr><td>" + script.get("name") +
                "</td><td>" + owner.get("name") +
                "</td><td>" + hist.createdAt +
                "</td><td>" + (owner.id === currentUser.id ? "<a href='programmer_facing.html'>Edit</a> &nbsp " : "") + 
                "<a href='lab_bench_view.html'>Use Script</a>" + 
                "</td></tr>");
        }
    }
	
	$(".notes").on('click', function(){ 
		console.log('Notes');
	});
	
	// show monte-carlo notes
	$("#noteTable #monte-carlo").click( function () {
		$("#monte-carlo-notes").modal();
		$("#noteTable").modal("hide");
	});
});
}
