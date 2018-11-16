sap.ui.define([
	"aplicacao/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/ui/Device"
], function(BaseController, Controller, MessageBox, MessageToast, JSONModel, DateFormat, Device) {

	"use strict";
	var vetorItens = [];

	return BaseController.extend("aplicacao.controller.Conferencia", {

		onInit: function() {
			this.getRouter().getRoute("Conferencia").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {

			var oModel = new sap.ui.model.json.JSONModel({
				totalItens: "",
				totalItensLidos: "",
				usuario: "",
				codDistribuidora: "",
				nomeDistribuidora: "",
				dataCarregamento: "",
				pesoTotal: "",
				pesoLiquido: "",
				remessa: "",
				quantidadeItens: "",
				quantidadeItensLidos: "",
				ultimoItemBipado: "",
				localExpedicao: "",
				centro: "",
				retorno: ""
			});

			this.getOwnerComponent().setModel(oModel, "modelCabecalhoOrdem");

			this.onResetaTela();
		},

		onRemessa: function() {
			var that = this;
			var barcodeFicha = this.byId("idRemessa").getValue();

			barcodeFicha = barcodeFicha.replace(/'/g, ""); //"'

			if (barcodeFicha != "") {
				this.byId("idTableItens").setBusy(true);
				that.onBuscaRemessa(barcodeFicha);
			}
		},

		onDialogClose: function() {

			if (this._ItemDialog) {
				this._ItemDialog.destroy(true);
			}

			this.byId("idTableItens").setBusy(false);

		},

		onBuscaRemessa: function(barcodeFicha) {
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel({
				serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/",
				user: "appadmin",
				password: "sap123"
			});

			oModel.read("/BuscaCabecalhoOrdem(GV_BARCODEFICHA='" + barcodeFicha + " ')", {
				success: function(retornoCabecalho) {

					if (retornoCabecalho.Lv_Retorno == "OK") {

						var IconeCabecalhoError = "sap-icon://decline";
						var StatusCabecalhoError = "Error";

						var IconeCabecalhoSuccess = "sap-icon://accept";
						var StatusCabecalhoSuccess = "Success";

						//status Ficha Conferida
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaConferida", retornoCabecalho.FichaConferida);
						if (retornoCabecalho.FichaConferida == "true") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaConferida_Icone", IconeCabecalhoSuccess);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaConferida_Status", StatusCabecalhoSuccess);

						} else if (retornoCabecalho.FichaConferida == "false") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaConferida_Icone", IconeCabecalhoError);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaConferida_Status", StatusCabecalhoError);

						}

						//status Ficha Etiq Impressa 
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaEtiqImpressa", retornoCabecalho.FichaEtiqImpressa);
						if (retornoCabecalho.FichaEtiqImpressa == "true") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaEtiqImpressa_Icone", IconeCabecalhoSuccess);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaEtiqImpressa_Status",
								StatusCabecalhoSuccess);

						} else if (retornoCabecalho.FichaEtiqImpressa == "false") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaEtiqImpressa_Icone", IconeCabecalhoError);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaEtiqImpressa_Status", StatusCabecalhoError);

						}

						//status Remessa Finalizada
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFinalizarFicha", retornoCabecalho.SaidaMercadoria);
						if (retornoCabecalho.SaidaMercadoria == "true") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusRemessaFinalizada_Icone", IconeCabecalhoSuccess);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusRemessaFinalizada_Status",
								StatusCabecalhoSuccess);

						} else if (retornoCabecalho.SaidaMercadoria == "false") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusRemessaFinalizada_Icone", IconeCabecalhoError);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusRemessaFinalizada_Status", StatusCabecalhoError);

						}

						//status Ficha Finalizada
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaFinalizada", retornoCabecalho.FichaFinalizada);
						if (retornoCabecalho.FichaFinalizada == "true") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaFinalizada_Icone", IconeCabecalhoSuccess);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaFinalizada_Status", StatusCabecalhoSuccess);

						} else if (retornoCabecalho.FichaFinalizada == "false") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaFinalizada_Icone", IconeCabecalhoError);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaFinalizada_Status", StatusCabecalhoError);

						}

						//status Ficha Picking
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaPicking", retornoCabecalho.FichaPicking);
						if (retornoCabecalho.FichaPicking == "true") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaPicking_Icone", IconeCabecalhoSuccess);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaPicking_Status", StatusCabecalhoSuccess);

						} else if (retornoCabecalho.FichaPicking == "false") {

							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaPicking_Icone", IconeCabecalhoError);
							that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaPicking_Status", StatusCabecalhoError);

						}

						var dataCarregamento = retornoCabecalho.Lddat.split("T");
						dataCarregamento = dataCarregamento[0].split("-");
						dataCarregamento = dataCarregamento[2] + " - " + dataCarregamento[1] + " - " + dataCarregamento[0];

						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/totalItens", retornoCabecalho.Anzpk);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/totalItensLidos", retornoCabecalho.Anzpk2);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/usuario", retornoCabecalho.Ernam);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/codDistribuidora", retornoCabecalho.Kunnr);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/nomeDistribuidora", retornoCabecalho.Name1);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/dataCarregamento", dataCarregamento);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/pesoTotal", retornoCabecalho.Btgew);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/pesoLiquido", retornoCabecalho.Ntgew);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/barcodeFicha", barcodeFicha);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/remessa", retornoCabecalho.Vbeln);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/quantidadeItens", retornoCabecalho.Vemng);
						// that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/quantidadeItensLidos", );
						// that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/ultimoItemBipado", );
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/localExpedicao", retornoCabecalho.Vstel);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/nomeFilial", retornoCabecalho.Filial);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/centro", retornoCabecalho.Werks);
						that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/retorno", retornoCabecalho.Lv_Retorno);

						// that.byId("idCodDistribuidora").setValue(retornoCabecalho.Kunnr);
						// that.byId("idNomeDistribuidora").setValue(retornoCabecalho.Name1);
						// that.byId("idDataCarregamento").setValue(retornoCabecalho.Lddat);
						// that.byId("idLocalExpedicao").setValue(retornoCabecalho.Vstel);
						that.byId("idNumVolume").setValue(retornoCabecalho.Anzpk);
						// that.byId("idUltimoItemBipado").setValue();
						// that.byId("idUsuario").setValue(retornoCabecalho.Ernam);
						// that.byId("idPesoLiq").setValue(retornoCabecalho.Ntgew + "KG");
						// that.byId("idPesoTotal").setValue(retornoCabecalho.Btgew + "KG");
						// that.byId("idLote").setValue();
						// that.byId("idQtdItens").setValue(retornoCabecalho.Vemng);
						// that.byId("idQntLidos").setValue(retornoCabecalho.VemngLidos);
						// that.byId("idQntLote").setValue();
						// that.byId("idQntPicks").setValue(retornoCabecalho.VemngPick);
						// that.byId("idVolumeLidos").setValue(retornoCabecalho.Anzpk2);

						oModel.read("/BuscaItensFicha?$filter=GV_BARCODEFICHA eq '" + barcodeFicha + "'", {
							success: function(retornoItens) {
								vetorItens = [];

								for (var i = 0; i < retornoItens.results.length; i++) {

									var statusPicking = retornoItens.results[i].Xpicking;

									if (statusPicking == "X") {

										var StatusText = "Efetivado";
										var Icone = "sap-icon://accept";
										var Status = "Success";

									} else {

										StatusText = "Não Efetivado";
										Icone = "sap-icon://decline";
										Status = "Error";
									}

									var seq = parseInt(retornoItens.results[i].Seq);
									var itemRemessa = parseFloat(retornoItens.results[i].Posnr);
									that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/ultimoItemBipado", retornoItens.results[i].Matnr);
									that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/quantidadeItensLidos", retornoItens.results.length);
									that.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/lote", retornoItens.results[i].Charg);

									var item = {
										NumVolumes: retornoItens.results[i].Anzpk,
										NumOrdem: retornoItens.results[i].Aufnr,
										NumMaterialAntigo: retornoItens.results[i].Bismt,
										NumLote: retornoItens.results[i].Charg,
										ErroPick: retornoItens.results[i].ErroPick,
										Impressao: retornoItens.results[i].Impressao,
										NumDeposito: retornoItens.results[i].Lgnum,
										PosicaoDeposito: retornoItens.results[i].Lgpla,
										TipoDeposito: retornoItens.results[i].Lgtyp,
										// Retorno: retornoItens.results[i].Lv_Retorno,
										DescMaterial: retornoItens.results[i].Maktx,
										NumMaterial: retornoItens.results[i].Matnr,
										ItemRemessa: itemRemessa,
										SemCaixa: retornoItens.results[i].Sem_Caixa,
										Remessa: retornoItens.results[i].Vbeln,
										QntBasicaEmbalada: retornoItens.results[i].Vemng,
										MaterialEmbalagem: retornoItens.results[i].Vhilm,
										Picking: retornoItens.results[i].Xpicking,
										BarcodeFicha: barcodeFicha,
										Icone: Icone,
										StatusText: StatusText,
										Status: Status,
										QtdeConferida: parseInt(retornoItens.results[i].QtdeConferida),
										QtdeDiferenca: parseInt(retornoItens.results[i].QtdeDiferenca),
										QuantFornecida: parseInt(retornoItens.results[i].QuantFornecida),
										linhaVerde: String(parseInt(retornoItens.results[i].QtdeDiferenca)),
										linhaBranca: String(parseInt(retornoItens.results[i].QtdeConferida)),
										linhaAmarela: "1"
									};

									vetorItens.push(item);
								}

								var oModel1 = new sap.ui.model.json.JSONModel(vetorItens);
								that.getView().setModel(oModel1, "ItensConference");
								that.byId("idTableItens").setBusy(false);

							},
							error: function(errorLog) {
								that.byId("idTableItens").setBusy(false);
								that.onMensagemErroODATA(errorLog.response.statusCode);
							}
						});

					} else {
						sap.m.MessageBox.show(
							retornoCabecalho.Lv_Retorno, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Atenção !!",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									that.byId("idTableItens").setBusy(false);
								}
							}
						);
					}
				},
				error: function(errorLog) {
					that.byId("idTableItens").setBusy(false);
					that.onMensagemErroODATA(errorLog.response.statusCode);
				}
			});
		},

		onLeitor: function() {
			var that = this;
			var codLeitor = this.byId("idLeitor").getValue();
			var barcodeFicha = this.getOwnerComponent().getModel("modelCabecalhoOrdem").getProperty("/barcodeFicha");
			var centro = this.getOwnerComponent().getModel("modelCabecalhoOrdem").getProperty("/centro");
			this.byId("idTableItens").setBusy(true);

			var oModelLeitor = new sap.ui.model.odata.v2.ODataModel({
				serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/"

			});

			// oModelLeitor.read("/InserirItensOrdem(GV_VBELN='" + remessa + "',GV_BARCODE='" + codLeitor + "',GV_WERKS='" + centro + "')", {
			//$filter=Lv_Status eq 'Ação do cliente'
			oModelLeitor.read("/InserirItensOrdem(Gv_BarcodeFicha='" + barcodeFicha + "',Gv_Barcode='" + codLeitor + "',Gv_Werks='" + centro +
				"')", {
					success: function(retorno) {

						if (retorno.EvRettyp == "E") {

							if (!that._CreateMaterialFragment) {

								that._ItemDialog = sap.ui.xmlfragment(
									"aplicacao.view.Error",
									that
								);
								that.getView().addDependent(that._ItemDialog);
							}
							that._ItemDialog.open();
							sap.ui.getCore().byId("idDialog").setInitialFocus("idMsg");
							sap.ui.getCore().byId("idMsg").setText(retorno.EvReturn);

						} else if (retorno.EvRettyp == "S") {

							that.onBuscaRemessa(barcodeFicha);
							that.byId("idLeitor").setValue();
						}
					},
					error: function(errorLog) {

						that.byId("idTableItens").setBusy(false);
						console.log(errorLog.responseText);
						that.onMensagemErroODATA(errorLog.response.statusCode);

					}
				});
		},

		onResetaTela: function() {
			vetorItens = [];

			var oModel1 = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel1, "ItensConference");

			this.byId("idCodDistribuidora").setValue();
			this.byId("idNomeDistribuidora").setValue();
			this.byId("idDataCarregamento").setValue();
			this.byId("idLocalExpedicao").setValue();
			this.byId("idNumVolume").setValue();
			this.byId("idUltimoItemBipado").setValue();
			this.byId("idPesoLiq").setValue();
			this.byId("idPesoTotal").setValue();
			// this.byId("idUsuario").setValue();
			// this.byId("idLote").setValue();
			// this.byId("idQtdItens").setValue();
			// this.byId("idQntLote").setValue();
			// this.byId("idQntLidos").setValue();
			// this.byId("idQntPicks").setValue();
			// this.byId("idVolumeLidos").setValue();
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/barcodeFicha", "");

			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/totalItens", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/totalItensLidos", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/usuario", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/codDistribuidora", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/nomeDistribuidora", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/dataCarregamento", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/pesoTotal", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/pesoLiquido", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/remessa", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/quantidadeItens", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/quantidadeItensLidos", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/ultimoItemBipado", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/localExpedicao", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/nomeFilial", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/centro", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/retorno", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaPicking_Icone", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaPicking_Status", "None");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaFinalizada_Icone", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaFinalizada_Status", "None");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaEtiqImpressa_Icone", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaEtiqImpressa_Status", "None");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaConferida_Icone", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusFichaConferida_Status", "None");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusRemessaFinalizada_Icone", "");
			this.getOwnerComponent().getModel("modelCabecalhoOrdem").setProperty("/statusRemessaFinalizada_Status", "None");

			this.byId("idTableItens").setBusy(false);

			this.byId("idRemessa").setValue();
			this.byId("idRemessa").focus();

		},

		onPicking: function() {
			var that = this;
			var barcodeFicha = this.byId("idRemessa").getValue();

			if (barcodeFicha != "") {

				that.byId("idTableItens").setBusy(true);
				var oModel = new sap.ui.model.odata.ODataModel({
					serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/",
					user: "appadmin",
					password: "sap123"
				});
				oModel.read("/InserirPickingItens(IvBarcodeFicha='" + barcodeFicha + "')", {
					success: function(retorno) {

						if (retorno.EvRettyp == "E") {

							sap.m.MessageBox.show(
								retorno.EvReturn, {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Picking não Finalizado!",
									actions: [sap.m.MessageBox.Action.OK],
									onClose: function(oAction) {
										that.onBuscaRemessa(barcodeFicha);
										that.byId("idTableItens").setBusy(false);
									}
								}
							);
						} else if (retorno.EvRettyp == "S") {

							sap.m.MessageBox.show(
								retorno.EvReturn, {
									icon: sap.m.MessageBox.Icon.SUCCESS,
									title: "Picking Finalizado!",
									actions: [sap.m.MessageBox.Action.OK],
									onClose: function(oAction) {
										that.onBuscaRemessa(barcodeFicha);
										that.byId("idTableItens").setBusy(false);
									}
								}
							);

							that.byId("idTableItens").setBusy(false);
						}
					},
					error: function(errorLog) {
						that.byId("idTableItens").setBusy(false);
						that.onMensagemErroODATA(errorLog.response.statusCode);
					}
				});
			}
		},

		onFinalizaFicha: function() {
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel({
				serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/",
				user: "appadmin",
				password: "sap123"
			});

			var barcodeFicha = this.getOwnerComponent().getModel("modelCabecalhoOrdem").getProperty("/barcodeFicha");

			if (barcodeFicha != "") {

				this.byId("idTableItens").setBusy(true);
				oModel.read("/FinalizaFicha(IvBarcodeFicha='" + barcodeFicha + "')", {
					success: function(retorno) {

						if (retorno.EvRettyp == "S") {

							sap.m.MessageBox.show(
								"Ficha finalizada com sucesso!", {
									icon: sap.m.MessageBox.Icon.SUCCESS,
									title: "Finalização da Ficha!",
									actions: [sap.m.MessageBox.Action.OK],
									onClose: function(oAction) {
										that.onBuscaRemessa(barcodeFicha);
										that.byId("idTableItens").setBusy(false);
									}
								}
							);
						} else {

							MessageBox.show("Você deseja Finaizar a ficha incompleta?", {
								icon: MessageBox.Icon.QUESTION,
								title: "Confirmação.",
								actions: [MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
								onClose: function(oAction) {
									if (oAction == sap.m.MessageBox.Action.YES) {
										that.onFinalizaFichaIncompleta();
									} else {
										that.byId("idTableItens").setBusy(false);
									}
								}
							});
						}
					},
					error: function(errorLog) {
						that.byId("idTableItens").setBusy(false);
						that.onMensagemErroODATA(errorLog.response.statusCode);
					}
				});
			}
		},

		onFinalizaFichaIncompleta: function() {
			var that = this;

			var oModel = new sap.ui.model.odata.ODataModel({
				serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/",
				user: "appadmin",
				password: "sap123"
			});

			var barcodeFicha = this.getOwnerComponent().getModel("modelCabecalhoOrdem").getProperty("/barcodeFicha");

			oModel.read("/FinalizaFichaIncompleta(IvBarcodeFicha='" + barcodeFicha + "')", {
				success: function(retorno) {

					if (retorno.EvRettyp == "S") {

						sap.m.MessageBox.show(
							"Ficha finalizada com sucesso!", {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Finalização da Ficha!",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									that.onBuscaRemessa(barcodeFicha);
									that.byId("idTableItens").setBusy(false);
								}
							}
						);
					} else {
						sap.m.MessageBox.show(
							"Ficha Incompleta!", {
								icon: sap.m.MessageBox.Icon.QUESTION,
								title: "Deseja realmente finalizar a ficha incompleta ?",
								actions: [sap.m.MessageBox.Action.YES][sap.m.MessageBox.Action.NO],
								onClose: function(oAction) {
									if (oAction == sap.m.MessageBox.Action.YES) {

										that.byId("idTableItens").setBusy(false);
										// that.onFinalizaFichaIncompleta();

									} else {

										that.byId("idTableItens").setBusy(false);

									}
								}
							}
						);
					}
				},
				error: function(errorLog) {
					that.byId("idTableItens").setBusy(false);
					that.onMensagemErroODATA(errorLog.response.statusCode);
				}
			});
		},

		onPrinting: function() {
			var that = this;
			var barcodeFicha = this.byId("idRemessa").getValue();
			this.byId("idTableItens").setBusy(true);

			var oModel = new sap.ui.model.odata.ODataModel({
				serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/",
				user: "appadmin",
				password: "sap123"
			});

			oModel.setUseBatch(false);

			var vbeln = barcodeFicha.substring(0, 10);
			var ficha = barcodeFicha.substring(10, 13);

			oModel.read("/ImpressoesEtiquetas(INrficha='" + ficha + "',IVbeln='" + vbeln + "')", {
				success: function(retorno) {

					if (retorno.ERetorno == "I") {

						sap.m.MessageBox.show(
							"Etiqueta de impressão gerada com sucesso!", {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Impressão da etiqueta!",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									that.onBuscaRemessa(barcodeFicha);
									that.byId("idTableItens").setBusy(false);
								}
							}
						);
					} else {
						sap.m.MessageBox.show(
							"Falha ao gerar a etiqueta!", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Impressão da etiqueta!",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									that.byId("idTableItens").setBusy(false);
								}
							}
						);
					}
				},
				error: function(errorLog) {
					that.byId("idTableItens").setBusy(false);
					that.onMensagemErroODATA(errorLog.response.statusCode);
				}
			});
		},

		onFinalizaRemessa: function() {

			var that = this;
			var barcodeFicha = this.getOwnerComponent().getModel("modelCabecalhoOrdem").getProperty("/barcodeFicha");

			if (barcodeFicha != "") {

				this.byId("idTableItens").setBusy(true);
				var oModel = new sap.ui.model.odata.ODataModel({
					serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/",
					user: "appadmin",
					password: "sap123"
				});

				oModel.read("/FinalizarRemessas(IvBarcodeFicha='" + barcodeFicha + "')", {
					success: function(retorno) {

						if (retorno.EvRettyp == "E") {

							sap.m.MessageBox.show(
								retorno.EvReturn, {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Remessa não finalizada!",
									actions: [sap.m.MessageBox.Action.OK],
									onClose: function(oAction) {

										that.byId("idTableItens").setBusy(false);
									}
								}
							);
						} else if (retorno.EvRettyp == "S") {

							sap.m.MessageBox.show(
								retorno.EvReturn, {
									icon: sap.m.MessageBox.Icon.SUCCESS,
									title: "Remessa finalizada!",
									actions: [sap.m.MessageBox.Action.OK],
									onClose: function(oAction) {
										that.onBuscaRemessa(barcodeFicha);
										that.byId("idTableItens").setBusy(false);
									}
								}
							);

							that.byId("idTableItens").setBusy(false);
						}
					},
					error: function(errorLog) {
						that.byId("idTableItens").setBusy(false);
						that.onMensagemErroODATA(errorLog.response.statusCode);
					}
				});

			}

		},

		onDeleteBeepagem: function(oEvent) {
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel({
				serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/",
				user: "appadmin",
				password: "sap123"
			});
			that.byId("idTableItens").setBusy(true);

			var itensTabela = oEvent.getParameter("listItem") || oEvent.getSource();
			var ItemRemessa = itensTabela.getBindingContext("ItensConference").getProperty("ItemRemessa");
			var BarcodeFicha = itensTabela.getBindingContext("ItensConference").getProperty("BarcodeFicha");

			oModel.read("/DeletaUnicoItem(IvBarcodeFicha='" + BarcodeFicha + "',IvItemRemessa='" + ItemRemessa + "')", {
				success: function(retorno) {

					if (retorno.EvRettyp == "E") {

						sap.m.MessageBox.show(
							retorno.EvReturn, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Não é possivel deletar a beepagem!",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									that.byId("idTableItens").setBusy(false);
								}
							}
						);
					} else if (retorno.EvRettyp == "S") {

						sap.m.MessageBox.show(
							retorno.EvReturn, {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Beepagem do item deletado!",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									that.onBuscaRemessa(BarcodeFicha);
									that.byId("idTableItens").setBusy(false);
								}
							}
						);
					}
				},
				error: function(errorLog) {
					that.byId("idTableItens").setBusy(false);
					that.onMensagemErroODATA(errorLog.response.statusCode);
				}
			});
		},

		onDeleteBeepagemTotal: function(oEvent) {

			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel({
				serviceUrl: "/sap/opu/odata/sap/ZCONFERENCIA_SRV/",
				user: "appadmin",
				password: "sap123"
			});
			that.byId("idTableItens").setBusy(true);
			var BarcodeFicha = this.getOwnerComponent().getModel("modelCabecalhoOrdem").getProperty("/barcodeFicha");
			
			
			oModel.read("/DeletaTodosItens(IvBarcodeFicha='" + BarcodeFicha + "')", {
				success: function(retorno) {

					if (retorno.EvRettyp == "E") {

						sap.m.MessageBox.show(
							retorno.EvReturn, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Não é possivel deletar a beepagem!",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									that.byId("idTableItens").setBusy(false);
								}
							}
						);
					} else if (retorno.EvRettyp == "S") {

						sap.m.MessageBox.show(
							retorno.EvReturn, {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Beepagem do item deletado!",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									that.onBuscaRemessa(BarcodeFicha);
									that.byId("idTableItens").setBusy(false);
								}
							}
						);
					}
				},
				error: function(errorLog) {
					that.byId("idTableItens").setBusy(false);
					that.onMensagemErroODATA(errorLog.response.statusCode);
				}
			});
		},

		onMensagemErroODATA: function(codigoErro) {

			if (codigoErro == 0) {
				sap.m.MessageBox.show(
					"Verifique a conexão com a internet!", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Falha na Conexão!",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {

						}
					}
				);
			} else if (codigoErro == 400) {
				sap.m.MessageBox.show(
					"Url mal formada! Contate a consultoria!", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Erro no programa Fiori!",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {

						}
					}
				);
			} else if (codigoErro == 403) {
				sap.m.MessageBox.show(
					"Usuário sem autorização para executar a função (403)! Contate a consultoria!", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Erro no programa Abap!",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {

						}
					}
				);
			} else if (codigoErro == 404) {
				sap.m.MessageBox.show(
					"Função não encontrada e/ou Parâmentros inválidos  (404)! Contate a consultoria!", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Erro no programa Abap!",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {

						}
					}
				);
			} else if (codigoErro == 500) {
				sap.m.MessageBox.show(
					"Ocorreu um Erro (500)! Contate a consultoria!", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Erro no programa Abap!",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {

						}
					}
				);
			} else if (codigoErro == 501) {
				sap.m.MessageBox.show(
					"Função não implementada (501)! Contate a consultoria!", {
						icon: sap.m.MessageBox.Icon.WARNING,
						title: "Erro no programa Abap!",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {

						}
					}
				);
			}
		}
	});
});