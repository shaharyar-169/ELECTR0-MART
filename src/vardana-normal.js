import { jsPDF } from "jspdf"; // Import jsPDF

// Replace 'undefined' with the base64-encoded font data
var font = 'vardana'; 

var callAddFont = function () {
  this.addFileToVFS('vardana-normal.ttf', font);
  this.addFont('vardana-normal.ttf', 'vardana', 'normal');
};

jsPDF.API.events.push(['addFonts', callAddFont]);

export default callAddFont;
