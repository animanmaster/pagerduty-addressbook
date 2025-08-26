export type ErrorResponse = {
    error: {
        code: number;
        message: string;
        errors?: Array<string>;
    }
};

export type BaseObject = {
    type: string;
    id: string;
    summary: string;
    self: string;
    html_url: string;
};

export type Role = 'admin' | 'limited_user' | 'observer' | 'owner' | 'read_only_user' | 'restricted_access' | 'read_only_limited_user' | 'user';

export type Team = BaseObject & {
    type: 'team';
};

export type ContactMethodReference = BaseObject & {
    type: 'email_contact_method_reference' | 'phone_contact_method_reference' | 'push_notification_contact_method_reference' | 'sms_contact_method_reference';
};

export type ContactMethod = BaseObject & {
    type: 'phone_contact_method' | 'sms_contact_method' | 'email_contact_method' | 'push_notification_contact_method';
    address: string;
    label: string;
    country_code: string;
    enabled: boolean;
};

export type NotificationRule = BaseObject & {
    type: 'assignment_notification_rule_reference';
};

export type User = BaseObject & {
    type: 'user';
    name: string;
    email: string;
    time_zone: string;
    color: string;
    role: Role;
    avatar_url: string;
    description: string;
    invitation_sent: boolean;
    job_title: string;
    created_via_sso: boolean;
    teams: Array<Team>;
    contact_methods: Array<ContactMethod | ContactMethodReference>;
    notification_rules: Array<NotificationRule>;
};

export type ValidUsersResponse = {
    offset: number;
    limit: number;
    more: boolean;
    total: number;
    users: Array<User>;
};

// The union of a valid response and an error response, the users API will return one or the other.
export type UsersResponse = ErrorResponse | ValidUsersResponse;
