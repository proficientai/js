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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const core = __importStar(require("../../../../core"));
const Proficient = __importStar(require("../../.."));
const url_search_params_1 = __importDefault(require("@ungap/url-search-params"));
const environments = __importStar(require("../../../../environments"));
const url_join_1 = __importDefault(require("url-join"));
const serializers = __importStar(require("../../../../serialization"));
const errors = __importStar(require("../../../../errors"));
class Users {
    constructor(options) {
        this.options = options;
    }
    /**
     * Returns a list of users that belong to the current project. The users are returned sorted by creation date, with the most recently created users appearing first.
     * @throws {@link Proficient.InternalError}
     */
    list(request = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { liveMode } = request;
            const _queryParams = new url_search_params_1.default();
            if (liveMode != null) {
                _queryParams.append("live_mode", liveMode);
            }
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(environments.ProficientEnvironment.Production, "/users"),
                method: "GET",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-PROFICIENT-API-KEY": (yield core.Supplier.get(this.options.apiKey)) != null
                        ? yield core.Supplier.get(this.options.apiKey)
                        : undefined,
                    "X-PROFICIENT-USER-EXTERNAL-ID": (yield core.Supplier.get(this.options.userExternalId)) != null
                        ? yield core.Supplier.get(this.options.userExternalId)
                        : undefined,
                    "X-PROFICIENT-USER-HMAC": (yield core.Supplier.get(this.options.userHmac)) != null
                        ? yield core.Supplier.get(this.options.userHmac)
                        : undefined,
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
                queryParameters: _queryParams,
            });
            if (_response.ok) {
                return yield serializers.UsersList.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 500:
                        throw new Proficient.InternalError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
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
        });
    }
    /**
     * Retrieves the user with the given ID.
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     */
    get(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(environments.ProficientEnvironment.Production, `/users/${yield serializers.UserId.jsonOrThrow(userId)}`),
                method: "GET",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-PROFICIENT-API-KEY": (yield core.Supplier.get(this.options.apiKey)) != null
                        ? yield core.Supplier.get(this.options.apiKey)
                        : undefined,
                    "X-PROFICIENT-USER-EXTERNAL-ID": (yield core.Supplier.get(this.options.userExternalId)) != null
                        ? yield core.Supplier.get(this.options.userExternalId)
                        : undefined,
                    "X-PROFICIENT-USER-HMAC": (yield core.Supplier.get(this.options.userHmac)) != null
                        ? yield core.Supplier.get(this.options.userHmac)
                        : undefined,
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
            });
            if (_response.ok) {
                return yield serializers.User.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 404:
                        throw new Proficient.ResourceNotFoundError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 500:
                        throw new Proficient.InternalError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
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
        });
    }
    /**
     * Creates a new user with the given properties.
     * @throws {@link Proficient.InvalidRequestError}
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.InternalError}
     */
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(environments.ProficientEnvironment.Production, "/users"),
                method: "POST",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-PROFICIENT-API-KEY": (yield core.Supplier.get(this.options.apiKey)) != null
                        ? yield core.Supplier.get(this.options.apiKey)
                        : undefined,
                    "X-PROFICIENT-USER-EXTERNAL-ID": (yield core.Supplier.get(this.options.userExternalId)) != null
                        ? yield core.Supplier.get(this.options.userExternalId)
                        : undefined,
                    "X-PROFICIENT-USER-HMAC": (yield core.Supplier.get(this.options.userHmac)) != null
                        ? yield core.Supplier.get(this.options.userHmac)
                        : undefined,
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
                body: yield serializers.UserCreateParams.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
            });
            if (_response.ok) {
                return yield serializers.User.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new Proficient.InvalidRequestError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 403:
                        throw new Proficient.ForbiddenError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 500:
                        throw new Proficient.InternalError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
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
        });
    }
    /**
     * Updates the properties of the specified user. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     * @throws {@link Proficient.InvalidRequestError}
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     * @throws {@link Proficient.ServiceUnavailableError}
     */
    update(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(environments.ProficientEnvironment.Production, `/users/${yield serializers.UserId.jsonOrThrow(userId)}`),
                method: "POST",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-PROFICIENT-API-KEY": (yield core.Supplier.get(this.options.apiKey)) != null
                        ? yield core.Supplier.get(this.options.apiKey)
                        : undefined,
                    "X-PROFICIENT-USER-EXTERNAL-ID": (yield core.Supplier.get(this.options.userExternalId)) != null
                        ? yield core.Supplier.get(this.options.userExternalId)
                        : undefined,
                    "X-PROFICIENT-USER-HMAC": (yield core.Supplier.get(this.options.userHmac)) != null
                        ? yield core.Supplier.get(this.options.userHmac)
                        : undefined,
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
                body: yield serializers.UserUpdateParams.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
            });
            if (_response.ok) {
                return yield serializers.User.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new Proficient.InvalidRequestError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 403:
                        throw new Proficient.ForbiddenError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 404:
                        throw new Proficient.ResourceNotFoundError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 500:
                        throw new Proficient.InternalError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 503:
                        throw new Proficient.ServiceUnavailableError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
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
        });
    }
    /**
     * Permanently deletes the specified user and all the interactions associated with it. This cannot be undone.
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     * @throws {@link Proficient.ServiceUnavailableError}
     */
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)(environments.ProficientEnvironment.Production, `/users/${yield serializers.UserId.jsonOrThrow(userId)}`),
                method: "DELETE",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-PROFICIENT-API-KEY": (yield core.Supplier.get(this.options.apiKey)) != null
                        ? yield core.Supplier.get(this.options.apiKey)
                        : undefined,
                    "X-PROFICIENT-USER-EXTERNAL-ID": (yield core.Supplier.get(this.options.userExternalId)) != null
                        ? yield core.Supplier.get(this.options.userExternalId)
                        : undefined,
                    "X-PROFICIENT-USER-HMAC": (yield core.Supplier.get(this.options.userHmac)) != null
                        ? yield core.Supplier.get(this.options.userHmac)
                        : undefined,
                    "X-Fern-Language": "JavaScript",
                },
                contentType: "application/json",
            });
            if (_response.ok) {
                return yield serializers.User.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 404:
                        throw new Proficient.ResourceNotFoundError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 500:
                        throw new Proficient.InternalError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 503:
                        throw new Proficient.ServiceUnavailableError(yield serializers.ApiError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
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
        });
    }
    _getAuthorizationHeader() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield core.Supplier.get(this.options.secretKey);
            if (value != null) {
                return `Bearer ${value}`;
            }
            return undefined;
        });
    }
}
exports.Users = Users;
