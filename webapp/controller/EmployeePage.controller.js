sap.ui.define([
    "infopulse/cv/infopulse-cvapp-ui/controller/BaseController",
    "infopulse/cv/infopulse-cvapp-ui/model/formatter",
    "sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
    "use strict";

    return BaseController.extend("infopulse.cv.infopulse-cvapp-ui.controller.EmployeePage", {

        formatter: formatter,

        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);
            this.getOwnerComponent().getService("ShellUIService").then(this._setNavToEmployeeList.bind(this)).catch(function () {
                this.getRouter().navTo("notFound");
            });
            this.getRouter().getRoute("employeePage").attachPatternMatched(this._onPersonMatched, this);
        },

        _setNavToEmployeeList: function (oShellService) {
            oShellService.setBackNavigation(function () {
                this.getRouter().navTo("employeeList", null, true);
            }.bind(this));
        },

        _onPersonMatched: function (oEvent) {
            var iEmployeeId = oEvent.getParameter("arguments").employeeId;

            this.getView().bindElement({
                path: "/CVData(" + iEmployeeId + ")/",
                events: {
                    dataRequested: function () {
                        this.getModel("viewModel").setProperty("/busy", true);
                    },
                    dataReceived: function (oData) {
                        var oError = oData.getParameter("error");

                        if (oError === undefined) {
                            this.getRouter().navTo("notFound", null, true);
                        } else {
                            this.getModel("viewModel").setProperty("/busy", false);
                        }
                    }.bind(this)
                }
            });
        }
    });
});
