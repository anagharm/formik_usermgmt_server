
//convert Array to String
exports.formDivisionNameString = (dataArray) =>{
	var dataString = dataArray.flatMap(item => item.divisionName);
	return dataString.toString()
};
exports.formDistrictNameString = (dataArray) =>{
	var dataString = dataArray.flatMap(item => item.districtName);
	return dataString.toString()
};
exports.formBlockNameString = (dataArray) =>{
	var dataString = dataArray.flatMap(item => item.blockName);
	return dataString.toString()
};
exports.formGpNameString = (dataArray) =>{
	var dataString = dataArray.flatMap(item => item.gpName);
	return dataString.toString()
};

//Fetch only Number from Array
exports.formDivisionNumberArray = (dataArray) =>{
	var dataString = dataArray.flatMap(item => item.divisionCode);
	return dataString
};
exports.formDistrictNumberArray = (dataArray) =>{
	var dataString = dataArray.flatMap(item => item.districtCode);
	return dataString
};
exports.formBlockNumberArray = (dataArray) =>{
	var dataString = dataArray.flatMap(item => item.blockCode);
	return dataString
};
exports.formGpNumberArray = (dataArray) =>{
	var dataString = dataArray.flatMap(item => item.gpCode);
	return dataString
};