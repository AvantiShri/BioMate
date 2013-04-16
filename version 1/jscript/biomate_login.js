$(document).ready(function(){
	$(".errorMessage").hide();
	$("#btnSignIn").click(function() {
		userName = $("#userName").val();
		userPassword = $("#userPassword").val();
		
		if ((!userName)|| (!userPassword)) {
			//err.innerHTML = "Fill in the details";
			$(".errorMessage").show();
		}
		else {
			if ((userName !="alpha") ||(userPassword !="beta")) {
				$(".errorMessage").show();
			}
			else {
				//here i want to load my selectOption.html file ?
				window.location = "biomate_home.html"
				console.log('Correct!!!');
			}              
		}
		return false;
	});
});