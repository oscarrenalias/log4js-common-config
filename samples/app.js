var logger = require("../lib/logger");

// You can play with configuration in file app-logging.json in the root of this ap
var log = logger.get("net.renalias.log4js.sample");
log.info("This is logged with INFO priority");
log.warn("This is logged with WARN priority");
log.error("This is logged with ERROR priority");
log.debug("This is logged with DEBUG priority");