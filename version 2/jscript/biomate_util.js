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