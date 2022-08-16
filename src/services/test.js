// function get retrieve available ids within a range from 0 given a list of used ids
const getUnusedIds = (range, usedIds) => {
	const allIdsRange= Array.from(Array(range).keys());
	const availableIds = allIdsRange.filter(id => !usedIds.includes(id) && id !== 0);
	const padded = availableIds.map(id => id.toString());
	return availableIds;
}

console.log(getUnusedIds(100, [1]))

const id = 'STAFF01'

console.log(id.match(/[0-9]+/))
console.log(id.match(/[a-zA-Z]+/))

const objList = [
	{
		t1: 1
	}, 
	{
		t2: 2,
	}
]

const json =JSON.stringify(objList);

console.log(json)

const testObj = {
	list: [1,2,3,4],
	obj: {
		string: "this string",
		list2: [6,7,8,9]
	}
}

const {obj} = testObj

console.log(obj)