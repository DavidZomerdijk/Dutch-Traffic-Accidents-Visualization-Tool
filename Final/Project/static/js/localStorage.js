function updateLocalStorage(){//itemName, itemValue) {

    //document.getElementById("result").innerHTML = localStorage.getItem("lastname");
    //} else {
    //document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";

    localStorage.setItem("lastname", "Smith");
    localStorage.setItem("noord holland", "23 accidents");
    localStorage.setItem("friesland", "33 accidents");
    //$("history").innerHTML("New text");
    document.getElementById("history").innerHTML = "<p><strong>History</strong></p>" + "Hello its me";
 }