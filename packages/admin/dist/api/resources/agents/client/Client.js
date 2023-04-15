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
exports.Agents = void 0;
const core = __importStar(require("../../../../core"));
const __1 = require("../../../..");
const url_join_1 = __importDefault(require("url-join"));
const serializers = __importStar(require("../../../../serialization"));
const errors = __importStar(require("../../../../errors"));
class Agents {
    options;
    constructor(options) {
        this.options = options;
    }
    /**
     * Returns a list of agents that belong to the current organization. The agents are returned sorted by creation date, with the most recently created agents appearing first.
     * @throws {Proficient.InternalError}
     */
    async list() {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, "/agents"),
            method: "GET",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
        });
        if (_response.ok) {
            return await serializers.AgentsList.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Retrieves the agent with the given ID.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     */
    async get(agentId) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, `/agents/${await serializers.AgentId.jsonOrThrow(agentId)}`),
            method: "GET",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
        });
        if (_response.ok) {
            return await serializers.Agent.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 404:
                    throw new __1.Proficient.ResourceNotFoundError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Creates a new agent with the given properties.
     * @throws {Proficient.InvalidRequestError}
     * @throws {Proficient.ForbiddenError}
     * @throws {Proficient.InternalError}
     */
    async create(request) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, "/agents"),
            method: "POST",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
            body: await serializers.AgentCreateParams.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
        });
        if (_response.ok) {
            return await serializers.Agent.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new __1.Proficient.InvalidRequestError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 403:
                    throw new __1.Proficient.ForbiddenError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Updates the properties of the specified agent. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     * @throws {Proficient.InvalidRequestError}
     * @throws {Proficient.ForbiddenError}
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    async update(agentId, request) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, `/agents/${await serializers.AgentId.jsonOrThrow(agentId)}`),
            method: "POST",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
            body: await serializers.AgentUpdateParams.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
        });
        if (_response.ok) {
            return await serializers.Agent.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new __1.Proficient.InvalidRequestError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 403:
                    throw new __1.Proficient.ForbiddenError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 404:
                    throw new __1.Proficient.ResourceNotFoundError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 503:
                    throw new __1.Proficient.ServiceUnavailableError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Retrieves the current configuration of the specified agent.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     */
    async getConfig(agentId) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, `/agents/${await serializers.AgentId.jsonOrThrow(agentId)}/config`),
            method: "GET",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
        });
        if (_response.ok) {
            return await serializers.AgentConfig.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 404:
                    throw new __1.Proficient.ResourceNotFoundError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Updates the configuration of the specified agent. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    async updateConfig(agentId, request) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, `/agents/${await serializers.AgentId.jsonOrThrow(agentId)}/config`),
            method: "POST",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
            body: await serializers.AgentConfigUpdateParams.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
        });
        if (_response.ok) {
            return await serializers.AgentConfig.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 404:
                    throw new __1.Proficient.ResourceNotFoundError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 503:
                    throw new __1.Proficient.ServiceUnavailableError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Activates the specified agent. New message or interaction requests sent to this agent will not be blocked while the agent is active. This request does not fail if the agent is already active.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    async activate(agentId) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, `/agents/${await serializers.AgentId.jsonOrThrow(agentId)}/activate`),
            method: "POST",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
        });
        if (_response.ok) {
            return await serializers.Agent.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 404:
                    throw new __1.Proficient.ResourceNotFoundError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 503:
                    throw new __1.Proficient.ServiceUnavailableError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Deactivates the specified agent. Any new message or interaction requests sent to this agent will be blocked while the agent is disabled. This request does not fail if the agent is already deactivated.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    async deactivate(agentId) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, `/agents/${await serializers.AgentId.jsonOrThrow(agentId)}/deactivate`),
            method: "POST",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
        });
        if (_response.ok) {
            return await serializers.Agent.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 404:
                    throw new __1.Proficient.ResourceNotFoundError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 503:
                    throw new __1.Proficient.ServiceUnavailableError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
    /**
     * Permanently deletes the specified agent and all the interactions associated with it. This cannot be undone.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    async delete(agentId) {
        const _response = await core.fetcher({
            url: (0, url_join_1.default)(this.options.environment, `/agents/${await serializers.AgentId.jsonOrThrow(agentId)}`),
            method: "DELETE",
            headers: {
                "X-PROFICIENT-API-KEY": await core.Supplier.get(this.options.xProficientApiKey),
                "X-PROFICIENT-USER-EXTERNAL-ID": await core.Supplier.get(this.options.xProficientUserExternalId),
                "X-PROFICIENT-USER-HMAC": await core.Supplier.get(this.options.xProficientUserHmac),
            },
            contentType: "application/json",
        });
        if (_response.ok) {
            return await serializers.Agent.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
            });
        }
        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 404:
                    throw new __1.Proficient.ResourceNotFoundError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 500:
                    throw new __1.Proficient.InternalError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                case 503:
                    throw new __1.Proficient.ServiceUnavailableError(await serializers.ApiError.parseOrThrow(_response.error.body, {
                        unrecognizedObjectKeys: "passthrough",
                        allowUnrecognizedUnionMembers: true,
                        allowUnrecognizedEnumValues: true,
                    }));
                default:
                    throw new errors.ProficientError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }
        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ProficientError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ProficientTimeoutError();
            case "unknown":
                throw new errors.ProficientError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
exports.Agents = Agents;
