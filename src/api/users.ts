import ApiClient from "./client";
import type { ValidUsersResponse } from "./types";

type AdditionalModels = 'teams' | 'contact_methods' | 'notification_rules' | 'subdomains';

export type UsersListQueryParams = {
    limit?: number;
    offset?: number;
    query?: string;
    total?: boolean;
    'include[]'?: Array<AdditionalModels>;
    teamIds?: Array<string>;
}

export default class UsersApi extends ApiClient {
    async listUsers(params: UsersListQueryParams): Promise<ValidUsersResponse> {
        return this.get<ValidUsersResponse>('/users', params);
    }
}