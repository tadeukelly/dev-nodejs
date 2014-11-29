var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BusOrgSchema   = new Schema({	
	objid: Number,
	org_id: String,
	name: String,
	type: String,
	alt_name: String,
	x_cnae: String,
	x_cnpj: String,
	x_documento_1: String,
	x_documento_2: String,
	x_documento_3: String,
	x_tipo_documento_1: String,
	x_tipo_documento_2: String,
	x_tipo_documento_3: String,
	x_mercado: String,
	x_nrc: String,
	x_nrc_associador: String,
	x_segmento: String,
	x_tipo_pessoa: String,
	x_insc_estadual: String,
	x_sexo: String,
	x_dt_nasc: Date
});

module.exports = mongoose.model('BusOrg', BusOrgSchema,'table_bus_org');