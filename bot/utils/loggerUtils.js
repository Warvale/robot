const chalk = require('chalk');

let loggerUtils = new function () {

    this.setPrefix = function (prefix) {
        this.prefix = prefix;
    };

    this.getPrefix = function () {
        return this.prefix;
    };

    this.warning = function (message) {
        console.log(this.getPrefix() + chalk.styles.yellow.open + '[Warning] ' + chalk.styles.yellow.close + message);
    };

    this.error = function (message) {
        console.error(this.getPrefix() + chalk.styles.red.open + '[Error] ' + chalk.styles.red.close + message);
    };

    this.info = function (message) {
        console.info(this.getPrefix() + chalk.styles.blue.open + '[Info] ' + chalk.styles.blue.close + message);
    };

};

module.exports = loggerUtils;