function test(c, d) {
	console.log(d);
    console.log(a);
    console.log(bar());
    console.log(c);
    
    var a = 1;
    function bar() {
        return 2;
    }
}

test(3,4);


//创建过程  EC = execution context
testEC = {
    // 变量对象
    VO: {},
    // 作用于链
    scopeChain: {},
    // 确定this指向
    this: {}
}

// VO = Variable Object，即变量对象
VO = {
    arguments: {
    	c: undefined,
    	d: undefined
    },  //注：在浏览器的展示中，函数的参数可能并不是放在arguments对象中，这里为了方便理解，我做了这样的处理
    bar: <bar reference>  // 表示foo的地址引用
    a: undefined
}

// 执行阶段
VO ->  AO   // Active Object
AO = {
    arguments: {
    	c: 3,
    	d: 4
    },
    bar: <bar reference>,
    a: 1
}


// 实际执行
function test(c, d) {
	// arguments = { c : 3, d : 4 }; // 这样理解方便点，理解arguments对象
    function foo() {
        return 2;
    }
    var a;
    console.log(a);
    console.log(foo());
    a = 1;
}

test(3, 4);