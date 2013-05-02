
//function to send email, for save and share.
var sendEmail = function(scriptId){
	var ems = $("#emails").val();
	ems = ems.replace(/\s/g, '');
	//alert(ems);
	var emList = ems.split(',');
	//alert("shared with " + emList.length);
	console.log("clicked share");
	
	for(var i=0;i<emList.length;i++){
		var dataString = "\'{\"scriptId\":\""+scriptId+"\",\"toAddress\":\""+emList[i]+"\"}'";
		var jsonObj = eval(dataString);
		//alert(dataString);
		$.ajax({
			type: "POST",
			url: "https://api.parse.com/1/functions/sendMail",
			data: jsonObj,
			dataType: "json",
			headers: {"X-Parse-Application-Id": "C9TPknemAEmJzz1xcKFbBC855l64A4T4R2EFjxBH", "X-Parse-REST-API-Key": "PyzUr85ywV4vISJ5M74qUy2f9Dv4heBsaOZTgflo","Content-Type": "application/json"}
		}).done(function() {
			console.log("Email Sent!");
		});
	}
}

var tooltipShow = 0; //a hack to handle unwanted upwards event propagation.
openWarningTooltip = undefined; //keeps track of the warning tooltip that is open.

$(function() {
	
	//**************************************************
	//General utility functions and variable declaration
	//**************************************************
	var scriptName = "";
	
	var getTheDate = function() {
		var today = new Date();
		var theDate = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()+" on 2013/"+(today.getMonth()+1)+"/"+today.getDate();
		return theDate;
	}
	
	//***********************
	//canned data declaration
	//***********************
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
	
	
	//*************************************************************
	//functions pertaining to the selection and loading of a script (the landing screen)
	//*************************************************************
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
	
	var loadScript = function(e) {
		$("#scriptSelection").remove();
		$("#programmer-layout").show();
		$("#pageHeaderContents").html("<input id='theScriptName' class='input-block-level' type='text' value='"+scriptName+"'</input>");
	}
	
	$("#enterTitle").keyup(function (e) {
		scriptName = $("#enterTitle").val();
		enableOrDisableCreateScript();
	});
	
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

	//the create script button is initially inactive
	$("#createLoadScriptBtn").attr("disabled", "disabled");
	console.log("hello");
	$("#createLoadScriptBtn").click( function(e) {
		loadScript();
	})
	
	//*********************************************************************************
	//Functions pertaining to changing the script name using the entry field at the top
	//*********************************************************************************
	
	$("#theScriptName").keypress(function (e) {
		if (e.which == 13) {
			$("#theScriptName").blur();
		}
	});
	
	//********************
	//Add/Edit static text
	//********************
	
	var addStaticText = function(staticTextInstance) {
		var text = staticTextInstance.get("text");
		var theId = staticTextInstance.id;
		$("#chunksContainer").append(
		"<a href='#' class='chunk btn' id='"+theId+"' rel='popover' data-content=\"<a class='btn popoverButton popoverEditButton staticTextBtn' targetid='"+theId+"'>Edit</a> <div class='btn popoverButton popoverDeleteButton staticTextBtn' targetid='"+theId+"'>Delete</div>\">"+text+"</a>");
		$( ".chunk" ).disableSelection();
		$(".chunk").popover({delay: { show: 500, hide: 0}, html: true});
		$("#staticTextInput").val("")
	}
	
	var checkAddStaticText = function() {
		if ($("#staticTextInput").val() == "") {
			$("#staticTextInput").focus();
			$("#staticTextInput").tooltip("show");
		} else {
			$("#staticTextWindow").modal("hide");
			StaticText.createStaticText($("#staticTextInput").val(), addStaticText);
		}
	}
	
	var checkEditStaticText = function() {
		if ($("#editStaticTextInput").val() == "") {
			$("#editStaticTextInput").focus();
			$("#editStaticTextInput").tooltip("show");
		} else {
			var targetid = $("#editStaticTextBtn").attr("targetid");
			console.log(targetid);
			var chunk = $("#"+targetid);
			chunk.html($("#editStaticTextInput").val());
			$("#editStaticTextWindow").modal("hide");
			$(".chunk").popover("hide");
		}
	}
	
	//tooltips pertaining to add static text...
	$("#staticTextInput").tooltip({trigger: 'manual'});
	$("#editStaticTextInput").tooltip({trigger: 'manual'});
	$("#addStaticText").tooltip();
	$("#addStaticText").hover(function(e) {$("#addStaticText").tooltip();});
	
	
	//event listeners pertaining adding static text...
	
	//the button on the main screen (not a popup)
	$("#addStaticText").click(function(e) {
		$("#addStaticText").tooltip("hide");
		$("#staticTextWindow").modal("show");
	});
	
	//focus on the input when staticTextWindow is shown.
	$("#staticTextWindow").on('shown', function() {$("#staticTextInput").focus();});
	$("#editStaticTextWindow").on('shown', function() {$("#editStaticTextInput").focus();});
	
	//in the add static text popup...
	$("#popupAddStaticTextBtn").click(function (e) {
		checkAddStaticText();
	});
	
	$("#staticTextInput").keypress(function(e) {
		if (e.which == 13) {
			checkAddStaticText();
		}
	});
	
	//in the edit static text popup...
	$('#editStaticTextBtn').click(function(e) {
		checkEditStaticText();
	});
	
	$('#editStaticTextInput').keypress(function(e) {
		if (e.which == 13) {
			checkEditStaticText();
		}
	});
	
	
	//*****************************
	//Add/Edit Parameters and Flags
	//*****************************
	
	var parameterNumber = 0;
	
	//extracts the data in the popup, calls function to create the new chunk, adds a row to the table.
	var addParameterFromPopup = function() {
		parameterNumber += 1;
		var selectedTyp = $("#typeInput :selected").val();
		console.log(selectedTyp);
		if (selectedTyp != "Flag") {
			addParameter($("#prefixFlagInput").val(),$("#inputAlias").val());
		} else {
			addFlag($("#prefixFlagInput").val());
		}
		$("#paramsTable").show();
		var requiredCheckboxLine = "";
		if ($("#requiredInput").prop("checked") == 1) {
			requiredCheckboxLine = "<td> <center> <input type='checkbox' checked='true'> </center> </input></td>";
		} else {
			requiredCheckboxLine = "<td> <center> <input type='checkbox'> </center> </input></td>";
		}
		
		console.log("selected: "+selectedTyp);
		//adding a row to the table.
		$("#paramsTable").append("<tr>"+
					"<td> <input class='tableDataInput' type='text' value='"+$("#inputAlias").val()+"'></input></td>"+
					"<td> <input class='tableDataInput' type='text' value='"+$("#prefixFlagInput").val()+"'></input></td>"+
					"<td> <input type='text' class='tableDataInput' value='"+$("#ufNameInput").val()+"'></input></td>"+
					"<td>"+
						"<select  class='input-block-level tableDataSelect' id=sel"+parameterNumber+">"+
							"<option>Select...</option>"+
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
	}
	
	//adds a parameter chunk to the chunksContainer
	var addParameter = function(prefix,alias) {
		$("#chunksContainer").append(
		"<a href='#' class='chunk btn btn-primary' rel='popover' data-content=\"<span class='btn popoverButton'>Edit</span> <div class='btn'>Delete</div>\">"+prefix+" "+alias+"</a>");
		$( ".chunk" ).disableSelection();
		$(".chunk").popover({delay: { show: 500, hide: 0}, html: true});
	}
	//adds a flag chunk to the chunks container
	var addFlag = function(prefix) {
		$("#chunksContainer").append(
		"<a href='#' class='chunk btn paramBtn' rel='popover' data-content=\"<span class='btn popoverButton'>Edit</span> <div class='btn'>Delete</div>\">"+prefix+"</a>");
		$( ".chunk" ).disableSelection();
		$(".chunk").popover({delay: { show: 500, hide: 0}, html: true});
	}
	
	//does error checking to make sure the values input into the popup are acceptable.
	var checkAddParameter = function() {
		if ($("#inputAlias").val() == "") {
			tooltipShow = 1;
			$("#inputAlias").tooltip("show");
			if (openWarningTooltip != undefined) {
				if (openWarningTooltip.attr("id") !=  "inputAlias") {
					console.log("hidingTooltip");
					openWarningTooltip.tooltip("hide");
				}
			}
			openWarningTooltip = $("#inputAlias");
			$("#inputAlias").focus();
			console.log("showing tooltip");
		} else if ($("#ufNameInput").val() == "") {
			if (openWarningTooltip != undefined) {
				console.log(openWarningTooltip.attr("id"));
				if (openWarningTooltip.attr("id") !=  "ufNameInput") {
					console.log("hidingTooltip");
					openWarningTooltip.tooltip("hide");
				}
			}
			openWarningTooltip = $("#ufNameInput");
			tooltipShow = 1;
			$("#ufNameInput").tooltip("show");
			$("#ufNameInput").focus();
			console.log("focused on ufname");
		} else if ($("#typeInput :selected").val()=="Select...") {
			tooltipShow = 1;
			$("#typeInput").tooltip("show");
			if (openWarningTooltip != undefined) {
				if (openWarningTooltip.attr("id") != "typeInput") {
					console.log("hidingTooltip");
					openWarningTooltip.tooltip("hide");
				}
			}
			openWarningTooltip = $("#typeInput");
			$("#typeInput").focus();
		} else {
			$("#addParamWindow").modal("hide");
			if (openWarningTooltip != undefined) {
				openWarningTooltip.tooltip("hide");
			}
			openWarningTooltip = undefined;
			addParameterFromPopup();
		}
	}
	
	//tooltips for add/edit parameter
	$("#inputAlias").tooltip({trigger: 'manual', placement: 'bottom'});
	$("#ufNameInput").tooltip({trigger: 'manual'});
	$("#typeInput").tooltip({trigger: 'manual'});
	$("#aliasLabel").tooltip({placement: 'bottom'});
	$("#addParamMainBtn").tooltip();
	$("#addParamMainBtn").hover(function(e) {$("#addParamMainBtn").tooltip();});
	
	
	//event listeners
	
	//on the main screen, the button that brings up the add paramaters modal.
	$("#addParamMainBtn").click(function(e) {
		$("#addParamMainBtn").tooltip("hide");
		$("#addParamWindow").modal("show");
	});
	
	//focus on the inputAlias field when the modal is first shown.
	$("#addParamWindow").on('shown', function() {
		if (tooltipShow == 0) {
			console.log("event fired"); 
			$("#inputAlias").focus();
		}
		tooltipShow = 0;
	});
	
	//functions to make pressing enter move to the next input field, as necessary.
	$("#inputAlias").keypress(function(e) {
		if (e.which == 13) {
			$("#prefixFlagInput").focus();
		}
	});
	
	$("#prefixFlagInput").keypress(function(e) {
		if (e.which == 13) {
			$("#ufNameInput").focus();
		}
	});
	
	$("#ufNameInput").keypress(function(e) {
		if (e.which == 13) {
			$("#typeInput").focus();
		}
	});
	
	$(".exitAddParamOnEnter").keypress(function (e) {
		if (e.which == 13) {
			$("#popupAddParameterBtn").click();
			$("#addParamWindow").modal("hide");
		}
	});
	
	//clicking add parameter on the modal popup
	$("#popupAddParameterBtn").click(function (e) {
		checkAddParameter();
	});
	
	//*************************************
	//Pertaining to the chunks container...
	//*************************************
	
	$( "#chunksContainer" ).sortable({
		start: function(event, ui) {
		ui.item.bind("click.prevent",
			function(event) { event.preventDefault(); });
		},
		stop: function(event, ui) {
			setTimeout(function(){ui.item.unbind("click.prevent");}, 300);
		}
	});
	$( ".chunk" ).disableSelection();
	$(".chunk").popover({delay: { show: 500, hide: 0}, html: true});

	
	//**************************************************
	//Listeners for buttons and the bottom of the screen
	//**************************************************
	
	//clicking save on the main screen
	$("#saveBtn").click(function (e) {var today = new Date();  $("#lastSavedAt").html(getTheDate())});
	
	//clicking save as on the main screen
	$("#saveAsBtnPopup").click(function(e) {
		$("#theScriptName").val($("#saveAsName").val());
		$("#lastSavedAt").html(getTheDate());
	});
	
	//clicking save and share
	$("#saveNshareBtn").click(function (e) {var today = new Date(); $("#lastSavedAt").html(getTheDate())});
	
	//clicking share on the modal popup
	$("#share").click(function (e) {
		/////
		sendEmail(scriptId);
	});
	
	//*****************************************************************************
	//General click even handling (for manually closing popovers or tooltips, etc.)
	//*****************************************************************************
	
	$('body').on('click', function (e) {
		
		//warning tooltip closing...
		if (e.target.id != "popupAddParameterBtn"
		&& e.target.id != "popupAddStaticTextBtn"
		&& e.target.id != "editStaticTextBtn") {
			console.log(e.target.id);
			if (openWarningTooltip != undefined) {
				openWarningTooltip.tooltip("hide");
			}
		}
		
		//popover closing...
		if (!$(e.target).hasClass("popoverButton")) {
			$('.chunk').each(function () {
				//the 'is' for buttons that triggers popups
				//http://jsfiddle.net/mattdlockyer/ZZXEj/
				if (!$(this).is(e.target)) {
					$(this).popover('hide');
				}
			}); 
		//popover click processing (for edit/delete static text or parameters)
		} else {
			console.log("popover click");
			var theButton = $(e.target);
			//edit
			if (theButton.hasClass("popoverEditButton")) {
				var targetid = theButton.attr("targetid");
				console.log(theButton.attr("targetid"));
				//if static text...
				if (theButton.hasClass("staticTextBtn")) {
					$('#editStaticTextInput').val($("#"+targetid).html());
					$('#editStaticTextBtn').attr("targetid",targetid);
					$('#editStaticTextWindow').modal('show');
				}
			//delete
			} else if (theButton.hasClass("popoverDeleteButton")) {
				var targetId = theButton.attr("targetid");
				$('#'+targetId).popover('hide')
				$('#'+targetId).remove();
			}
		}
	});
	
});

