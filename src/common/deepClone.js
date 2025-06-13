
const deepClone = function (currobj) {
	// var currobj = this
	if (typeof currobj !== "object") {
	  return currobj;
	}
	let newobj;
	if (currobj instanceof Array) {
	  newobj = [];
	} else {
	  newobj = {};
	}
	const currQue = [currobj];
	const newQue = [newobj];
	while (currQue.length) {
	  const obj1 = currQue.shift();
	  const obj2 = newQue.shift();
	  for (const key in obj1) {
		if (obj1.hasOwnProperty(key)) {
		  if (typeof obj1[key] !== "object") {
			obj2[key] = obj1[key];
		  } else {
			if (obj1[key] instanceof Array) {
			  obj2[key] = [];
			} else if (obj1[key] instanceof Date) {
			  obj2[key] = obj1[key];
			  continue
			} else if (obj1[key] instanceof Object) {
			  obj2[key] = {};
			}
			currQue.push(obj1[key]);
			newQue.push(obj2[key]);
		  }
		}
	  }
	}
	return newobj;
  };
  export {
	deepClone
  }