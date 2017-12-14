function iqAuthLoginCallback(result) {
    if (result.loggedIn) {
        $("#resultDivContainer").html("Successful Login");
    } else {
        $("#resultDivContainer").html("Login Error");
    }
    // might execute ProcessItems once again
}