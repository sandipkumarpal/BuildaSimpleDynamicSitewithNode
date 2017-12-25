var Profile = require("./profile.js");
const rendered = require('./rendered.js');
const queryString = require('querystring');

const contentHeader = {'Content-Type': 'text/html'};



function homeRoute(request, response) {
	if (request.url === '/') {
		if (request.method.toLowerCase() === "get") {
			response.writeHead(200, {
		        contentHeader,
		        'Access-Control-Allow-Origin' : '*'
		    });
	    
	    	rendered.view("header", {}, response);
		    rendered.view("search", {}, response);
		    rendered.view("footer", {}, response);
		    response.end();
	    } else {
	    	request.on("data", function(postBody) {
	    		console.log(postBody.toString());
	    		const query = queryString.parse(postBody.toString());
	    		response.writeHead(303, {"location": "/" + query.username});
	    		response.end();
	    	});
	    }
	}
}

function userRoute(request, response) {
	const userName = request.url.replace("/", "");
	if (userName.length > 0) {
		response.writeHead(200, {
	        contentHeader,
	        'Access-Control-Allow-Origin' : '*'
	    });
	    rendered.view("header", {}, response);
	    
	    var studentProfile = new Profile(userName);
	    studentProfile.on("end", function(profileJson) {

	    	const values = {
	    		avatarUrl : profileJson.gravatar_url,
	    		userName: profileJson.profile_name,
	    		badges: profileJson.badges.length,
	    		javascriptPoints: profileJson.points.JavaScript
	    	}

	    	// response.write(values.userName + " has " + values.badges + " badges \n");
	    	rendered.view("profile", values, response);
	    	rendered.view("footer", {}, response);
	    	response.end();
	    });
	    studentProfile.on("error", function(error) {
	    	rendered.view("error", {errorMessage: error.message}, response);
	    	rendered.view("search", {}, response);
	    	rendered.view("footer", {}, response);
	    	response.end();
	    });
	    
	}
}

module.exports.home = homeRoute;
module.exports.user = userRoute;
