// Load the log4js module and automatically configure it with our configuration file
var log4js = require("log4js"),
    fs = require("fs"),
    _ = require("underscore");

function defaultConfigFileName() {
    return("app-logging.json");
}

function defaultSearchPath() {
    return([ "./", "./config"]);
}

// Returns the path to the configuration file or logs an error to the console
// if none is found
function defaultConfigFileLocator() {
    // allow the environment to override our logic, as per standard log4js
    if (process.env.LOG4JS_CONFIG)
        return(process.env.LOG4JS_CONFIG);

    var foundPath = _(defaultSearchPath()).find(function(path) {
        return(fs.existsSync(path + "/" + defaultConfigFileName()))
    })

    if(foundPath)
        return(foundPath + "/" + defaultConfigFileName())
    else {
        console.error("Can't locate default log4js config file " + defaultConfigFileName() +
            " in any of the pre-defined paths: " + defaultSearchPath());
        return(undefined);
    }
}

module.exports = (function(locateConfigFileFn) {
    var initialized = false;

    return({
        /**
         * Main method that configures log4js using the default log file, if found
         * in any of the standard folders, and returns a logger
         */
        get: function(categoryName) {
            if(!initialized)
                this.init();

            return(log4js.getLogger(categoryName));
        },

        /**
         * This alternative method can be used to configure log4js with a .json file that is not
         * located in one of the standard folders or that uses a non-standard name. Please note that
         * initialization only needs to happen once, and that log4js remains configured across
         * all subsequent imports of this module.
         *
         * In normal circumstances the default settings should be sufficient.
         */
        init: function(locateConfigFileFn) {
            if(locateConfigFileFn == undefined)
                log4js.configure(locateConfigFileFn());
            else
                log4js.configure(arguments[0]());

            initialized = true;

            return(this);
        },

        // Expose the log4js object in case it's needed
        log4js: log4js
    })
})(defaultConfigFileLocator);