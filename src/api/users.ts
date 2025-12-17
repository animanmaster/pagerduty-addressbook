import ApiClient from "./client";
import type { ValidUsersResponse, ValidUserResponse } from "./types";

export type AdditionalModels = 'teams' | 'contact_methods' | 'notification_rules' | 'subdomains';

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

    async getUser(id: string, include?: Array<AdditionalModels>): Promise<ValidUserResponse> {
        return this.get<ValidUserResponse>(`/users/${id}`, { 'include[]': include });
    }

    async getUserContactMethods(userId: string): Promise<ValidUserResponse> {
        return this.get<ValidUserResponse>(`/users/${userId}/contact_methods`);
    }
}
