import { useState } from "react";
import type { User, ContactMethod } from "../api/types";
import type UsersApi from "../api/users";

interface UserProps {
    user: User;
    apiClient?: UsersApi | null;
    detailed?: boolean;
}

const ContactMethodEmojis: Record<string, string> = {
    'email': '📧',
    'phone': '📞',
    'sms': '📱',
    'push': '🔔',
};

export default ({ apiClient, user, detailed }: UserProps) => {
    const [expanded, setExpanded] = useState(!!detailed);

    return (
        <div className="user" onClick={() => setExpanded(!expanded)}>
            <div className="header-row">
                <div className="user-avatar">
                    <img src={user.avatar_url} alt={`${user.name}'s avatar`} />
                </div>
                <h2 className="user-name">{user.name}</h2>
                <h4 className="user-id">{user.id}</h4>
            </div>
            <hr style={{ backgroundColor: user.color.toString().replaceAll('-', ''), height: '1em' }} title={user.color} />
            <div className="key-info">
                <p className="email"><a href={`mailto:${user.email}`}>{user.email}</a></p>
            </div>
            {
                expanded && (
                    <div className="additional-details">
                        <p><strong>Time Zone:</strong> {user.time_zone}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Job Title:</strong> {user.job_title || 'N/A'}</p>
                        <p><strong>Description:</strong> {user.description || 'N/A'}</p>
                        <p><strong>Teams:</strong> {user.teams.length > 0 ? user.teams.map(team => team.summary).join(', ') : 'None'}</p>
                        <div className="contact-methods">
                            <strong>Contact Methods:</strong>
                            {
                                user.contact_methods.map(method => {
                                    const methodName = method.type.replace(/_contact_method.*$/, '');
                                    const emoji = ContactMethodEmojis[methodName];
                                    return <p key={method.id}>
                                        <strong>{emoji} {methodName}:</strong> {(method as ContactMethod).address}
                                    </p>
                                })
                            }
                        </div>
                    </div>
                )
            }
            <div>{expanded ? '-' : '+'}</div>
        </div>
    );
}