sap.ui.define([
	"aplicacao/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/m/Input"
], function(BaseController, MessageBox) {
	"use strict";
	
	//Modulo de função : ZSDGF005
	// ZSDMF_OBTEM_CAB_ORDEM Obtém o cabeçalho da ordem 
	// ZSDMF_OBTEM_ITENS_ORDEM Obtém os itens da Ordem 
	// ZSDMF_OBTEM_LOGIN_SENHA Busca login e senha cadastrado na tabela 
	// ZSDMF_SET_ITENS_ORDEM Adiciona um novo item na ordem 
	// ZSDMF_SET_PICKING_ITENS Set picking nos itens da remessa 
	// ZSDMF_SET_PICKING_ITENS_GET GET DO ITEM QUE ESTÁ INSERINDO PICKING 
	// ZSDMF_VALIDACAO_REMESSA Valida se houve separação da remessa 


	return BaseController.extend("aplicacao.controller.App", {

		onInit: function() {
			
		},

		onAfterRendering: function() {

		},

		handlePressHome: function() {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Menu");
		},
		
		handleLogoffPress: function() {
			
		}
	});
});