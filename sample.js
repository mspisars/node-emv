var emv = require('./emv.js');

// Parsing EMV data
emv.describe('4F07A00000000430605F2A02097882025C008407A0000000043060950500800080009A031508069C01009F02060000000001019F080200009F090200009F10120114000100000000000000E0DB2E438900FF9F1A0205289F1E0830303030303030309F2608C49EDC5F41B0A4C89F2701809F3303E0F0C89F34034403029F3501009F360201149F37048B3441139F4104000000009F5301529F0306000000000000', function(data){
	if(data != null){
		console.log(data);
	}
});

// Parsing EMV data - more than 1 byte length
emv.parse('7081C08F01049F32010392249FFBFB7FEEC7B04367B3E4C671C30B4AEEADA2C104D150EAFD3C052C970E8D78E3332B720F4FE41D7C1BEF14E4E36F8090A142B7E1B17DDECFAA80FCB4BF041C2D4404AD1E7F19C9565B937F5EB502906FEE32F521E532', function(data){
	if(data != null){
		console.log(data);
	}
});

// // Parsing and describing EMV data
// emv.describe('9F34030200009F26087DE7FED1071C1A279F270180', function(data){
// 	if(data != null){
// 		console.log(data);
// 	}
// });
//
//
// // Lookup an EMV tag in node-emv dictionary
// emv.lookup('9F10', function(data){
// 	if(data.length > 0){
// 		// console.log(data[0].tag + ' ' + data[0].name);
// 		console.log(data);
// 	}
// });
//
//
// // Describing Terminal Verification Result(TVR)
// emv.tvr('8000048000', function(data){
// 	if(data.length > 0){
// 		console.log(data);
// 	}
// });
//
//
// // Try to get information about Aplication Interchange Profile(AIP)
// emv.aip('0040', function(data){
// 	if(data.length > 0){
// 		console.log(data);
// 	}
// });
//
// //Application Usage Control tag
// emv.auc('2A7F', function(data){
// 	if(data.length > 0){
// 		console.log(data);
// 	}
// });
