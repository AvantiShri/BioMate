
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

var currentUser = Parse.User.current();
if (!currentUser) {
	window.location = "biomate_login.html";
}

$(function() {
	
	var userSpan = document.getElementById("userName");
	userSpan.innerHTML = currentUser.get("name");
	$("#btnSignOut").click(function(e){
		Parse.User.logOut();
		window.location = "biomate_login.html";
	});
	
	//**************************************************
	//General utility functions and variable declaration
	//**************************************************
	var scriptName = "";
	var tooltipShow = 0; //a hack to handle unwanted upwards event propagation.
	var currentOpenWarningTooltipObject = undefined; //keeps track of the warning tooltip that is open.
	var staticTextInstanceLookup = {}; //dictionary for looking up the static text parse objects using the object id.
	var parametersInstanceLookup = {};
	
	var openWarningTooltip = function(objectToOpenTooltipFor) {
		tooltipShow = 1;
		objectToOpenTooltipFor.tooltip("show");
		if (currentOpenWarningTooltipObject != undefined) {
			if (currentOpenWarningTooltipObject.attr("id") !=  objectToOpenTooltipFor.attr("id")) {
				console.log("hiding tooltip for "+currentOpenWarningTooltipObject.attr("id"));
				currentOpenWarningTooltipObject.tooltip("hide");
			}
		}
		currentOpenWarningTooltipObject = objectToOpenTooltipFor;
	}
	
	
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
	
	
	//**********************************************************************************
	//functions pertaining to the selection and loading of a script (the landing screen)
	//**********************************************************************************
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
	
	$("#enterTitle").autocomplete({minLength: 0,
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
		staticTextInstanceLookup[theId] = staticTextInstance;
		$("#chunksContainer").append(
		"<a href='#' class='chunk btn' id='"+theId+"' rel='popover' data-content=\"<a class='btn popoverButton popoverEditButton staticTextChunk' targetid='"+theId+"'>Edit</a> <div class='btn popoverButton popoverDeleteButton staticTextChunk' targetid='"+theId+"'>Delete</div>\">"+text+"</a>");
		$( ".chunk" ).disableSelection();
		$(".chunk").popover({delay: { show: 500, hide: 0}, html: true});
		$("#staticTextInput").val("");
	}
	
	var checkAddOrEditStaticText = function() {
		if ($("#staticTextInput").val() == "") {
			openWarningTooltip($("#staticTextInput"));
		} else {
			if ($("#staticTextWindow").attr("addOrEdit") == "add") {
				$("#staticTextWindow").modal("hide");
				StaticText.createStaticText($("#staticTextInput").val(), addStaticText);
			} else if ($("#staticTextWindow").attr("addOrEdit") == "edit") {
				var targetid = $("#popupAddStaticTextBtn").attr("targetid");
				var parseInstance = staticTextInstanceLookup[targetid];
				console.log(targetid);
				var chunk = $("#"+targetid);
				parseInstance.editStaticText({text: $("#staticTextInput").val()});
				chunk.html($("#staticTextInput").val());
				$("#staticTextWindow").modal("hide");
				$(".chunk").popover("hide");
			}
		}
	}
	
	//tooltips pertaining to add static text...
	$("#staticTextInput").tooltip({trigger: 'manual'});
	$("#addStaticText").tooltip();
	$("#addStaticText").hover(function(e) {$("#addStaticText").tooltip();});
	
	//event listeners pertaining adding static text...
	
	//the button on the main screen (not a popup)
	$("#addStaticText").click(function(e) {
		$("#addStaticText").tooltip("hide");
		$("#staticTextWindowHeader").html("Enter segment of static text");
		$("#popupAddStaticTextBtn").html("Add Static Text");
		$("#staticTextWindow").attr("addOrEdit","add");
		$("#staticTextWindow").modal("show");
	});
	
	//focus on the input when staticTextWindow is shown.
	$("#staticTextWindow").on('shown', function() {
		if (tooltipShow == 0) { //the manual showing of a tooltip propagates  show event upwards. This is so that the show resulting from displaying a tooltip is not interpeted as a show of the modal window itself.
			$("#staticTextInput").focus();
		}
		tooltipShow = 0;
	});
	
	//in the add static text popup...
	$("#popupAddStaticTextBtn").click(function (e) {
		checkAddOrEditStaticText();
	});
	
	$("#staticTextInput").keypress(function(e) {
		if (e.which == 13) {
			checkAddOrEditStaticText();
		}
	});
	
	
	//*****************************
	//Add/Edit Parameters and Flags
	//*****************************
	
	var addParameterToTable = function (parameterParseObject) {
		
	
	}
	
	//extracts the data in the popup, calls function to create the new chunk, adds a row to the table.
	var addParameterFromPopup = function() {
		
		
		var inputAlias = $("#inputAlias").val()
		var prefixFlagVal = $("#prefixFlagInput").val();
		var selectedTyp = $("#typeInput :selected").val();
		var isRequired = ($("#requiredInput").prop("checked") == 1)? true : false;
		var defaultVal = $("#defaultValInput").val();
		var warnings = $("#warningsInput").val();
		var tooltip = $("#tooltipInput").val();
		
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
			openWarningTooltip($("#inputAlias"));
			$("#inputAlias").focus();
		} else if ($("#ufNameInput").val() == "") {
			openWarningTooltip($("#ufNameInput"));
			$("#ufNameInput").focus();
		} else if ($("#typeInput :selected").val()=="Select...") {
			openWarningTooltip($("#typeInput"));
			$("#typeInput").focus();
		} else if ($("#typeInput :selected").val()=="Flag" && $("#prefixFlagInput").val() == "") {
			openWarningTooltip($("#prefixFlagInput"));
			$("#prefixFlagInput").focus();
		} else {
			$("#addParamWindow").modal("hide");
			if (currentOpenWarningTooltipObject != undefined) {
				currentOpenWarningTooltipObject.tooltip("hide");
			}
			currentOpenWarningTooltipObject = undefined;
			addParameterFromPopup();
		}
	}
	
	//tooltips for add/edit parameter
	$("#inputAlias").tooltip({trigger: 'manual', placement: 'bottom'});
	$("#prefixFlagInput").tooltip({trigger: 'manual'});
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
		if (tooltipShow == 0) { //the manual showing of a tooltip propagates  show event upwards. This is so that the show resulting from displaying a tooltip is not interpeted as a show of the modal window itself.
			$("#inputAlias").focus();
		}
		tooltipShow = 0;
	});
	
	//deactivate the 'required' box if the type is set to flag.
	$("#typeInput").change( function(e) {
		if ($("#typeInput :selected").val() == "Flag") {
			$("#requiredLabel").css("color","black");
			$("#requiredInput").prop("checked", 0);
			$("#requiredInput").attr("disabled", true);
			$("#defaultValLabel").html("On by default?");
			$("#defaultValInputContainer").html("<input id='defaultValInput' type='checkbox'></input>");
		} else {
			$("#requiredLabel").css("color","");
			if ($("#requiredInput").attr("disabled") != undefined) {
				$("#requiredInput").removeAttr("disabled");
			}
			if ($("#requiredInput").prop("checked") == 1) {
				$("#defaultValLabel").html("Suggested Value");
				$("#defaultValInputContainer").html("<input id='defaultValInput' class='input-block-level aFormInput exitAddParamOnEnter' type='text''></input>");
				$("#defaultValInput").attr("placeholder", "Eg: '/put/path/to/input/here'");
			} else {
				$("#defaultValLabel").html("Default Value");
				$("#defaultValInputContainer").html("<input id='defaultValInput' class='input-block-level aFormInput exitAddParamOnEnter' type='text'></input>");
				$("#defaultValInput").attr("placeholder", "Eg: '100'");
			}
		}
	});
	$("#requiredInput").change( function (e) {
		if ($("#typeInput :selected").val() != "Flag") { //this change event may have been fired as a result of changing the parameter type to flag, so don't respond to that...
			if ($("#requiredInput").prop("checked") == 1) {
				$("#defaultValLabel").html("Suggested Value");
				$("#defaultValInput").attr("placeholder", "Eg: '/put/path/to/input/here'");
			} else {
				$("#defaultValLabel").html("Default Value");
				$("#defaultValInput").attr("placeholder", "Eg: '100'");
			}
		}
	});
	
	//functions to make pressing enter move to the next input field, as necessary.
	$("#inputAlias").keypress(function(e) {
		if (e.which == 13) {
			$("#popupAddParameterBtn").click();
		}
	});
	
	$("#prefixFlagInput").keypress(function(e) {
		if (e.which == 13) {
			$("#popupAddParameterBtn").click();
		}
	});
	
	$("#ufNameInput").keypress(function(e) {
		if (e.which == 13) {
			$("#popupAddParameterBtn").click();
		}
	});
	
	$(".exitAddParamOnEnter").keypress(function (e) {
		if (e.which == 13) {
			$("#popupAddParameterBtn").click();
		}
	});
	
	//clicking add parameter on the modal popup
	$("#popupAddParameterBtn").click(function (e) {
		checkAddParameter();
	});
	
	//*************************************
	//Pertaining to the chunks container...
	//*************************************
	
	$("#paramsTable").sortable();
	$( "#chunksContainer" ).sortable({
		start: function(event, ui) {
		ui.item.bind("click.prevent",
			function(event) { event.preventDefault(); }); //prevents the popup from appearing on a drag...?
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
			if (currentOpenWarningTooltipObject != undefined) {
				currentOpenWarningTooltipObject.tooltip("hide");
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
				if (theButton.hasClass("staticTextChunk")) {
					$('#staticTextInput').val($("#"+targetid).html());
					$('#popupAddStaticTextBtn').attr("targetid",targetid);
					$('#staticTextWindowHeader').html("Edit segment of static text");
					$('#popupAddStaticTextBtn').html("Edit Static Text");
					$("#staticTextWindow").attr("addOrEdit","edit");
					$('#staticTextWindow').modal('show');
				}
			//delete
			} else if (theButton.hasClass("popoverDeleteButton")) {
				var targetId = theButton.attr("targetid");
				var parseObject = staticTextInstanceLookup[targetId];
				parseObject.deleteStaticText();
				$('#'+targetId).popover('hide')
				$('#'+targetId).remove();
			}
		}
	});
	
});

