function mapReduce() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  //var sheetName = sheet.getName();
  var lastRow = sheet.getLastRow()
  var dataColumnEnd = sheet.getLastColumn();
  //console.log("lastRow is %d, dataColumnEnd is %d", lastRow, dataColumnEnd)
  var dataRowStartFound = false;
  for (var i = 1; i <= lastRow; i++) {
    var tmpRange = sheet.getRange(i, 1);
    var tmpColumn1Value = tmpRange.getValue()
    //console.log("tmpColumn1Value is %d", tmpColumn1Value)
    if (tmpColumn1Value == "Date") {
      for (var j = 1; j <= dataColumnEnd; j++) {
        var tmpxRange = sheet.getRange(i, j);
        var tmpColumnxValue = tmpxRange.getValue()
        //looking for the 1st data column start, which is the "Worship Chairperson" column
        if (tmpColumnxValue == "Date") {
          var dataColumnStart = j;
          break;
        }
      }
      //var headerRow = sheet.getRange(i, dataColumnStart, 1, dataColumnEnd).getValues();
      
    }
    //dataRowStart including the header row
    else if ((!dataRowStartFound) && (tmpColumn1Value instanceof Date)) {
      dataRowStart = i -1;
      dataRowStartFound = true;
      //console.log("dataRowStart is %d", dataRowStart)
    }
    else if ((dataRowStartFound) && (!(tmpColumn1Value instanceof Date))) {
      //one row before
      dataRowEnd = i - 1;
      //console.log("dataRowEnd is %d", dataRowEnd)
      break;
    }
  }

  console.log("dataRowStart = %d, dataRowEnd = %d, dataColumnStart = %d, dataColumnEnd = %d",dataRowStart,dataRowEnd,dataColumnStart,dataColumnEnd);

  var array = sheet.getRange(dataRowStart, dataColumnStart, dataRowEnd-dataRowStart+1, dataColumnEnd-dataColumnStart+1).getValues();
  console.log(JSON.stringify(array))
      
  //var array = [
  //  ['Name', 'Phone Number'],
  //  ['Bill Chu', "858-716-7471"],
  //  ['Le Chu', "858-472-7563"]
  //]

  var keys = array.shift();
  var objects = array.map(function (values) {

    return keys.reduce(function (o, k, i) {
      o[k] = values[i];
      return o;
    }, {});

  });
  console.log(objects)
}
