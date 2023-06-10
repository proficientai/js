/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as core from "../../../../core";
import * as Proficient from "../../..";
export declare namespace Users {
    interface Options {
        secretKey?: core.Supplier<string | undefined>;
        apiKey?: core.Supplier<string | undefined>;
        userExternalId?: core.Supplier<string | undefined>;
        userHmac?: core.Supplier<string | undefined>;
    }
}
export declare class Users {
    protected readonly options: Users.Options;
    constructor(options: Users.Options);
    /**
     * Returns a list of users that belong to the current project. The users are returned sorted by creation date, with the most recently created users appearing first.
     * @throws {@link Proficient.InternalError}
     */
    list(): Promise<Proficient.UsersList>;
    /**
     * Retrieves the user with the given ID.
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     */
    get(userId: Proficient.UserId): Promise<Proficient.User>;
    /**
     * Creates a new user with the given properties.
     * @throws {@link Proficient.InvalidRequestError}
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.InternalError}
     */
    create(request: Proficient.UserCreateParams): Promise<Proficient.User>;
    /**
     * Updates the properties of the specified user. Only the provided properties will be updated. Any properties not provided will be left unchanged.
     * @throws {@link Proficient.InvalidRequestError}
     * @throws {@link Proficient.ForbiddenError}
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     * @throws {@link Proficient.ServiceUnavailableError}
     */
    update(userId: Proficient.UserId, request: Proficient.UserUpdateParams): Promise<Proficient.User>;
    /**
     * Permanently deletes the specified user and all the interactions associated with it. This cannot be undone.
     * @throws {@link Proficient.ResourceNotFoundError}
     * @throws {@link Proficient.InternalError}
     * @throws {@link Proficient.ServiceUnavailableError}
     */
    delete(userId: Proficient.UserId): Promise<Proficient.User>;
    protected _getAuthorizationHeader(): Promise<string | undefined>;
}
