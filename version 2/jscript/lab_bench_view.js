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
});