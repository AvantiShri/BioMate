Parse.initialize("C9TPknemAEmJzz1xcKFbBC855l64A4T4R2EFjxBH", "iJGffHXEvURl0BDlT0PeeL7ex2s0qT7uJA6BJvEV");

var currentUser = Parse.User.current();
if (!currentUser) {
	window.location = "biomate_login.html";
}

// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
else {
$(function() { 
    var userSpan = document.getElementById("userName");
    userSpan.innerHTML = currentUser.get("name");
    
    $("#btnSignOut").click(function(e){
	Parse.User.logOut();
	window.location = "biomate_login.html";
    });
    // list the user's scripts in the dropdown
    setScriptSelections();
    
    $("#loadParamsTable tr").click( function () {
		$(this).addClass('highlight').siblings().removeClass('highlight');
		$("#btnLoad").removeClass("disabled");
	});
	
    $("#saveParameters").click( function () {
        $("#paramsName").val("");
    });
    
	$("#saveParamsBtn").click( function () {
        if(chunks && currentScript) {
            var params = getInputParameters();
            var savedParams = [];
            var len = chunks.length;
            for(var i = 0; i < len; ++i) {
                chunk = chunks[i];
                if(chunk.get("commandChunkType") === CommandChunkType.PARAMETER) {
                    var parameter = chunk.get("parameter");
                    var id = parameter.id;
                    var val = params[id];
                    if(parameter.get("inputType") === InputType.BOOLEAN) {
                        if(val) {
                            val = "on";
                        }
                        else {
                            val = "off";
                        }
                    }
                    savedParams.push(SavedParameter.createSavedParameter(parameter, val, false));
                }
            }
            SavedScriptParams.createSavedScriptParams(
                currentUser, currentScript, savedParams, $("#paramsName").val(), 
                function (savedScriptParams) {
                    $("#savedMsg").html("Saved Parameters at " + dateToString(new Date()));
                    $("#savedMsg").show();
                });            
        }		
	});
    
    $("#generateBtn").click( function () {
        if(chunks) {
            var params = getInputParameters();
            var commandStrings = [];
            var len = chunks.length;
            for(var i = 0; i < len; ++i) {
                chunk = chunks[i];
                if(chunk.get("commandChunkType") === CommandChunkType.PARAMETER) {
                    var chunkData = chunk.get("parameter");
                    var id = chunkData.id;
                    var val = params[id];
                    var prefix = chunkData.get("prefixFlag");
                    if(chunkData.get("inputType") === InputType.BOOLEAN) {
                        if(val) {
                            commandStrings.push(prefix);
                        }
                    }
                    else {
                        if(val) {
                            commandStrings.push(prefix + " " + val);
                        }
                    }
                }
                else {
                    var chunkData = chunk.get("staticText");
                    commandStrings.push(chunkData.get("text"));
                }
            }
            setGeneratedCommand(commandStrings.join(" "));
        }
    });
    
    // load the list of saved parameters
    $("#loadParamsBtn").on('click', function(){ 
        $("#loadParamsTableBody").empty();
        SavedScriptParams.getSavedScriptParamsByUserScript(
            currentUser, currentScript, loadSavedScriptParams);
	});
    
    // load a specific set of parameters
	$(document).on("click", "#loadParamsTableBody tr", function () {
        var paramsId = $(this).attr("paramsId");
        SavedScriptParams.getSavedScriptParamsById(paramsId, loadSavedParams);
	});
    
    $("#saveNoteBtn").click(function () {
        if(currentNote) {
            currentNote.editNote({ text: getNoteContents(), callback: function (note) {}});
        }
        else {
            Note.createNote(currentUser, currentScript, getNoteContents(), function (note) {});
        }
    });
	
	$('.info').tooltip();
	$('#selectScriptLbl').tooltip();
	
	$("#inputScript").change( function () {
		if( this.selectedIndex !== 0 ) {
			$(".scriptSpecific").show();
            var selectedScriptId = $("#inputScript :selected").attr("value");
            Script.getScriptById(selectedScriptId, loadScript);
		}
        else {
            $(".scriptSpecific").hide();
        }
        
	});
	
	var inputScript = document.getElementById("inputScript");
	if( inputScript.selectedIndex !== 0 ) {
		$(".scriptSpecific").show();
	}
	
	var input = document.getElementById("inputfile");
	var iter = document.getElementById("iterations");
	$("#btnLoad").click(function(){
        $(input).val("home/X/input.txt");
		$(iterations).val("1000");
	});
	
	
});
}

// store the script and script chunks after loading the script so they can be used to
// generate the command and save parameters
var chunks = null;
var currentScript = null;

// store the current note so it can be loaded and edited
var currentNote = null;

// load user's scripts in drop-down
function setScriptSelections() {
	UserScript.getUserScripts(currentUser, loadScriptSelections);
}

function loadScriptSelections(userScripts) {
    var len = userScripts.length;
    for(var i = 0; i < len; i++) {
        var script = userScripts[i].get("script");
        setScriptToSelect(script.get("name"), script.id);
    }
    
    // if a particular script needs to be loaded, select it in the dropdown and 
    // load the data
    if ($.getUrlVar('scriptId')) {
        var scriptId = $.getUrlVar('scriptId');
        Script.getScriptById(scriptId, loadScriptAndSetSelected);
    }
}

// load data for a particular script and set the selected item in the dropdown
function loadScriptAndSetSelected(script) {
    setSelectedScript(script.id);
    $(".scriptSpecific").show();
    loadScript(script);
}

// load data for a particular script
function loadScript(script) {
    currentScript = script;
    var scriptName = script.get("name");
    var owner = script.get("owner");
    var scriptData = null;
    if(owner.id === currentUser.id) {
        scriptData = script.get("privateScriptData");
    }
    else {
        scriptData = script.get("publicScriptData");
    }
    chunks = scriptData.get("chunks");
    
    initializeLoadScript(scriptName);

	setInstructionsContents(scriptData.get("instructions"));
	setCaveats(scriptData.get("caveats"));
    Note.getNoteByUserScript(currentUser, script, loadNote);
    History.createHistory(currentUser, script, function (history) {});
    
    var len = chunks.length;
    for(var i = 0; i < len; ++i) {
        var chunk = chunks[i];
        if(chunk.get("commandChunkType") === CommandChunkType.PARAMETER) {
            var chunkData = chunk.get("parameter");
            if(chunkData.get("inputType") === InputType.BOOLEAN) {
                addFlag(
                    chunkData.id, 
                    chunkData.get("alias"), 
                    chunkData.get("userFriendlyName"), 
                    chunkData.get("defaultVal"), 
                    chunkData.get("tooltip"), 
                    chunkData.get("warnings")
                );
            }
            else {
                addInputParameter(
                    chunkData.id, 
                    chunkData.get("alias"), 
                    chunkData.get("userFriendlyName"), 
                    chunkData.get("defaultVal"), 
                    chunkData.get("tooltip"), 
                    chunkData.get("warnings"),
                    chunkData.get("required")
                );
            }
        }
    }
}

// callback to show the note for this script
function loadNote(note) {
    if(note) {
        currentNote = note;
        var text = note.get("text");
        setNoteContents(text);
    }
}

// callback to show the list of saved parameters for this script
function loadSavedScriptParams(savedScriptParams) {
    var len = savedScriptParams.length;
    for(var i = 0; i < len; ++i) {
        params = savedScriptParams[i];
        var name = params.get("name");
        addRowToLoadParamsTable(params.id, name, params.createdAt);
    }
}

// callback to load a specific saved parameter setting
function loadSavedParams(savedScriptParams) {
    var savedParams = savedScriptParams.get("savedParams");
    var len = savedParams.length;
    var savedParamsMap = {};
    for(var i = 0; i < len; ++i) {
        var savedParam = savedParams[i];
        var param = savedParam.get("parameter");
        var value = savedParam.get("value");
        savedParamsMap[param.id] = value;
    }
    
    setInputParameters(savedParamsMap);
    $("#loadParams").modal("hide");
}
