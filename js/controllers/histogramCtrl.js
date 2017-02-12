'use strict';

app.controller('histogramCtrl', function(){

	var $histogramCtrl = this;

    $histogramCtrl.images = [
      	{name:'Cameraman', src: './img/cameraman.jpg'},
      	{name:'Lena', src: './img/lena.jpg'},
      	{name:'Airplane', src: './img/airplane.jpg'},
      	{name:'Peppers', src: './img/peppers.jpg'},
      	{name:'Lake', src: './img/lake.jpg'},
      	{name:'Baboon', src: './img/baboon.jpg'},
    ];

    $histogramCtrl.defaultImage = $histogramCtrl.images[0];

	$histogramCtrl.updateData = function(){
		$histogramCtrl.data = $histogramCtrl.defaultImage;
	};

	$histogramCtrl.updateData();
});
