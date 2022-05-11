// function get retrieve available ids within a range from 0 given a list of used ids
const getUnusedIds = (range, usedIds) => {
	const allIdsRange= Array.from(Array(range).keys());
	const availableIds = allIdsRange.filter(id => !usedIds.includes(id));
	return availableIds;
}

module.exports = {
	getUnusedIds,
}