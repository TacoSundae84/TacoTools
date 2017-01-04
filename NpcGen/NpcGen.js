$(document).ready(function(){
	$.getJSON('NpcTables.json', npcRand.GenHtml);
	
	$('#randGenForm').on('submit', function(e){
		e.preventDefault();
		npcRand.GenNpc();
	});
	
	//check all and uncheck all buttons
	$('#checkAll').on('click', function(e){
		$('.optCheckBox').each(function(k, v){
			this.checked = true;
		});
	});
	$('#uncheckAll').on('click', function(e){
		$('.optCheckBox').each(function(k, v){
			this.checked = false;
		});
	});
});

function NpcRandomizer(){
	var self = this;
	var tab = {};
	var curRace = '';

	this.setRace = function(r){
		curRace = r;
	}
	this.getRace = function(){return curRace;}
	
	this.GenHtml = function(table){
		tab = table;
		
		var raceDrop = $('<select />', {id:'raceDrop', name:'raceDrop'});
		raceDrop.on('change', (function(o){
				return function(){o.setRace(this.value); o.GenCheckboxes();}
			})(self));
		$.each(tab.race, function(k, v){
			var obj = $('<option />', {value:k, html:k});
			obj.appendTo(raceDrop);
		});
		raceDrop.appendTo($('#raceBox'));
		
		self.setRace(Object.keys(tab.race)[0]);
		self.GenCheckboxes();
	}
	
	this.GenCheckboxes = function(){
		$('#raceOptions').empty();
		$.each(tab.race[curRace], function(k, v){
			var container = $('<td />', {'id':v.id + 'Box', 'class':'boxContainer'});
			var row = $('<tr />');
			row.append($('<td />', {'class':'optName'}).html(v.display + ':'));
			row.append(container);
			for(var i = 0; i < v.lists.length; i++){
				$('<label />').append(
					$('<input />', {'type':'checkbox', 'value':v.lists[i].list, 'name':v.id , 'checked':'checked', 'class':'optCheckBox'}),
					v.lists[i].display
				).appendTo(container);
			}
			$('#raceOptions').append(row);
		});
	}
	
	this.GenNpc = function(){
		var npc = {};
		npc.race = {};
		npc.race.name = 'Race';
		npc.race.val = curRace;
		/*** Generate random values for each option ***/
		$.each(tab.race[curRace], function(k, v){
			var options = [];
			$('input[name="' + v.id + '"]:checked').each(function(){
				if(tab[v.id].fieldType.dependent == 'none'){
					$.merge(options, tab[v.id][this.value]);
				}
				else{
					// table.field.list.dependent
					$.merge(options, tab[v.id][this.value][npc[tab[v.id].fieldType.dependent].val]);
				}
			});

			// make a list out of the ranges
			if(tab[v.id].fieldType.type == 'range'){
				var tmpOpt = [];
				for(var i = 0; i < options.length; i++){
					for(var j = options[i][0]; j <= options[i][1]; j++){
						tmpOpt.push(j);
					}
				}
				options = tmpOpt;
			}
			
			// Create entry in npc object
			npc[v.id] = {};
			npc[v.id]['name'] = v.display;
			npc[v.id]['val'] = '';
			var comma = '';
			for(var i = 0; i < v.count; i++){
				npc[v.id]['val'] += comma + options[Math.floor(Math.random() * options.length)];
				comma = ', ';
			}
		});

		OutputNpc(npc);
	}
	
	var OutputNpc = function(npc){
		npc.height.val = ToFoot(npc.height.val);
		npc.weight.val = BmiToWeight(npc.weight.val, npc.height.val);
		
		/*** Gen stats ***/
		npc.stats = {};
		npc.stats.name = 'Stats';
		npc.stats.val = 'Str:' + Roll('3d6') + ', Dex:' + Roll('3d6') + ', Con:' + Roll('3d6') +
			', Int:' + Roll('3d6') + ', Wis:' + Roll('3d6') + ', Char:' + Roll('3d6');
		
		/*** Output resulting npc ***/
		$('#npcResult').empty();
		$.each(npc, function(k, v){
			$('<div />', {'class': 'resultOpt'}).html('<b>' + v.name + ':</b> ' + v.val).appendTo($('#npcResult'));
		});
	}
	
	var SplitName = function(n){
		var name = {'opt': n.split(',')[1], 'display': n.split(',')[0]};
		return name;
	}
	
	var ToInch = function(v){
		return (v.split("'")[0] * 12) + (v.split("'")[1] * 1);
	}
	var ToFoot = function(v){
		return Math.floor(v / 12) + "'" + (v % 12);
	}
	var BmiToWeight = function(bmi, h){
		// (bmi * height(in)^2) / 703 = weight
		return Math.floor(((ToInch(h) * ToInch(h)) * bmi) / 703);
	}
};
var npcRand = new NpcRandomizer();

function Roll(s){
	var tmp = s.split('d');
	var count = 0;
	for(var i = 0; i < tmp[0]; i++){
		var r = Math.floor(Math.random() * tmp[1]) + 1;
		count += r;
	}
	return count;
}