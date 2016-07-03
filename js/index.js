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
				$('.container-artist').empty();
				response.artists.items.forEach(function(artist){
					console.log(artist);
					var element = $("<div class='artist col s4'>");
					var nameArtist = $("<h1 class='name-artist'>").text(artist.name);
					element.append(nameArtist);
					console.log(artist.images[0].url);
					var imageArtist = $("<img class='image-artist'>").attr("src", artist.images[0].url);
					element.append(imageArtist);
					var artistID = artist.id;
					element.on("click", function(){
						requestAjax(artistID, "album");
					});

					$('.container-artist').append(element);
				});

			}else if(call == "album"){
				$('.container-album').empty();
				response.items.forEach(function (album){
					var elementAux = $("<div class='album col s4'>");
					var imageAlbum = $("<img class='image-album'>").attr("src", album.images[0].url);
					elementAux.append($("<h1 class='album-name'>").text(album.name));
					elementAux.append(imageAlbum);

				elementAux.on("click", function(){
					requestAjax(album.id,"track");
				});

				$(".container-album").append(elementAux);
			});

			}else if(call == "track"){
				var elementAux = $("<ul class='track-list'>");
				response.tracks.items.forEach(function(song){
					var songElement = $("<li class='track-song'>");
					var songLink = $("<p class='link-song' style='display:inline-block;margin-right:1em;'>");
					var songFavIcon = $("<a class='btn-floating btn-small waves-effect waves-light lightgreen' style='float:right;'>");
					var songIcon = $("<i class='material-icons'>").text("add");
					songFavIcon.append(songIcon);
					
					songFavIcon.on("click", function(){
						var listSongs = JSON.parse(window.localStorage.getItem('song-list')) || {};
						var currentUser = JSON.parse(window.localStorage.getItem('userLogin'));

						var userListSong = listSongs[currentUser.name] || {};
						userListSong[song.name] = song.uri;
						listSongs[currentUser.name] = userListSong;

						window.localStorage.setItem("song-list", JSON.stringify(listSongs));
					});

					songLink.text(song.name);
					songLink.on("click", function(){
						$('iframe').attr("src", "https://embed.spotify.com/?uri="+song.uri);
					});
					songElement.append(songLink);
					songElement.append(songFavIcon);
					
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

function getFavouriteList(){
	var listSongs = JSON.parse(window.localStorage.getItem('song-list')) || {};
	var currentUser = JSON.parse(window.localStorage.getItem('userLogin'));
	var userListSong = listSongs[currentUser.name] || {};

	console.log(userListSong);
	var elementAux = $("<ul class='track-list'>");

	Object.keys(userListSong).forEach(function (song){
		var songElement = $("<li class='track-song'>");
		var songLink = $("<p class='link-song' style='display:inline-block;margin-right:1em;'>");
		songLink.text(song);
		songElement.append(songLink);
		songLink.on("click", function(){
			$('iframe').attr("src", "https://embed.spotify.com/?uri="+userListSong[song]);
		});

		$(elementAux).append(songElement);
	});
	
	$('.songtrack-list').append(elementAux);
}

$(document).ready(function(){
	$("#button-search").on("click", function(e){
		e.preventDefault();
		$('.container-artist').empty();
		$('.songtrack-list').empty();
		var artist = $('#input-artist').val();
		requestAjax(artist, "artist");
	});

	$("#button-fav-list").on("click", function(e){
		$('.songtrack-list').empty();
		getFavouriteList();
	});
});