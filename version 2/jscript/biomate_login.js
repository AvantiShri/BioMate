Parse.$ = jQuery;
Parse.initialize("tFiHdHJHbyxrNdkAmCPjisX3ezUdfURfqPDUH85C", "Z7yWpLNyF0enW6oyX7VaN4iBArhgM9ZASwZMl4va");

$(document).ready(function(){
				   
	$("#btnSignUp").click(function() {
		window.location="biomate_signup.html";
	});
	$("#btnSignIn").click(function() {
		userName = $("#userName").val();
		userPassword = $("#userPassword").val();
		
		Parse.User.logIn(userName, userPassword, {
		  success: function(user) {
			// Do stuff after successful login.
			window.location = "biomate_home_lab.html";
		  },
		  error: function(user, error) {
			// The login failed. Check error to see why.
			self.$("#err").html(error.message).show();
		  }
		});
		return false;
	});
	$("#send").click(function(e){
		email = $("#userEmail").val();
		alert(email);
		Parse.User.requestPasswordReset(email, {
			success: function() {
				alert("Password reset request was sent successfully");
				self.$("#trouble").modal('hide');
			},
			error: function(error) {
				// Show the error message somewhere
				self.$("#sendErr").html(error.message).show();
			}
		});
	});
});
