$(document).ready(function(){
	$.getJSON('HerbTables.json', herbRand.GetTable);
	
	$('#randGenForm').on('submit', function(e){
		e.preventDefault();
		herbRand.GenHerb();
	});
});

function HerbRandomizer(){
	var self = this;
	var tab = {};
	
	this.GetTable = function(table){
		tab = table;
		
		$.each(tab, function(k, v){
			$('<option />', {value:k, html:v.display}).appendTo($("#terrainSelect"));
		});
	}
	
	
	this.GenHerb = function(){
		var herbs = [];
		var amt = Roll("1d4");
		var terrain = $('#terrainSelect').val();
		
		for(var i = 0; i < amt; i++){
			var roll = Roll('2d6') - 2;
			var tmp = tab[terrain].list[roll];
			
			// check for elemental water
			if([0, 1, 9, 10].indexOf(roll) != -1 && Roll('1d100') >= 50) herbs.push('Elemental Water');
			
			// add the herbs
			if(tmp != 'common') herbs.push(tmp);
			else herbs.push(tab['common'].list[Roll('2d6') - 2]);
		}
		OutputHerb(herbs);
	}
	
	var OutputHerb = function(herb){
		var out = '';
		var comma = '';
		for(var i = 0; i < herb.length; i++){
			out += comma + herb[i];
			comma = ', ';
		}
		$('#herbResult').html(out);
	}
	
	var SplitName = function(n){
		var name = {'opt': n.split(',')[1], 'display': n.split(',')[0]};
		return name;
	}
};
var herbRand = new HerbRandomizer();

function Roll(s){
	var tmp = s.split('d');
	var count = 0;
	for(var i = 0; i < tmp[0]; i++){
		var r = Math.floor(Math.random() * tmp[1]) + 1;
		count += r;
	}
	return count;
}