const fs = require('fs');
const loggerUtils = require('../utils/loggerUtils');
let Permissions = {};

exports.init = () => {

    //load custom permissions
    try{
        Permissions = require("../../config/permissions.json");
    } catch(e){
        Permissions.global = {};
        Permissions.users = {};

        try {

            if (fs.lstatSync("./config/permissions.json").isFile()) {
                loggerUtils.warning("permissions.json found but we couldn't read it!\n" + e.stack);
            }

        } catch (e2){
            fs.writeFile("./config/permissions.json", JSON.stringify(Permissions, null, 2));
        }

    }

};

exports.checkPermission = (user,permission) => {
    try {
        let allowed = true;
        try{
            if(Permissions.global.hasOwnProperty(permission)){
                allowed = Permissions.global[permission] === true;
            }
        } catch(e){}

        try{
            if(Permissions.users[user.id].hasOwnProperty(permission)){
                allowed = Permissions.users[user.id][permission] === true;
            }
        } catch(e){}

        return allowed;

    } catch(e){}

    return false;
};