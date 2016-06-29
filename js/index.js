function requestAjax (searchID, call){
	var url;

	if(call == "artist"){
		url = "https://api.spotify.com/v1/search?type=artist&query="+searchID;
	}else if(call == "album"){
		url = "https://api.spotify.com/v1/artists/"+searchID+"/albums?market=ES";
	}else{
		url = "https://api.spotify.com/v1/albums/"+searchID;
	}

	$.ajax({
		url: url,
		dataType: "json",
		success: function (response){
			if(call == "artist"){
				var artistID = response.artists.items[0].id;
				var element = $(".container-artist");
				requestAjax(artistID, "album");

			}else if(call == "album"){
				response.items.forEach(function (album){
					var elementAux = $("<div class='album'>");
					var imageAlbum = $("<img class='image-album'>").attr("src", album.images[0].url);
					elementAux.append(imageAlbum);
					elementAux.append($("<h1 class='album-name'>").text(album.name));
				//requestTrack(album, element);
				elementAux.on("click", function(){
					requestAjax(album.id,"track");
				});

				//element.append(elementAux);
				$(".container-artist").append(elementAux);
			});

			}else{
				var elementAux = $("<ul class='track-list'>");

				response.tracks.items.forEach(function(song){
					var songElement = $("<li class='track-song'>");
					var songLink = $("<a class='link-song'>").attr("href", song.preview_url);
					songLink.attr("target", "_blank");
					songLink.text(song.name);
					songElement.append(songLink);
					elementAux.append(songElement);

				});
				$(".songtrack-list").empty();
				$(".songtrack-list").append(elementAux);
			}
		},
		error: function (response){
			console.log(response);
		}
	});
}

function requestArtist (artist){
	$.ajax({
		url: "https://api.spotify.com/v1/search?type=artist&query="+artist,
		dataType: "json",
		success: function (response){
			var artistID = response.artists.items[0].id;
			var element = $(".container-artist");
			requestAlbum(artistID,element);
		},
		error: function (response){
			console.log(response);
		}
	});
}

function requestAlbum (artistID, element){
	$.ajax({
		url: "https://api.spotify.com/v1/artists/"+artistID+"/albums?market=ES",
		dataType: "json",
		success: function (response){
			console.log(response);

			response.items.forEach(function (album){
				var elementAux = $("<div class='album'>");
				var imageAlbum = $("<img class='image-album'>").attr("src", album.images[0].url);
				elementAux.append(imageAlbum);
				elementAux.append($("<h1 class='album-name'>").text(album.name));
				//requestTrack(album, element);
				elementAux.on("click", function(){
					requestTrack(album);
				});

				//element.append(elementAux);
				$(".container-artist").append(elementAux);
			});

			/*
			var albumID = response.items[0].id;
			requestTrack(albumID);*/
		},
		error: function (response){
			console.log(response);
		}
	});
}

function requestTrack(album, element){
	$.ajax({
		url: "https://api.spotify.com/v1/albums/"+album.id,
		dataType: "json",
		success: function (response){
			var elementAux = $("<ul class='track-list'>");

			response.tracks.items.forEach(function(song){
				var songElement = $("<li class='track-song'>");
				var songLink = $("<a class='link-song'>").attr("href", song.preview_url);
				songLink.attr("target", "_blank");
				songLink.text(song.name);
				songElement.append(songLink);
				elementAux.append(songElement);

			});
			$(".songtrack-list").empty();
			$(".songtrack-list").append(elementAux);
			//console.log(response.tracks.items[0].preview_url); //recorrerlo con un for
		},
		error: function (response){
			console.log(response);
		}
	});
}

$(document).ready(function(){
	$("#button-search").on("click", function(e){
		e.preventDefault();
		$('.container-artist').empty();
		$('.songtrack-list').empty();
		var artist = $('#input-artist').val();
		requestAjax(artist, "artist");
	});
});



