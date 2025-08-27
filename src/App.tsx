import { useEffect, useMemo, useState } from 'react'
import './App.css'

import type { User } from './api/types';

import UserRow from './components/UserRow';
import UsersApi from './api/users';

// it's in the public docs, so including here, but normally we shouldn't bake api tokens into the code. :P
const DEFAULT_API_TOKEN = 'y_NbAkKc66ryYTWUXYEu';

function App() {
  const [apiToken, setApiToken] = useState(DEFAULT_API_TOKEN);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [done, setDone] = useState(false);

  // create an api client when apiToken is set
  const apiClient = useMemo(() => apiToken ? new UsersApi(apiToken) : null, [apiToken]);

  const limit = 25; // might be nice to make this configurable
  const loadButtonText = loading ? 'Loading...' : (done ? 'No more users to load' : 'Load more users');
  const loadButtonTitle = !apiClient ? 'Set a valid API token first!' : 'Load more users';

  const fetchUsers = (offset = 0, appendUsers = false) => {
    if (!apiClient) return;

    // only request total on the first page since docs say it's expensive.
    const shouldGetTotal = offset === 0;

    setLoading(true);
    apiClient.listUsers({ offset, limit, total: shouldGetTotal, "include[]": ['contact_methods'] })
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

      <h1>Users {total > 0 && `(${total})`}</h1>

      <div className="user-list">
        { users.map(user => <UserRow key={user.id} user={user} />) }
      </div>

      <hr />

      <button
        onClick={() => fetchUsers(users.length, true)}
        disabled={loading || !apiClient || done}
        title={loadButtonTitle}
      >
        {loadButtonText}
      </button>
    </>
  )
}

export default App
