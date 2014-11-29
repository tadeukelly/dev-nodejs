var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MenuSchema   = new Schema({
	menu: String
});

module.exports = mongoose.model('Menu', MenuSchema,'menu');


