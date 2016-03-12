var emv = require('./emv.js');

// Parsing EMV data
emv.parse('9F34030200009F26087DE7FED1071C1A279F270180', function(data){
	if(data != null){
		console.log(data);
	}		
});


// Parsing and describing EMV data
emv.describe('9F34030200009F26087DE7FED1071C1A279F270180', function(data){
	if(data != null){
		console.log(data);
	}		
});


// Lookup an EMV tag in node-emv dictionary
emv.lookup('9F10', function(data){
	if(data.length > 0){
		// console.log(data[0].tag + ' ' + data[0].name);
		console.log(data);
	}		
});


// Describing Terminal Verification Result(TVR)
emv.tvr('8000048000', function(data){
	if(data.length > 0){
		console.log(data);
	}		
});


// Try to get information about Aplication Interchange Profile(AIP)
emv.aip('0040', function(data){
	if(data.length > 0){
		console.log(data);
	}		
});

//Application Usage Control tag
emv.auc('2A7F', function(data){
	if(data.length > 0){
		console.log(data);
	}		
});