import Cookies from 'js-cookie';

var UserProfile = (function() {
    var login = "";
    const username_variable = 'username';

    var clear = function () {
        // Clear cookies and reset values
        Cookies.remove(username_variable);
        login = "";
    };
    

    var get = function() {
        return login;
    };

    var set = function (user) {
        login = user;

        // Set cookies
        Cookies.set(username_variable, user);
    };

      // Initialize with values from cookies if available
    if (Cookies.get(username_variable)){
        login = Cookies.get(username_variable);
    }
    
    return {
        get: get,
        set: set,
        clear: clear
    };
})();

export default UserProfile;