$(document).ready(function(){
	$.getJSON('CityTables.json', cityRand.GetTable);
	
	$('#randGenForm').on('submit', function(e){
		e.preventDefault();
		cityRand.GenCity();
	});
});

function CityRandomizer(){
	var self = this;
	var tab = {};
	
	this.GetTable = function(table){
		tab = table;
	}
	
	
	this.GenCity = function(){
		var city = {};
		/*** Generate random values for each option ***/
		$.each(tab, function(k, v){
			var options = [];
			
			// make a list out of the ranges
			if(tab[k].fieldType == 'range'){
				var tmpOpt = [];
				for(var i = 0; i < options.length; i++){
					for(var j = options[i][0]; j <= options[i][1]; j++){
						tmpOpt.push(j);
					}
				}
				options = tmpOpt;
			}
			else if(tab[k].fieldType == 'list'){
			}
			
			// Create entry in city object
			city[v.id] = {};
			city[v.id]['name'] = v.display;
			city[v.id]['val'] = '';
			var comma = '';
			for(var i = 0; i < v.count; i++){
				city[v.id]['val'] += comma + options[Math.floor(Math.random() * options.length)];
				comma = ', ';
			}
		});

		OutputCity(city);
	}
	
	var OutputCity = function(city){
		city.height.val = ToFoot(city.height.val);
		city.weight.val = BmiToWeight(city.weight.val, city.height.val);
		
		/*** Output resulting city ***/
		$('#cityResult').empty();
		$.each(city, function(k, v){
			$('<div />', {'class': 'resultOpt'}).html('<b>' + v.name + ':</b> ' + v.val).appendTo($('#cityResult'));
		});
	}
	
	var SplitName = function(n){
		var name = {'opt': n.split(',')[1], 'display': n.split(',')[0]};
		return name;
	}
};
var cityRand = new CityRandomizer();

function Roll(s){
	var tmp = s.split('d');
	var count = 0;
	for(var i = 0; i < tmp[0]; i++){
		var r = Math.floor(Math.random() * tmp[1]) + 1;
		count += r;
	}
	return count;
}