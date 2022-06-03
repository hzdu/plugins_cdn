
function brave_initPikaday(fieldElement, startDate, endDate){
   //console.log('@@@@Load Pikaday!!!!', fieldElement, startDate, endDate);
   
   var startDateParsed = startDate ? brave_parseDate(startDate) : null;
   var endDateParsed = endDate ?  brave_parseDate(endDate) : null;
   var years = startDate && endDate ? brave_getRangeYears(startDate, endDate) : [1940, 2040];

   new Pikaday({
       field: fieldElement,
       format: 'D/M/YYYY',
       minDate: startDateParsed,
       maxDate: endDateParsed,
       yearRange: years,
       toString(date, format) {
           // you should do formatting based on the passed format,
           // but we will just return 'D/M/YYYY' for simplicity
           var day = date.getDate(); day = day < 10 ? '0'+day : day;
           var month = date.getMonth() + 1; month = month < 10 ? '0'+month : month;
           var year = date.getFullYear();

           return `${day}/${month}/${year}`;
       },
       parse(dateString, format) {
           // dateString is the result of `toString` method
           var parts = dateString.split('/');
           var day = parseInt(parts[0], 10);
           var month = parseInt(parts[1], 10) - 1;
           var year = parseInt(parts[2], 10);
           return new Date(year, month, day);
       }
   });
}

function brave_parseDate(dateString){
   if(!dateString) { return null}
   var parts = dateString.split('/');
   var day = parseInt(parts[0], 10);
   var month = parseInt(parts[1], 10) - 1;
   var year = parseInt(parts[2], 10);
   return new Date(year, month, day);
}

function brave_getRangeYears(sDate, eDate){
   if(!sDate && !eDate) { return null; }
   var startDate = brave_parseDate(sDate);
   var endDate = brave_parseDate(eDate);
   var startYear = startDate.getFullYear();
   var endYear = endDate.getFullYear();
   let years = [startYear];
   if(startYear !== endYear){
       years.push(endYear);
   }
   return years;
}