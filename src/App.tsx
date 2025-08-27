import { useEffect, useMemo, useState } from 'react'
import './App.css'

import type { User } from './api/types';

import UserRow from './components/UserRow';
import UsersApi from './api/users';

// it's in the public docs, so including here, but normally we shouldn't bake api tokens into the code. :P
const DEFAULT_API_TOKEN = 'y_NbAkKc66ryYTWUXYEu';

function App() {
  const [apiToken, setApiToken] = useState(DEFAULT_API_TOKEN);
  const [total, setTotal] = useState(0);
  const [nextOffset, setNextOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [done, setDone] = useState(false);

  const limit = 25;

  const apiClient = useMemo(() => apiToken ? new UsersApi(apiToken) : null, [apiToken]);

  useEffect(() => {
    if (!apiClient) return;

    const shouldGetTotal = nextOffset === 0;
    setLoading(true);
    // only request total on the first request since docs say it's expensive.
    apiClient.listUsers({ offset: nextOffset, total: shouldGetTotal, "include[]": ['contact_methods'] })
      .then(data => {
        if (shouldGetTotal) {
          setTotal(data.total);
        }
        setUsers([...users, ...data.users]);
        setDone(!data.more);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiClient, nextOffset]);

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

      { users.map(user => <UserRow key={user.id} user={user} />) }
      
      <hr />

      <button onClick={() => setNextOffset(nextOffset + limit)} disabled={loading || !apiClient || done} title={!apiClient ? 'Set a valid API token first!' : 'Load more users'} >
        {loading ? 'Loading...' : (done ? 'No more users to load' : 'Load more users')}
      </button>
    </>
  )
}

export default App
