$(document).ready(function(){

	$.getJSON('TableList.json', tableRand.GetTable);

	$('#randGenForm').on('submit', function(e){
		e.preventDefault();
		tableRand.RollTable();
	});
});

function SimpleTable(){
	var self = this;
	var tab = [];

	this.GetTable = function(table){
		tab = table;
		for(var i = 0; i < table.length; i++){
			$('<option />', {value:i, html:tab[i][0]}).appendTo($("#tableSelect"));
		};
	}

	this.RollTable = function(){
		console.log("tables/" + tab[$("#tableSelect").val()][1]);
		$.getJSON("tables/" + tab[$("#tableSelect").val()][1], (data) => {
			var result = [];
			for(var key in data){
				result.push([key, data[key][Roll("1d" + data[key].length) - 1]]);
			}
			Output(result);
		});
	}

	var Output = function(result){
		$('#npcResult').empty();
		for(var i = 0; i < result.length; i++){
			$('<div />', {'class': 'resultOpt'}).html('<b>' + result[i][0] + ':</b> ' + result[i][1]).appendTo($('#npcResult'));
		}
	}
};
var tableRand = new SimpleTable();

function Roll(s){
	var tmp = s.split('d');
	var count = 0;
	for(var i = 0; i < tmp[0]; i++){
		var r = Math.floor(Math.random() * tmp[1]) + 1;
		count += r;
	}
	return count;
}
