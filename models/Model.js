var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

/*
 *  Dashboard models.  The id, name and user are saved within the model
 *  as the framework just gives the model in $scope.$on('adfDashboardChanged'
 */
var ModelSchema   = new Schema({
	user: String,
    model: {}
});

module.exports = mongoose.model('Model', ModelSchema, 'Model');