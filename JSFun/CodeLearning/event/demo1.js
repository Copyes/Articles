//  写这些demo的原因时想要依靠代码来一步一步理解
setTimeout(function(){
	console.log('time1');
});
new Promise(function(resolve, reject){
	console.log('Promise1');
	for(var i = 0; i < 999; i++){
		i == 999 && resolve();
	}
	console.log('Promise2');
}).then(function(){
	console.log('then1');
});

console.log('globle1');


