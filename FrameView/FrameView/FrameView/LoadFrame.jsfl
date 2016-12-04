DEBUG = true
function debugTrace(arg) {
	if(DEBUG == true){
		fl.trace(arg)
	}
}
var FrameViewURI = fl.configURI + "FrameView/DATA/"
var SymbolToExport = fl.getDocumentDOM().selection[0].libraryItem
var NumberOfFrames = SymbolToExport.timeline.frameCount

var FileNames
init()
//This functions initalizes stuff
function init() {
	//ITF We init FrameView stuff
	
	debugTrace("Current dir = " + FrameViewURI)
	//We remove the folder and it's contents to make sure there are no leftoffs
	if(FLfile.exists(FrameViewURI) == true)
	{
		FLfile.remove(FrameViewURI)
	}
	FLfile.createFolder(FrameViewURI)
	//ITF: We init this object's stuff

	run()
}
//This function does all the flashy stuff
function run() {
	var ToSendToSWF
	//ITF: We do good stuff
	SymbolToExport.exportToPNGSequence(FrameViewURI + "/Temp")
	FileNames = FLfile.listFolder(FrameViewURI, "files")
	//We make an array that includes the string to pass to the SWF, we do this here because javascript is faster.
	for(var i=0;i<FileNames.length;i++) {
		if(FileNames[i].search(".png") != -1) {
			FileNames[i] = FrameViewURI + FileNames[i]
		} else {
			FileNames.splice(i,1)
		}
	}
	//We get the frames that actually matter, AKA frames with content that got exported
	var FTAM = FLfile.listFolder(FrameViewURI, "files") // Frames that actually matter
	var FTAMLabels = []
	for(var i=0;i<FTAM.length;i++) {
		if(FTAM[i].search(".png") != -1) {
			var re1 = new RegExp("Temp", 'g');
			FTAM[i] = FTAM[i].replace(re1,'')
			var re2 = new RegExp(".png", 'g');
			FTAM[i] = FTAM[i].replace(re2,'')
			FTAM[i] = parseInt(FTAM[i],10) //javascript is stupid, it thinks we are using octal, let's make it decimal
		} else {
			FTAM.splice(i,1)
		}
	}
	FTAMLabels.length = FTAM.length
	//We create an array that contains all the labels of FTAM
	for(i=0;i<FTAM.length;i++)
	{
		var FrameToCopy = FTAM[i] - 1
		debugTrace("F: " + FrameToCopy -1) //we need to compensate the fact that the export starts with 1 and the timeline works from 0
		try {
		FTAMLabels[i]= SymbolToExport.timeline.layers[0].frames[FrameToCopy].name
		}
		catch(err)
		{}
	}
	ToSendToSWF=FileNames.join("#")
	execSWF("FrameView",ToSendToSWF,FTAM,FTAMLabels,fl.getDocumentDOM().selection[0].libraryItem.name)
	if(DEBUG == true) {
		FLfile.write(fl.configURI + "FrameView/DUMP.log", ToSendToSWF)
		FLfile.write(fl.configURI + "FrameView/DUMP2.log", FTAM.join("#"))
		FLfile.write(fl.configURI + "FrameView/DUMP3.log", FTAMLabels.join("#"))
	}
}


function execSWF(panelName,ToSendToSWF, FTAM, FTAMLabels, SymbolName) { 
    if(fl.swfPanels.length > 0){ 
        for(x = 0; x < fl.swfPanels.length; x++){ 
            // look for a SWF panel of the specified name, then call the specified AS3 function 
            if(fl.swfPanels[x].name == "FrameView") // name busted? 
            {
				fl.swfPanels[x].call("LoadFrames",ToSendToSWF,FTAM.join("#"),FTAMLabels.join("#"), SymbolToExport.name);
				//Since all my attempts to pass UTF-8 to the swf panel have failed, and FLfile doens't support utf-8...
				//let's hack it, write to the output panel and save it.
				//nvm fixed it
				/*
				fl.outputPanel.clear()
				fl.outputPanel.trace(SymbolToExport.name)
				fl.outputPanel.save(FrameViewURI + "temp.txt",false,false);
				fl.outputPanel.clear()
				*/
                break; 
            } 
        } 
    } 
    else 
        fl.trace("no panels"); 
} 
