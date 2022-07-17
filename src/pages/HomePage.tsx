import React, { useState, useEffect } from "react";
import { useSearchUsersQuery, useLazyGetUserReposQuery } from "../store/github/github.api";
import { useDebounce } from "../hooks/debouce";
import { RepoCard } from "../components/RepoCard";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const debounced = useDebounce(search);

  const { isLoading, isError, data } = useSearchUsersQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  });

  const [fetchRepos, { isLoading: areReposLoading, data: repos }] = useLazyGetUserReposQuery();

  const clickHandler = (username: string) => {
    fetchRepos(username);
  };

  useEffect(() => {
    setDropdown(debounced?.length > 3 && data?.length! > 0);
  }, [debounced, data]);

  return (
    <div className="flex justify-center pt-10 mx-auto h-screen w-screen">
      {isError && <p className="text-center text-red-600">Something went wrong...</p>}

      <div className="relative w-[560px]">
        <input
          type="text"
          className="py-2 px-4 w-full h-[40px] mb-2 outline-none"
          placeholder="Search for Github username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {dropdown && (
          <ul className="list-none absolute top-[40px] left-0 right-0 max-h-[200px] shadow-md bg-white overflow-y-scroll">
            {isLoading && <p className="text-center">Loading...</p>}
            {data?.map((user) => (
              <li
                key={user.id}
                className="py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
                onClick={() => clickHandler(user.login)}
              >
                {user.login}
              </li>
            ))}
          </ul>
        )}

        <div className="container">
          {areReposLoading && <p className="text-center">Repos are loading...</p>}
          {repos?.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div>
    </div>
  );
};
