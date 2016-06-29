function loadJSON(){
	$.ajax({
		url: "./json/users.jsonp",
		jsonpCallback: "loadUsers",
		type: "GET",
		dataType: "jsonp",
		crossDomain: true,

		success: function (response){
			var users = [];
			
			for(var i = 0; i<response.users.length; i++){
				users.push(response.users[i]);
			}
			checkUsers(users);
		},
		error: function (response){
			console.log(response);
		}
	});
}

function checkUsers(users){	
	
	var name = $("#input-name").val();
	var password = $("#input-password").val();

	for(var i = 0; i<users.length; i++){
		if(name == users[i].name && password == users[i].password){
			var user = {"name": name, "password": password};
			window.localStorage.setItem("userLogin", JSON.stringify(user));
			window.open ('index.html',"_self");
			return;
		}
	}
}

$(document).ready(function(){
	$("#button-login").on("click", function(e){
		e.preventDefault();
		loadJSON();
	});
});