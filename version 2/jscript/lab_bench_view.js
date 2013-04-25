// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(function() { 
	$("#loadParamsTable tr").click( function () {
		$(this).addClass('highlight').siblings().removeClass('highlight');
		$("#btnLoad").removeClass("disabled");
	});
	
	$("#saveParamsBtn").click( function () {
		$("#savedMsg").html("Saved Parameters at " + getTheDate());
		$("#savedMsg").show();
	});
	
	$('.info').tooltip();
	$('#selectScriptLbl').tooltip();
	
	$("#inputScript").change( function () {
		if( this.selectedIndex != 0 ) {
			$(".scriptSpecific").show();
		}
		
		var selectedScript = $("#inputScript :selected").val();
		loadScript(selectedScript);
	});
	
	var inputScript = document.getElementById("inputScript");
	if( inputScript.selectedIndex != 0 ) {
		$(".scriptSpecific").show();
	}
	
	var input = document.getElementById("inputfile");
	var iter = document.getElementById("iterations");
	$("#btnLoad").click(function(){
        	$(input).val("home/X/input.txt");
		$(iterations).val("1000");
	});
	
	var getTheDate = function() {
		var today = new Date();
		var theDate = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()+" on 2013/"+(today.getMonth()+1)+"/"+today.getDate();
		return theDate;
	}
});


