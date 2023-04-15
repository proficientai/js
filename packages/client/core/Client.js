"use strict";
/**
 * This file was auto-generated by Fern from our API Definition.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProficientClient = void 0;
const Client_1 = require("./api/resources/agents/client/Client");
const Client_2 = require("./api/resources/interactions/client/Client");
const Client_3 = require("./api/resources/messages/client/Client");
class ProficientClient {
    options;
    constructor(options) {
        this.options = options;
    }
    _agents;
    get agents() {
        return (this._agents ??= new Client_1.Agents(this.options));
    }
    _interactions;
    get interactions() {
        return (this._interactions ??= new Client_2.Interactions(this.options));
    }
    _messages;
    get messages() {
        return (this._messages ??= new Client_3.Messages(this.options));
    }
}
exports.ProficientClient = ProficientClient;
