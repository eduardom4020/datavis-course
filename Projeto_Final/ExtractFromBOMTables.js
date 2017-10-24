/*
	Extractor from tables of Box Mojo web site.

	Made By: Eduardo Melo de Carvalho Braga
	Email: eduardom4020@gmail.com

	Hi! If you are looking for extract data from Box Mojo, to
	make your visualizations or anithing else, feel free to use
	this code. You only need to run this on browser console to
	get a CSV file with data of actual page.

	PS: this script only works for Box Mojo Web site.

	PS2: Paste these functions on browser console. Execute "extract"
	and get the download.
*/

// Table Extractor For Page : http://www.boxofficemojo.com/alltime/world/

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function extract() {
	var rows = $("tbody tbody").innerText.split("\n");

	var csv = "";

	rows.forEach(function(tuple) {
		var elements = tuple.split("\t");

		for(var j=0; j<elements.length-1; j++) {
			csv += elements[j] + ",";
		}
		csv += elements[elements.length-1] + "\n";
	});

	download('BOMTable.csv', csv);
	//console.log(csv);
}