import { useEffect, useMemo, useState } from 'react'
import './App.css'

import type { User } from './api/types';

import UserRow from './components/UserRow';
import UsersApi, { type AdditionalModels } from './api/users';
import UserSearch from './components/UserSearch';

// it's in the public docs, so including here, but normally we shouldn't bake api tokens into the code. :P
const DEFAULT_API_TOKEN = 'y_NbAkKc66ryYTWUXYEu';

type FetchUserParams = { query?: string; offset?: number; appendUsers?: boolean; };

function App() {
  const [apiToken, setApiToken] = useState(DEFAULT_API_TOKEN);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<string | undefined>();
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [done, setDone] = useState(false);

  // create an api client when apiToken is set
  const apiClient = useMemo(() => apiToken ? new UsersApi(apiToken) : null, [apiToken]);

  const limit = 25; // might be nice to make this configurable
  const includes: AdditionalModels[] = ['contact_methods']; // include this to get the contact data in one API call.
  const expanded = users.length === 1; // minor QOL improvement to auto-expand if there's only one user.
  const loadButtonText = loading ? 'Loading...' : (done ? 'No more users to load' : 'Load more users');
  const loadButtonTitle = !apiClient ? 'Set a valid API token first!' : 'Load more users';

  const fetchUsers = ({ query, offset, appendUsers }: FetchUserParams = { query: '', offset: 0, appendUsers: false }) => {
    if (!apiClient) return;

    // only request total on the first page since docs say it's expensive.
    const shouldGetTotal = offset === 0;

    setLoading(true);
    setQuery(query);
    apiClient.listUsers({ query, offset, limit, total: shouldGetTotal, "include[]": includes })
      .then(data => {
        if (shouldGetTotal) {
          setTotal(data.total);
        }
        setUsers(appendUsers ? [...users, ...data.users] : data.users);
        setDone(!data.more);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUser = (id: string) => {
    if (!apiClient) return;

    setLoading(true);
    apiClient.getUser(id, includes)
      .then(({ user }) => {
        const users = user ? [user] : [];
        setUsers(users);
        setTotal(users.length);
        setDone(true);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        if (err?.status === 404) {
          // Handle not found error a little differently
          setUsers([]);
          setTotal(0);
          setDone(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchUserContactMethods = (userId: string) => {
    if (!apiClient) return;

    setLoading(true);
    apiClient.getUserContactMethods(userId)
      .then(({ contact_methods }) => {
        console.log('Contact methods for user:', contact_methods);
      })
      .catch(err => {
        console.error('Error fetching user contact methods:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // initial fetch once apiClient is defined (or changed)
  useEffect(() => {
    fetchUsers();
  }, [apiClient]);

  return (
    <>
      <div id="configuration">
        <label htmlFor="apiToken">PagerDuty API Token:</label>
        <input
          type="text"
          id="apiToken"
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          placeholder="Enter PagerDuty API token"
        />

      </div>

      <hr />

      <h1>Users {`(${total || 0})`}</h1>

      <UserSearch
        fetchUser={fetchUser}
        fetchUsers={
          query => {
            fetchUsers({ query, offset: 0, appendUsers: false });
          }
        }
        fetchUserContactMethods={fetchUserContactMethods}
      />

      { loading && 'Loading...' }

      <div className="user-list">
        { users.map(user => <UserRow key={user.id} user={user} detailed={expanded} />) }
      </div>

      <hr />

      <button
        onClick={() => fetchUsers({ query, offset: users.length, appendUsers: true })}
        disabled={loading || !apiClient || done}
        title={loadButtonTitle}
      >
        {loadButtonText}
      </button>
    </>
  )
}

export default App
