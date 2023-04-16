"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProficientClient = void 0;
var core_1 = require("../core");
function createProficientClient(config) {
    return new core_1.ProficientClient({
        environment: config.environment,
        authorization: "Bearer ".concat(config.secretKey),
    });
}
exports.createProficientClient = createProficientClient;
