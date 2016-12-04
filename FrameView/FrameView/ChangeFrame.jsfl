DEBUG = false
function debugTrace(arg) {
	if(DEBUG == true){
		fl.trace(arg)
	}
}
var Timeline = fl.getDocumentDOM().getTimeline()
var FrameViewURI = fl.configURI + "FrameView/DATA/"
var FrameToChange
var SymbolName
init()
//This functions initalizes stuff
function init() {
	execSWF()
}


//This function does the SWF magic
function execSWF(panelName,ToSendToSWF, FTAM, FTAMLabels) { 
    if(fl.swfPanels.length > 0){ 
        for(x = 0; x < fl.swfPanels.length; x++){ 
            // look for a SWF panel of the specified name, then call the specified AS3 function 
            if(fl.swfPanels[x].name == "FrameView") // name busted? 
            {
				var re = new RegExp("\"", 'g');
				var ReturnArray = fl.swfPanels[x].call("ChangeFrame");
				debugTrace("RET " + ReturnArray)
				var FrameToChange = ReturnArray
				var SymbolName = fl.swfPanels[x].call("getName").replace(re,'');
				debugTrace(parseInt(FrameToChange))
				debugTrace("NAME " + SymbolName)
				run(ReturnArray, SymbolName)
                break; 
            } 
        } 
    } 
    else 
        fl.trace("no panels"); 
} 

//This function does all the flashy stuff
function run(FTC, SN) {
	getItem(FTC, SN)
}

function getItem(FTC, SN) {
	
	for(var i=0;i<Timeline.layers.length;i++) {
		
		/*debugTrace("LAYER " + Timeline.layers[i].name)
		debugTrace("LAYERNUM " + i)
		debugTrace("ECOUNT " + Timeline.layers[i].frames[Timeline.currentFrame].elements.length)*/
		debugTrace(SN)
		var CurrentLayer = i
		var CurrentFrame = Timeline.currentFrame
		try {
		if(Timeline.layers[CurrentLayer].frames[Timeline.currentFrame].elements.length > 0){
			for(var ii=0;ii<Timeline.layers[CurrentLayer].frames[CurrentFrame].elements.length;ii++) {
				//debugTrace(Timeline.layers[CurrentLayer].frames[CurrentFrame].elements[ii].libraryItem.name)
				try
				{
				if(Timeline.layers[CurrentLayer].frames[CurrentFrame].elements[ii].libraryItem.name == SN) {
					if(Timeline.layers[CurrentLayer].frames[CurrentFrame].startFrame != CurrentFrame) {
						debugTrace("Convert")
						Timeline.setSelectedLayers(CurrentLayer,true)
						Timeline.setSelectedFrames(CurrentFrame,CurrentFrame)
						Timeline.convertToKeyframes(CurrentFrame,CurrentFrame)
						Timeline.layers[CurrentLayer].frames[CurrentFrame].elements[ii].firstFrame = FTC - 1
						if(FLfile.read(fl.configURI + "FrameView/lip.txt")=="1"){
						if(FLfile.read(fl.configURI + "FrameView/2s.txt")=="1"&&FLfile.read(fl.configURI + "FrameView/lip.txt")=="1")  {
							Timeline.currentFrame = CurrentFrame +2;
						} else { Timeline.currentFrame = CurrentFrame +1; }
					}
					} else {
						debugTrace("EH")
						debugTrace(FrameToChange)
						Timeline.layers[CurrentLayer].frames[CurrentFrame].elements[ii].firstFrame = FTC - 1
						Timeline
						if (FLfile.read(fl.configURI + "FrameView/lip.txt")=="1"){
						if(FLfile.read(fl.configURI + "FrameView/2s.txt")=="1") {
							Timeline.currentFrame = CurrentFrame +2;
						} else { Timeline.currentFrame = CurrentFrame +1; }
					}
					}
				

				
				} else {
					debugTrace("urafagget")
				}
			}
							catch(err){
					
				}
			}
		}
	} catch(err){}
	
		
	}
}