/**
 * This file was auto-generated by Fern from our API Definition.
 */
export declare const ProficientEnvironment: {
    /**
     * The production environment
     */
    readonly Production: "https://admin.proficientai.com";
    /**
     * The staging environment
     */
    readonly Staging: "https://admin.staging.proficientai.com";
    /**
     * The local environment
     */
    readonly Development: "http://localhost:8080/admin";
};
export declare type ProficientEnvironment = typeof ProficientEnvironment.Production | typeof ProficientEnvironment.Staging | typeof ProficientEnvironment.Development;