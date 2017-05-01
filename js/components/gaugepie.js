'use strict';

app.component('gaugepie', {
	bindings: {
    	data: '<'
  	},
  	controllerAs: '$gaugepieCtrl',
	controller: function($rootScope, $element, DEFAULTS){

		var $gaugepieCtrl = this;
		var arc;
		var bg = d3.color(DEFAULTS.COLORS.BG);
		var el = $element[0];
		var height;
		var outerRadius;
		var innerRadius;
		var middleRadius;
		var svg;
		var tt = DEFAULTS.TRANSITION.TIME;
		var width;
		var thiness = 5; // 1 => looks like pie chart, 20 => very thin line
		// var endAngle = 2*Math.PI; // 360°
		// var endAngle = 7/4*Math.PI; // 315°
		var endAngle = 3/2*Math.PI; // 270°
		// var endAngle = 5/4*Math.PI; // 225°
		// var endAngle = Math.PI/2; // 90°
		// var endAngle = Math.PI/6; // 30°
		var startAngle = (2*Math.PI - endAngle)/2 - Math.PI;
		var scale = d3.scaleLinear().domain([0, 1]).range([startAngle, startAngle + endAngle]);
		var cos = function(c){ return Math.cos(c); };
		var sin = function(s){ return Math.sin(s); };

		$gaugepieCtrl.init = function(){

			angular.element(el).empty();

			var margin = {top: 20, right: 0, bottom: 0, left: 20};

			width = el.clientWidth - margin.left - margin.right;
			height = el.clientHeight - margin.top - margin.bottom;

			outerRadius = Math.min(width, height)/2 - (margin.right + margin.left);
			innerRadius = outerRadius - (outerRadius/thiness);
			middleRadius = outerRadius - ((outerRadius - innerRadius)/2);

    		svg = d3.select(el).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			arc = d3.arc()
	    		.innerRadius(innerRadius)
	    		.outerRadius(outerRadius)
	    		.startAngle(startAngle);

			var arcPath = d3.arc()
	    		.innerRadius(innerRadius)
	    		.outerRadius(outerRadius)
	    		.startAngle(startAngle)
	    		.endAngle(startAngle + endAngle);

			var gaugepie = svg
				.append('g')
				.attr('class', 'gaugepie')
				.attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

			gaugepie
				.append('clipPath')
    			.attr('id', 'clipPath')
    			.append('path')
    			.attr('d', arcPath);

			gaugepie
				.append('path')
					.attr('class', 'arc')
					.datum({ endAngle: startAngle })
    				.style('fill', bg.darker(0.5))
    				.transition().duration(tt*2)
    				.attrTween('d', arcTween(startAngle + endAngle));

			gaugepie
				.append('path')
				.attr('class', 'indicator');

			gaugepie
				.append('circle')
				.attr('class', 'c')
				.attr('fill', 'transparent')
				.attr('clip-path', 'url(#clipPath)')
				.attr('r', (outerRadius - innerRadius)/2);

			gaugepie
				.append('path')
				.attr('class', 'line')
				.attr('stroke', 'pink')
				.attr('stroke-width', 1);

		};

		$gaugepieCtrl.$onChanges = function(changes){
			$gaugepieCtrl.update(el, changes.data.currentValue, changes.data.previousValue);
		};

		$gaugepieCtrl.update = function(el, data, prevData){
			prevData = angular.equals(prevData, {}) ? 0 : prevData;

			svg.select('g.gaugepie').select('path.indicator')
				.datum({ endAngle: scale(prevData) })
				.transition().duration(tt)
				.attr('fill', d3.interpolateRdYlBu(data))
				.attrTween('d', arcTween(scale(data)));

			svg.select('g.gaugepie').select('circle.c')
				.datum({ endAngle: scale(prevData) })
				.transition().duration(tt)
				.attr('fill', d3.interpolateRdYlBu(data))
				.attrTween('cx', circularTween(scale(data), cos))
				.attrTween('cy', circularTween(scale(data), sin));

			svg.select('g.gaugepie').select('path.line')
				.datum({ endAngle: scale(prevData) })
				.transition().duration(tt)
				.attrTween('d', lineTween(scale(data)));

		};

		function lineTween(newAngle){
			return function(d){
				var interpolate = d3.interpolate(d.endAngle, newAngle);
				return function(t){
					var _in = interpolate(t) - Math.PI/2;
					var _x1 = Math.cos(_in)*outerRadius;
					var _y1 = Math.sin(_in)*outerRadius;
					var _x2 = Math.cos(_in)*innerRadius;
					var _y2 = Math.sin(_in)*innerRadius;
					return d3.line()([[_x1, _y1], [_x2, _y2]]);
				};
			};
		}

		function circularTween(newAngle, fn){
			return function(d){
				var interpolate = d3.interpolate(d.endAngle, newAngle);
				return function(t){
					var _in = interpolate(t) - Math.PI/2;
					return fn(_in)*middleRadius;
				};
			};
		}

		function arcTween(newAngle){
			return function(d){
				var interpolate = d3.interpolate(d.endAngle, newAngle);
				return function(t){
					d.endAngle = interpolate(t);
					return arc(d);
				};
			};
		}

		$gaugepieCtrl.init();

		$rootScope.$on('window:resize', function(){
			$gaugepieCtrl.init();
		});
	}
});
