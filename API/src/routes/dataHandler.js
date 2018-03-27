




var exports = module.exports = {};

/**
 * Takes a JSON object and merges games with the same matchingValue but different multipleValue fields into one.
 *
 * @param data              The JSON object
 * @param multipleValue     The attribute to find different values of
 * @param matchingValue     The attribute that the multipleValue should be grouped
 *
 * @returns the JSON data with a list of unique matchingValue, their other attributes, and their list of different multipleValues
 */
exports.mergeX = function(data,multipleValue,matchingValue) {
  var i = 0;
  var xdata;
  var editedData = [];
  while (data[i]) {
    var temp = i;
    xdata = [data[i][multipleValue]];

    while (data[++i]) {
      if (data[temp][matchingValue] == data[i][matchingValue]) {
        xdata.push(data[i][multipleValue]);
      }
      else break;
    }

    data[temp][multipleValue] = xdata;
    editedData.push(data[temp]);
  }

  return editedData;
};


