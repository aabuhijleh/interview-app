import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components/macro";
import parseLinkHeader from "parse-link-header";
import { SortOrder, SortBy, Contributor } from "./types";
import {
  sortContributorsFunc as sortContributors,
  toggleSortOrder,
} from "./utils";

const Grid = styled.div`
  display: grid;
  grid-gap: 20px;
  justify-content: center;
`;

const Wrapper = styled(Grid)`
  padding: 20px;
`;

const ButtonsWrapper = styled(Grid)`
  grid-template-columns: repeat(4, min-content);
`;

const PagesWrapper = styled.form`
  display: flex;
  align-items: center;

  input {
    align-self: stretch;
    text-align: center;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: 1px solid tomato;
  border-radius: 3px;
  color: tomato;
  padding: 15px 80px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: rgba(255, 99, 71, 0.1);
  }

  &:disabled {
    color: #777;
    border-color: #777;
    cursor: default;
  }
`;

const Table = styled.table`
  th,
  td {
    width: 200px;
    text-align: center;
  }

  th {
    padding: 10px 0;

    &:not(:first-of-type) {
      background-color: #777;
      color: #fff;
      cursor: pointer;

      // set symbol according to column sorting order
      &:not(.none) {
        &::before {
          content: "\\2191";
          margin-right: 3px;
        }

        &.asc {
          &::before {
            content: "\\2193";
          }
        }
      }
    }
  }
`;

const Avatar = styled.img`
  width: 50px;
  border-radius: 50%;
`;

export const App: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("none");
  const [loginSortOrder, setLoginSortOrder] = useState<SortOrder>("none");
  const [contributorsSortOrder, setContributorsSortOrder] =
    useState<SortOrder>("none");
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState(-1);
  const [nextPage, setNextPage] = useState(-1);
  const [lastPage, setLastPage] = useState(page);
  const [pageInput, setPageInput] = useState(page);
  const [perPage, setPerPage] = useState(25);

  useEffect(() => {
    const fetchContributors = async () => {
      setLoading(true);
      const { data, headers } = await axios.get<Contributor[]>(
        `https://api.github.com/repos/facebook/react/contributors?page=${page}&per_page=${perPage}`
      );
      const link = parseLinkHeader(headers.link);
      setPrevPage(Number(link?.prev?.page) || -1);
      setNextPage(Number(link?.next?.page) || -1);
      setLastPage(Number(link?.last?.page) || page);
      setContributors(data);
      setLoading(false);
    };
    fetchContributors();
  }, [page, perPage]);

  let sortedContributors = contributors;
  switch (sortBy) {
    case "login":
      sortedContributors = contributors.sort((a, b) =>
        sortContributors("login", loginSortOrder, a, b)
      );
      break;
    case "contributions":
      sortedContributors = contributors.sort((a, b) =>
        sortContributors("contributions", contributorsSortOrder, a, b)
      );
      break;
  }

  return (
    <Wrapper>
      <ButtonsWrapper>
        <Button
          disabled={prevPage === -1}
          onClick={() => {
            setPage(prevPage);
            setPageInput(prevPage);
          }}
        >
          Prev
        </Button>
        <Button
          disabled={nextPage === -1}
          onClick={() => {
            setPage(nextPage);
            setPageInput(nextPage);
          }}
        >
          Next
        </Button>

        <PagesWrapper
          onSubmit={(e) => {
            e.preventDefault();
            setPage(pageInput);
          }}
        >
          <input
            type="number"
            value={pageInput}
            min="1"
            max={lastPage}
            onChange={(e) => setPageInput(Number(e.target.value))}
          />
          <span>&nbsp;/&nbsp;</span>
          <span>{lastPage}</span>
        </PagesWrapper>

        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={75}>75</option>
          <option value={100}>100</option>
        </select>
      </ButtonsWrapper>

      {loading && <div>Loading...</div>}

      <Table>
        <thead>
          <tr>
            <th></th>
            <th
              className={loginSortOrder}
              onClick={() => {
                setLoginSortOrder(toggleSortOrder);
                setSortBy("login");
              }}
            >
              Username
            </th>
            <th
              className={contributorsSortOrder}
              onClick={() => {
                setContributorsSortOrder(toggleSortOrder);
                setSortBy("contributions");
              }}
            >
              Contributions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedContributors.map((contributor) => (
            <tr key={contributor.id}>
              <td>
                <Avatar src={contributor.avatar_url} alt="avatar" />
              </td>
              <td>
                <a
                  href={`https://github.com/${contributor.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contributor.login}
                </a>
              </td>
              <td>{contributor.contributions}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};
