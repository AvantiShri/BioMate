Parse.$ = jQuery;
Parse.initialize("tFiHdHJHbyxrNdkAmCPjisX3ezUdfURfqPDUH85C", "Z7yWpLNyF0enW6oyX7VaN4iBArhgM9ZASwZMl4va");

$(function(){	
	$("#btnSignUp").click(function(e){
		
		var email = $("#email").val();
		var password = $("#passwd").val();
		
		var user = new Parse.User();
		user.set("username", email);
		user.set("password", password);
		user.set("email", email);
		  
		Parse.User.signUp(email, password, { ACL: new Parse.ACL() },{
		  success: function(user) {
			$('#success').modal('show')
			//window.location = "biomate_login.html";
		  },
		  error: function(user, error) {
			// Show the error message somewhere and let the user try again.
			self.$("#err").html(error.message).show();
		  }
		});
		
		return false;
	});
	$("#close1").click(function(e){
		window.location = "biomate_login.html";
	});
	$("#close2").click(function(e){
		window.location = "biomate_login.html";
	});
});
