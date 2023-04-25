/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as environments from "../../../../environments";
import * as core from "../../../../core";
import { Proficient } from "../../../..";
export declare namespace Users {
    interface Options {
        environment: environments.ProficientEnvironment | string;
        authorization?: core.Supplier<string | undefined>;
        xProficientApiKey?: core.Supplier<string | undefined>;
        xProficientUserExternalId?: core.Supplier<string | undefined>;
        xProficientUserHmac?: core.Supplier<string | undefined>;
    }
}
export declare class Users {
    private readonly options;
    constructor(options: Users.Options);
    /**
     * Returns a list of users that belong to the current project. The users are returned sorted by creation date, with the most recently created users appearing first.
     * @throws {Proficient.InternalError}
     */
    list(): Promise<Proficient.UsersList>;
    /**
     * Retrieves the user with the given ID.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     */
    get(userId: Proficient.UserId): Promise<Proficient.User>;
    /**
     * Creates a new user with the given properties.
     * @throws {Proficient.InvalidRequestError}
     * @throws {Proficient.ForbiddenError}
     * @throws {Proficient.InternalError}
     */
    create(request: Proficient.UserCreateParams): Promise<Proficient.User>;
    /**
     * Updates the properties of the specified user. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     * @throws {Proficient.InvalidRequestError}
     * @throws {Proficient.ForbiddenError}
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    update(userId: Proficient.UserId, request: Proficient.UserUpdateParams): Promise<Proficient.User>;
    /**
     * Permanently deletes the specified user and all the interactions associated with it. This cannot be undone.
     * @throws {Proficient.ResourceNotFoundError}
     * @throws {Proficient.InternalError}
     * @throws {Proficient.ServiceUnavailableError}
     */
    delete(userId: Proficient.UserId): Promise<Proficient.User>;
    private _getAuthorizationHeader;
}
