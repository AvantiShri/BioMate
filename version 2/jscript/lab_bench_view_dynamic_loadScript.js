
var loadScript = function(scriptName) {
	
	if (scriptName == "Monte Carlo") {
		setScriptName(scriptName);
		setNoteContents("This is a monte carlo note");
		setInstructionsContents("This is the monte carlo instruction");
		addRowToLoadParamsTable("Monte carlo saved parameter 1");
		setCaveats("This is a monte carlo caveat");
		addInputParameter("inputFile", "Input File", "Enter the input file", "input file tooltip", "input file warning", true);
		addInputParameter("numIterations", "Number of Iterations", "100", "num iterations tooltip", "num iterations warning", false);
		addFlag("verbosity", "Detailed Output", true, "verbosity tooltip", "verbosity warning");
	}

}

