"use strict";
/**
 * This file was auto-generated by Fern from our API Definition.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interactions = void 0;
const url_join_1 = __importDefault(require("url-join"));
const core = __importStar(require("../../../../core"));
const serializers = __importStar(require("../../../../serialization"));
const errors = __importStar(require("../../../../errors"));
class Interactions {
    options;
    constructor(options) {
        this.options = options;
    }
    /**
     * Returns a list of interactions associated with the user. The interactions are returned sorted by creation date, with the most recently created interactions appearing first.
     */
    async getAll(request = {}) {
        const { agentId, limit, startingAfter } = request;
        const _queryParams = new URLSearchParams();
        if (agentId != null) {
            _queryParams.append("agent_id", agentId);
        }
        if (limit != null) {
            _queryParams.append("limit", limit.toString());
        }
        if (startingAfter != null) {
            _queryParams.append("starting_after", startingAfter.toString());
        }
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, "/interactions"),
            method: "GET",
            headers: {
                "X-PROFICIENT-API-KEY": this.options.xProficientApiKey,
                "X-PROFICIENT-USER-EXTERNAL-ID": this.options.xProficientUserExternalId,
                "X-PROFICIENT-USER-HMAC": this.options.xProficientUserHmac,
            },
            queryParameters: _queryParams,
        });
        if (_response.ok) {
            return await serializers.InteractionsList.parseOrThrow(_response.body, {
                allowUnknownKeys: true,
            });
        }
        if (_response.error.reason === "status-code") {
            throw new errors.ProficientAiApiError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
            });
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientAiApiError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientAiApiTimeoutError();
            case "unknown":
                throw new errors.ProficientAiApiError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Retrieves the interaction with the given ID.
     */
    async get(interactionId) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, `/interactions/${await serializers.InteractionId.jsonOrThrow(interactionId)}`),
            method: "GET",
            headers: {
                "X-PROFICIENT-API-KEY": this.options.xProficientApiKey,
                "X-PROFICIENT-USER-EXTERNAL-ID": this.options.xProficientUserExternalId,
                "X-PROFICIENT-USER-HMAC": this.options.xProficientUserHmac,
            },
        });
        if (_response.ok) {
            return await serializers.Interaction.parseOrThrow(_response.body, {
                allowUnknownKeys: true,
            });
        }
        if (_response.error.reason === "status-code") {
            throw new errors.ProficientAiApiError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
            });
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientAiApiError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientAiApiTimeoutError();
            case "unknown":
                throw new errors.ProficientAiApiError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Create a new `Interaction` with an agent.
     */
    async create(request) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, "/interactions"),
            method: "POST",
            headers: {
                "X-PROFICIENT-API-KEY": this.options.xProficientApiKey,
                "X-PROFICIENT-USER-EXTERNAL-ID": this.options.xProficientUserExternalId,
                "X-PROFICIENT-USER-HMAC": this.options.xProficientUserHmac,
            },
            body: await serializers.InteractionCreateParams.jsonOrThrow(request),
        });
        if (_response.ok) {
            return await serializers.InteractionCreateResponse.parseOrThrow(_response.body, { allowUnknownKeys: true });
        }
        if (_response.error.reason === "status-code") {
            throw new errors.ProficientAiApiError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
            });
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientAiApiError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientAiApiTimeoutError();
            case "unknown":
                throw new errors.ProficientAiApiError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
exports.Interactions = Interactions;
