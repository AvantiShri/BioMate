// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(function() { 
	$("#loadParamsTable tr").click( function () {
		$(this).addClass('highlight').siblings().removeClass('highlight');
	});
	
	$('.info').tooltip();
	$('#selectScriptLbl').tooltip();
	
	$("#inputScript").change( function () {
		if( this.selectedIndex != 0 ) {
			$(".scriptSpecific").show();
		}
	});
	
	var inputScript = document.getElementById("inputScript");
	console.log(inputScript);
	if( inputScript.selectedIndex != 0 ) {
		$(".scriptSpecific").show();
	}
	
	var input = document.getElementById("inputfile");
	var iter = document.getElementById("iterations");
	$("#btnLoad").click(function(){
        	$(input).val("home/X/input.txt");
		$(iterations).val("1000");
	});
});
