sap.ui.define([
	"sap/ui/core/UIComponent",
	"aplicacao/model/models"
], function (UIComponent,models) {
	"use strict";

	return UIComponent.extend("aplicacao.Component", {

		metadata : {
			manifest: "json"
		},

		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// additional initialization can be done here
			this.getRouter().initialize();
			
			
			// var oModel = new sap.ui.model.json.JSONModel("./model/Menu.json");
			//this.setModel(oModel,"Menu");
    		
    		
    	   // set the device model
			this.setModel(models.createDeviceModel(), "device");

    	   // set the helper model
			this.setModel(models.createHelperModel(), "helper");
		}
	});
});