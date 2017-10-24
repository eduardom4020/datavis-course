/*
	Extractor from tables of Box Mojo web site.

	Made By: Eduardo Melo de Carvalho Braga
	Email: eduardom4020@gmail.com

	Hi! If you are looking for extract data from Box Mojo, to
	make your visualizations or anithing else, feel free to use
	this code. You only need to run this on browser console to
	get a CSV file with data of actual page.

	PS: this script only works for Box Mojo Web site.

	

	Open the console in bellow page and paste all the code. 
	It'll download the csv for you
*/

//first copy and paste this code on console. Wait for 2 seconds

var script = document.createElement('script');
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);

//----------------------------------------------------------------------------------

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

/*

	Extractor for pages like http://www.boxofficemojo.com/movies/?id=avatar.htm


	In the previous page http://www.boxofficemojo.com/alltime/world/ paste all 
	of the code bellow. It'll download a big csv file with the data of foreign
	tab in the movie specific page. An aditional field will contain the name 
	of the movie. That way we can easly put that on tableau.
*/

function extract_foreign(name, path) {
	var _data

	var csv = "";

	$.get(path, function(data, status){
		_data = data;

		//scearch in all incomming HTML files for the desired tables
		//and then put it in csv string
		var found = $(_data).find("#body table tbody tr td table tbody tr td table tbody");
		var rows = found[2].innerText.split("\n\n\n");
		rows.splice(0,1);

		var formated_table;
		var check_row = rows[0].split("\n");

		check_row.length > 3 ? formated_table = false : formated_table = true;

		if(formated_table) {
			csv += name + "\t"
				+ check_row[0] + "\t"
				+ check_row[1] + "\t"
				+ check_row[2] + "\n";

			rows.forEach(function(tuple) {
				var elements = tuple.split("\n");

				csv += name + "\t"
					+ elements[0] + "\t"
					+ elements[1] + "\t"
					+ elements[2] + "\n";
			});
		}
		else {
			csv += name + "\t"
				+ check_row[0] + "\t"
				+ check_row[2] + "\t"
				+ check_row[5] + "\n";

			rows.forEach(function(tuple) {
				var elements = tuple.split("\n");

				csv += name + "\t"
					+ elements[0] + "\t"
					+ elements[2] + "\t"
					+ elements[5] + "\n";
			});
		}

		return csv;
	});
}

function extract(callback) {
	var csv = "Rank\tTitle\tStudio\tWorldwide\tDomestic\tDomesticPercent\tOverseas\tOverseasPercent\tYear\n";

	var rows = $("tbody tbody")[0].innerText.split("\n");
	rows.splice(0,1);

	rows.forEach(function(tuple) {
		var elements = tuple.split("\t");

		for(var j=0; j<elements.length-1; j++) {
			csv += elements[j] + "\t";
		}
		csv += elements[elements.length-1].replace("^", "") + "\n";
	});

	download(document.title + ' List.csv', csv);

	var csv_2 = "Title\tCountry\tReleaseDate\tTotalGross\n";

	var movies = $("tbody tbody")[0];
	movies.deleteRow(0);
	movies = movies.getElementsByTagName("a");

	for(var i=0; i<movies.length; i++) {
		var title = movies[i].outerText;
		var link = movies[i].pathname + "?page=intl&" + movies[i].search.substring(1, movies[i].search.length);

		csv_2 += extract_foreign(title, link);
	}

	callback(csv_2);
}

extract(function(result) {
	download(document.title + ' Foreign.csv', result);
});