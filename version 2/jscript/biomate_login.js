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
			if (userName =="alpha" && userPassword =="beta"){
				//here i want to load my selectOption.html file ?
				window.location = "biomate_home_lab.html"
				console.log('Correct Lab!!!');
			}
			else if (userName =="gamma" && userPassword =="delta"){
				//here i want to load my selectOption.html file ?
				window.location = "biomate_home_comp.html"
				console.log('Correct Lab!!!');
			}
			else{
				$(".errorMessage").show();
			}
		}
		return false;
	});
});