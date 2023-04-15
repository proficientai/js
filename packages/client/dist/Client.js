"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProficientClient = void 0;
var core_1 = require("../core");
var ProficientClient = /** @class */ (function (_super) {
    __extends(ProficientClient, _super);
    function ProficientClient(config) {
        return _super.call(this, {
            environment: config.environment,
            xProficientApiKey: config.apiKey,
            xProficientUserExternalId: config.userExternalId,
            xProficientUserHmac: config.userHmac,
        }) || this;
    }
    return ProficientClient;
}(core_1.ProficientClient));
exports.ProficientClient = ProficientClient;
