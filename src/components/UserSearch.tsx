import { useState } from "react";

import './UserSearch.css';

const searchOptions = ['name', 'id'] as const;
type SearchByOption = typeof searchOptions[number];

type UserSearchProps = {
    fetchUser: (id: string) => void;
    fetchUsers: (query: string) => void;
}

export default ({ fetchUsers, fetchUser }: UserSearchProps) => {
    const [searchBy, setSearchBy] = useState<SearchByOption>('name');
    const [searchByValue, setSearchByValue] = useState<string>('');

    const search = () => {
        if (searchBy === 'id') {
            fetchUser(searchByValue);
        }
        else if (searchBy === 'name') {
            fetchUsers(searchByValue);
        }
    };

    return (
        <form className="search-form" onSubmit={e => { e.preventDefault(); search(); }}>
            Filter:
            <select className="filter-options" value={searchBy} onChange={e => setSearchBy(e.target.value as SearchByOption)}>
                {searchOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            =
            <input type="text" value={searchByValue} onChange={e => setSearchByValue(e.target.value)} />
            <button className="search-submit" onClick={search}>
                Search
            </button>
        </form>
    );
}
