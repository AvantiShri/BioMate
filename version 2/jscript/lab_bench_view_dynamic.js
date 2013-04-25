var setScriptToSelect = function(scriptName) {
	$("#inputScript").append("<option id='inputScriptItem_'"+scriptName+">"+scriptName+"</option>");
}

var initializeLoadScript = function(scriptName) {
	$(".scriptName").html(scriptName);
	$("#loadParamsTableBody").html("");
	$("#required").html("");
	$("#optional").html("");
}

var setNoteContents = function(noteContents) {
	$("#noteContents").html(noteContents);
}

var setInstructionsContents = function(instructionsContents) {
	var lines = instructionsContents.split("\n");
	$("#instructionsContents").html("");
	$.each(lines, function(i) {
		$("#instructionsContents").append("<p>"+lines[i]+"</p>");
	});
}

var addRowToLoadParamsTable = function (savedParametersName) {
	$("#loadParamsTableBody").append("<tr> <td> <a href='#' data-dismiss='modal'>"+savedParametersName+"</a></td></tr>");
} 

var setCaveats = function(caveats) {
	$("#caveats").html(caveats);
}

var addInputParameter = function(alias, userFriendlyName, defaultVal, tooltip, warning, isRequired) {
	var toAppendTo;
	if (isRequired) {
		toAppendTo = $("#required");
	} else {
		toAppendTo = $("#optional");
	}
	var inputId = "inputParam_"+alias;
	var warningText = "";
	if (warning != "") {
		warningText = "<span class='span10 offset3 text-warning'>"+warning+"</span>";
	}
	
	toAppendTo.append(
		"<div class='row'>"+
			"<div class='span3 truncate'>"+
				"<label for='"+inputId+"'>"+
					"<a href='#' data-toggle='tooltip' title='"+tooltip+"' class='btn btn-link info'>"+
						"<i class='icon-question-sign'></i>"+
					"</a>"+
					userFriendlyName+
				"</label>"+
			"</div>"+
			"<div class='span9'>"+
				"<input id='"+inputId+"' class='input-block-level' type='text''></input>"+
			"</div>"+
			warningText+
		"</div>"
	);
	
	//if is required, do placeholder
	if (isRequired) {
		$("#"+inputId).attr("placeholder", defaultVal);
	} else {
		$("#"+inputId).val(defaultVal);
		$("#"+inputId).click(function() {
			this.select();
		});
	}
}

var addFlag = function(alias, userFriendlyName, defaultVal, tooltip, warning) {
	var inputId = "inputParam_"+alias;
	var warningText = "";
	if (warning != "") {
		warningText = "<span class='span10 offset3 text-warning'>"+warning+"</span>";
	}
	$("#optional").append(
		"<div class='row'>"+
			"<div class='span3 truncate'>"+
				"<label for='"+inputId+"'>"+
					"<a href='#' data-toggle='tooltip' title='"+tooltip+"' class='btn btn-link info'>"+
						"<i class='icon-question-sign'></i>"+
					"</a>"+
					userFriendlyName+
				"</label>"+
			"</div>"+
			"<div class='span9'>"+
				"<input id='"+inputId+"' type='checkbox'></input>"+
			"</div>"+
			warningText+
		"</div>"
	);

	if (defaultVal == true) {
		$("#"+inputId).attr("checked",true);
	}
}

var setScriptSelections = function() {
	setScriptToSelect("Monte Carlo");
	setScriptToSelect("Tophat-Cufflinks");
}

setScriptSelections();
