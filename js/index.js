function requestArtist (artist){
	$.ajax({
		url: "https://api.spotify.com/v1/search?type=artist&query="+artist,
		dataType: "json",
		success: function (response){
			console.log(response);
		},
		error: function (response){
			console.log(response);
		}
	});
}



$(document).ready(function(){
	$("#button-search").on("click", function(e){
		e.preventDefault();
		var artist = $('input-artist').val();
		requestArtist(artist);
		console.log("hola");
	});
});



