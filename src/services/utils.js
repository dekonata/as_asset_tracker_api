// function get retrieve available ids within a range from 0 given a list of used ids
const getUnusedIds = (range, usedIds) => {
	const allIdsRange= Array.from(Array(range).keys());
	const availableIds = allIdsRange.filter(id => !usedIds.includes(id));
	const padded = availableIds.map(id => id.toString());
	return availableIds;
}

const queryParsedLocations = () => {
	return `CASE 
				WHEN location_type='cabinet' 
					THEN CONCAT(
						'CAB', 
						TO_CHAR(all_locations.location_id, 'FM00'), 
						': ', 
						all_locations.located)
					WHEN location_type='shelf' 
						THEN CONCAT(
							'SHE', 
							TO_CHAR(all_locations.location_id, 'FM00'), 
							': ', 
							all_locations.located)	
					WHEN location_type='staff' 
						THEN CONCAT(
							'STAFF', 
							TO_CHAR(all_locations.location_id, 'FM00'), 
							': ', 
							all_locations.firstname,
							' ',
							all_locations.lastname)	
				ELSE 'UNKOWN' 
			END AS "location"`
}

module.exports = {
	getUnusedIds,
	queryParsedLocations
}