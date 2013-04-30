Parse.initialize("C9TPknemAEmJzz1xcKFbBC855l64A4T4R2EFjxBH", "iJGffHXEvURl0BDlT0PeeL7ex2s0qT7uJA6BJvEV");

var currentUser = Parse.User.current();
if (!currentUser) {
	window.location = "biomate_login.html";
}

// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
else {
$(function() { 
	
    // list the user's scripts in the dropdown
    setScriptSelections();
    
    $("#loadParamsTable tr").click( function () {
		$(this).addClass('highlight').siblings().removeClass('highlight');
		$("#btnLoad").removeClass("disabled");
	});
	
	$("#saveParamsBtn").click( function () {
		$("#savedMsg").html("Saved Parameters at " + dateToString(new Date()));
		$("#savedMsg").show();
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
    var scriptName = script.get("name");
    var owner = script.get("owner");
    var scriptData = null;
    if(owner.id === currentUser.id) {
        scriptData = script.get("privateScriptData");
    }
    else {
        scriptData = script.get("publicScriptData");
    }
    var chunks = scriptData.get("chunks");
    
    initializeLoadScript(scriptName);

	setInstructionsContents(scriptData.get("instructions"));
	setCaveats(scriptData.get("caveats"));
    
    var len = chunks.length;
    for(var i = 0; i < len; ++i) {
        var chunk = chunks[i];
        if(chunk.get("commandChunkType") === CommandChunkType.PARAMETER) {
            var chunkData = chunk.get("parameter");
            if(chunkData.get("inputType") === InputType.BOOLEAN) {
                addFlag(
                    chunkData.get("alias"), 
                    chunkData.get("userFriendlyName"), 
                    chunkData.get("defaultVal"), 
                    chunkData.get("tooltip"), 
                    chunkData.get("warnings")
                );
            }
            else {
                addInputParameter(
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

