var Profile = require("./profile.js");
function homeRoute(request, response) {
	if (request.url === '/') {
		response.writeHead(200, {
	        'Content-Type': 'text/plain',
	        'Access-Control-Allow-Origin' : '*'
	    });
	    response.write("Header\n");
	    response.write("Content\n");
	    response.end("Footer\n");
	}
}

function userRoute(request, response) {
	const userName = request.url.replace("/", "");
	if (userName.length > 0) {
		response.writeHead(200, {
	        'Content-Type': 'text/plain',
	        'Access-Control-Allow-Origin' : '*'
	    });
	    response.write("Header\n");
	    
	    var studentProfile = new Profile(userName);
	    studentProfile.on("end", function(profileJson) {

	    	const values = {
	    		avatarUrl : profileJson.gravatar_url,
	    		userName: profileJson.profile_name,
	    		badges: profileJson.badges.length,
	    		javascriptPoints: profileJson.points.JavaScript
	    	}

	    	response.write(values.userName + " has " + values.badges + " badges \n");
	    	response.end("Footer\n");
	    });
	    studentProfile.on("error", function(error) {
	    	response.write(error.message + "\n");
	    	response.end("Footer\n");
	    });
	    
	}
}

module.exports.home = homeRoute;
module.exports.user = userRoute;
