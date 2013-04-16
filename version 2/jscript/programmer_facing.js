
$(function() {
	var availableScripts = [
			"Script1",
			"Script2",
			"Script4",
			"Script3",
			"Script5",
			"Script6",
			"Script7",
			"Script8",
			"Script9",
			"Script10"
		];

	var scriptName = "";
	
	var parameterNumber = 0;
	
	var getTheDate = function() {
		var today = new Date();
		var theDate = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()+" on 2013/"+today.getMonth()+"/"+today.getDate();
		return theDate;
	}


	var addStaticText = function(contents) {
		$("#chunksContainer").append(
		"<a href='#' class='chunk btn staticTextBtn' rel='popover' data-content=\"<span class='btn popoverButton'>Edit</span> <div class='btn'>Delete</div>\">"+contents+"</a>");
		$( ".chunk" ).disableSelection();
		$(".chunk").popover({delay: { show: 500, hide: 0}, html: true});
	}
	var addParameter = function(prefix,alias) {
		$("#chunksContainer").append(
		"<a href='#' class='chunk btn paramBtn' rel='popover' data-content=\"<span class='btn popoverButton'>Edit</span> <div class='btn'>Delete</div>\">"+prefix+" "+alias+"</a>");
		$( ".chunk" ).disableSelection();
		$(".chunk").popover({delay: { show: 500, hide: 0}, html: true});
	}

	var loadScript = function(e) {
		$("#scriptSelection").remove();
		$("#pageHeaderContents").html("<input id='theScriptName' class='input-block-level' type='text' value='"+scriptName+"'</input>");
		
		$("#mainContainer").append(
	"<div id='programmer-layout'>"+
		"<div class='row'>"+
			"<div class='span4'>"+
				"<div class='modal hide fade' id='staticTextWindow'>"+
					"<div class='modal-header'>"+
						"<a class='close' data-dismiss='modal'>×</a>"+
						"<h3>Enter segment of static text</h3>"+
					"</div>"+
					"<div class='modal-body'>"+
						"<input id='staticTextName' class='input-block-level' type='text' placeholder='Eg:   \"head\"   \"| less\"   \"python x.py\"   etc.'></input>"+
					"</div>"+
					"<div class='modal-footer'>"+
						"<a href='#' class='btn' data-dismiss='modal'>Cancel</a>"+
						"<a href='#' class='btn btn-primary staticTextBtn' id='popupAddStaticTextBtn' data-dismiss='modal'>Add Static Text</a>"+
					"</div>"+
				"</div>"+
				"<a class='btn btn-block btn-success staticTextBtn mainAddStaticTextBtn popupLabel' data-toggle='modal' href='#staticTextWindow' id='addStaticText'>Add Static Text</a>"+
			"</div>"+
			"<div class='span4'>"+
				"<div class='modal hide fade' id='addParamWindow'>"+
					"<div class='modal-header'>"+
						"<a class='close' data-dismiss='modal'>×</a>"+
						"<h3>Add Parameter/Flag</h3>"+
					"</div>"+
					"<div class='modal-body'>"+
						"<div class='row'>"+
							"<div class='span2'>"+
								"<label id='aliasLabel' class='popupLabel' data-toggle='tooltip' title='Programmer-defined name for referring to the parameter/flag' for='inputAlias'>Alias</label>"+
							"</div>"+
							"<div class='span3'>"+
								"<input id='inputAlias' class='input-block-level aFormInput' type='text' placeholder='Eg: num_of_iterations'></input>"+
							"</div>"+
							"<div class='span2'>"+
								"<label id='prefixFlagLabel' class='popupLabel' data-toggle='tooltip' title='The prefix/flag (if any) that comes before the parameter; can be blank' for='prefixFlagInput'>Prefix/Flag</label>"+
							"</div>"+
							"<div class='span3'>"+
								"<input id='prefixFlagInput' class='input-block-level aFormInput' type='text' placeholder='Eg: -v or --verbosity'></input>"+
							"</div>"+
							"<div class='span2'>"+
								"<label id='ufNameLabel' class='popupLabel' data-toggle='tooltip' title='A user friendly name visible to the users; this is how the input field will be labelled' for='ufNameInput'>User-Friendly Name</label>"+
							"</div>"+
							"<div class='span3'>"+
								"<input id='ufNameInput' class='input-block-level aFormInput' type='text' placeholder='Eg: \"Detailed Output?\"'></input>"+
							"</div>"+
							"<div class='span2'>"+
								"<label id='typeLabel' class='popupLabel' data-toggle='tooltip' title='Category of the input' for='typeInput'>Input Type</label>"+
							"</div>"+
							"<div class='span3'>"+
								"<select id='typeInput' class='input-block-level'>"+
									"<option>Select input type...</option>"+
									"<option value='Flag'>Flag</option>"+
									"<option value='String'>String</option>"+
									"<option value='Integer'>Integer</option>"+
									"<option value='Float'>Float</option>"+
								"</select>"+
							"</div>"+
							"<div class='span2'>"+
								"<label id='requiredLabel' class='popupLabel' data-toggle='tooltip' title='Check if the parameter is required' for='requiredInput'>Required?</label>"+
							"</div>"+
							"<div class='span3 aFormInput'>"+
								"<input id='requiredInput' type='checkbox'></input>"+
							"</div>"+
							"<div class='span2'>"+
								"<label id='warningsLabel' class='popupLabel' data-toggle='tooltip' title='Warnings displayed to the user up-front' for='warningsInput'>Warnings</label>"+
							"</div>"+
							"<div class='span3'>"+
								"<input id='warningsInput' class='input-block-level aFormInput' type='text' placeholder='Eg: \"File paths must be absolute\"'></input>"+
							"</div>"+
							"<div class='span2'>"+
								"<label id='tooltipLabel' class='popupLabel' data-toggle='tooltip' title='Information displayed to user as a tooltip in hover text' for='tooltipInput'>Tooltip</label>"+
							"</div>"+
							"<div class='span3'>"+
								"<input id='tooltipInput' class='input-block-level aFormInput' type='text' placeholder='Eg: \"Enter the path to the input file\"'></input>"+
							"</div>"+
						"</div>"+
					"</div>"+
					"<div class='modal-footer'>"+
						"<a href='#' class='btn' data-dismiss='modal'>Cancel</a>"+
						"<a href='#' class='btn btn-primary paramBtn' data-dismiss='modal' id='popupAddParameterBtn'>Add Parameter/Flag</a>"+
					"</div>"+
				"</div>"+
				"<a class='btn btn-block btn-primary paramBtn' data-toggle='modal' href='#addParamWindow'>Add Parameter/Flag</a>"+
			"</div>"+
			"<div class='span4'>"+
				"<button class='btn btn-block'>More Information</button>"+
			"</div>"+
		"</div>"+
		"<div class='container' id='chunksContainer'> </div>"+
		
		"<table class='table' id='paramsTable' style='display: none; table-layout: fixed'>"+
			"<thead>"+
			"<tr>"+
				"<th>Alias</th>"+
				"<th>Prefix/Flag</th>"+
				"<th>User-friendly name</th>"+
				"<th>Input Type</th>"+
				"<th>Required?</th>"+
				"<th>Warnings</th>"+
				"<th>Tooltip</th>"+
			"</tr>"+
			"</thead>"+
			"<tbody></tbody>"+
		"</table>"+
		"<div class='row scriptSpecific'>"+
		"<label for='required' class='span12 programmerLabel'>Caveats</label>"+
		"<div class='span12'>"+
			"<textarea class='input-xlarge input-block-level' id='Caveats' class='input-block-level' type='text' placeholder='Eg: Output of this command appears in terminal'></textarea>"+
		"</div>"+
		"<label for='required' class='span12 programmerLabel'>General instructions</label>"+
		"<div class='span12'>"+
			"<textarea class='input-xlarge input-block-level' id='generalInstructions' type='text' placeholder='Eg: If you have more questions, email xyz@gmail.com'></textarea>"+
		"</div>"+
		"<div class = 'span12'>"+
			"<label> Last saved at: <span id='lastSavedAt'>Never</span></label>"+
		"</div>"+

		"<div class='span3'>"+
			"<button class='btn btn-block'>Cancel</button>"+
		"</div>"+
		"<div class='span3'>"+
			"<button class='btn btn-block' id='saveAsBtn'>Save As</button>"+
		"</div>"+
		"<div class='span3'>"+
			"<button class='btn btn-block' id='saveBtn'>Save</button>"+
		"</div>"+
		"<div class='span3'>"+
			"<div class='modal hide fade' id='saveNshare'>"+
				"<div class='modal-header'>"+
					"<a class='close' data-dismiss='modal'>×</a>"+
					"<h3>Enter email addresses</h3>"+
				"</div>"+
				"<div class='modal-body'>"+
					"<textarea id='emails' class='input-xlarge input-block-level' type='text' placeholder='Eg: abc@mit.edu, xyz@gmail.com'></textarea>"+
				"</div>"+
				"<div class='modal-footer'>"+
					"<a href='#' class='btn' data-dismiss='modal'>Cancel</a>"+
					"<a href='#' class='btn btn-primary staticTextBtn' id='share' data-dismiss='modal'>Share</a>"+
				"</div>"+
			"</div>"+
			"<a class='btn btn-block btn-primary' data-toggle='modal' href='#saveNshare' id='saveNshareBtn'>Save & Share</a>"+
		"</div>"+
	"</div>"
		);
	
		$("#theScriptName").keypress(function (e) {
			if (e.which == 13) {
				$("#theScriptName").blur();
			}
		});
	
		$("#popupAddParameterBtn").click(function (e) {
			parameterNumber += 1;
			addParameter($("#prefixFlagInput").val(),$("#inputAlias").val());
			$("#paramsTable").css("display","block");
			var requiredCheckboxLine = "";
			if ($("#requiredInput").prop("checked") == 1) {
				requiredCheckboxLine = "<td> <input type='checkbox' class='tdInput' checked='true'></input></td>";
			} else {
				requiredCheckboxLine = "<td> <input type='checkbox' class='tdInput'></input></td>";
			}
			var selectedTyp = $("#typeInput :selected").val();
			console.log("selected: "+selectedTyp);
			$("#paramsTable").append("<tr>"+
						"<td> <input type='text' class='tdInput' value='"+$("#inputAlias").val()+"'></input></td>"+
						"<td> <input type='text' class='tdInput' value='"+$("#prefixFlagInput").val()+"'></input></td>"+
						"<td> <input type='text' class='tdInput' value='"+$("#ufNameInput").val()+"'></input></td>"+
						"<td>"+
							"<select  class='input-block-level' id=sel"+parameterNumber+">"+
								"<option>Select input type...</option>"+
								"<option value='Flag'>Flag</option>"+
								"<option value='String'>String</option>"+
								"<option value='Integer'>Integer</option>"+
								"<option value='Float'>Float</option>"+
							"</select>"+
						"</td>"+
						requiredCheckboxLine+
						"<td> <button class='btn tdBtn'>View/Edit</button></td>"+
						"<td> <button class='btn tdBtn'>View/Edit</button></td>"+
						"</tr>");
			console.log("#sel"+parameterNumber+" option[value='"+selectedTyp+"']");
			$("#sel"+parameterNumber+" option[value='"+selectedTyp+"']")[0].selected=true;
			console.log("hi");	
		});
		$("#popupAddStaticTextBtn").click(function (e) {addStaticText($("#staticTextName").val())});
		$("#staticTextName").keypress(function(e) {
			if (e.which == 13) {
				addStaticText($("#staticTextName").val());
				$("#staticTextWindow").modal("hide");
			}
		});
		
		$("#staticTextWindow").on('shown', function() {$("#staticTextName").focus();});
		$("#addParamWindow").on('shown', function() {$("#inputAlias").focus();});
	
		$( "#chunksContainer" ).sortable();
		$( ".chunk" ).disableSelection();
		$(".chunk").popover({delay: { show: 500, hide: 0}, html: true});
		
		$("#saveNshareBtn").click(function (e) {var today = new Date(); $("#lastSavedAt").html(getTheDate())});
		$("#saveBtn").click(function (e) {var today = new Date();  $("#lastSavedAt").html(getTheDate())});
	
		$('body').on('click', function (e) {
			$('.chunk').each(function () {
				//the 'is' for buttons that triggers popups
				//http://jsfiddle.net/mattdlockyer/ZZXEj/
				if (!$(this).is(e.target)) {
					$(this).popover('hide');
				}
			});
		});
	
	}

	var enableOrDisableCreateScript = function() {
		console.log("script name is: "+scriptName);
		if (scriptName.length == 0) {
			$("#createLoadScriptBtn").html("Create/Edit Script");
			if ($("#createLoadScriptBtn").attr("disabled") == undefined) {
				$("#createLoadScriptBtn").attr("disabled", "disabled");
			}
		} else {
			$("#createLoadScriptBtn").removeAttr("disabled");
			if ($.inArray(scriptName, availableScripts) == -1) {
				$("#createLoadScriptBtn").html("Create New Script");
			} else {
				$("#createLoadScriptBtn").html("Edit Script");
			}
		}
	}
	
	var autocompleteSelect = function(sn)  {
		console.log("blah: "+sn);
		scriptName = sn;
		enableOrDisableCreateScript()
	}

	$( "#enterTitle" ).autocomplete({minLength: 0,
		source: availableScripts,
		select: function(a,b) {
			autocompleteSelect(b.item.value);
		}
		
	});
	
	$("#enterTitle").keypress(function (e) {
		if (e.which == 13) {
			if (scriptName.length > 0) {
				loadScript();
			}
		}
	});
	


	$('#enterTitle').click(function(e){ $('#enterTitle').autocomplete("search","") });

	/* the create script button is initially inactive */
	$("#createLoadScriptBtn").attr("disabled", "disabled");
	$("#createLoadScriptBtn").click( function(e) {
		loadScript();
	})

	$("#enterTitle").keyup(function (e) {
		scriptName = $("#enterTitle").val();
		enableOrDisableCreateScript();
	});


});
