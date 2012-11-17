var htmlizer = require("./htmlizer");
var ig = require("./instagehrm");

htmlizer.regenAll(ig.imageDataFolder, ig.generatedHTMLFolder);
