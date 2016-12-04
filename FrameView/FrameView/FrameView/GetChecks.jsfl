//check my dubs
DEBUG = true
function debugTrace(arg) {
	if(DEBUG == true){
		fl.trace(arg)
	}
}
var Twos = "YEH"
var Lip


Twos = FLfile.read(fl.configURI + "FrameView/" + "2s.txt")
Lip = FLfile.read(fl.configURI + "FrameView/" + "Lip.txt")
execSWF()
//This function does the SWF magic
function execSWF() { 
    if(fl.swfPanels.length > 0){ 
        for(x = 0; x < fl.swfPanels.length; x++){ 
            // look for a SWF panel of the specified name, then call the specified AS3 function 
            if(fl.swfPanels[x].name == "FrameView") // name busted? 
            {
				
				fl.swfPanels[x].call("GetChecks",Twos, Lip);
				debugTrace(Twos)
				//Since all my attempts to pass UTF-8 to the swf panel have failed, and FLfile doens't support utf-8...
				//let's hack it, write to the output panel and save it.
				//Nvm i fixed it
                break; 
            } 
        }
    } 
    else 
        fl.trace("no panels"); 
} 
