$.extend({
    getUrlVars : function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(
                window.location.href.indexOf('?') + 1).split('&');
        for ( var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar : function(name) {
        return $.getUrlVars()[name];
    }
});

var dateToStringForHistory = function(date) {
    var today = new Date();
    var dateStr = "";
    if(date.getFullYear() === today.getFullYear() &&
       date.getMonth() === today.getMonth() &&
       date.getDate() === today.getDate()) {
	hrDiff = today.getHours() - date.getHours();
	minDiff = today.getMinutes() - date.getMinutes();
	if(hrDiff != 0){
		dateStr = hrDiff + " hour";
		if(hrDiff > 1)
			dateStr += "s";
		dateStr += " ago";
	}
	else if(minDiff != 0){
		dateStr = minDiff + " minute";
		if(minDiff > 1)
			dateStr += "s";
		dateStr += " ago";
	}
	else{
		dateStr = "Just now";
	}
    }
    else {
        dateStr = (date.getMonth()+1) + "/" + 
            date.getDate() + "/" + 
            date.getFullYear();
    }

    return dateStr;
}

var dateToString = function(date) {
    var today = new Date();
    var dateStr = "";
    if(date.getFullYear() === today.getFullYear() &&
       date.getMonth() === today.getMonth() &&
       date.getDate() === today.getDate()) {
	dateStr = date.getHours() + ":" + 
            date.getMinutes() + ":" + 
            date.getSeconds();
    }
    else {
        dateStr = (date.getMonth()+1) + "/" + 
            date.getDate() + "/" + 
            date.getFullYear();
    }

    return dateStr;
}
