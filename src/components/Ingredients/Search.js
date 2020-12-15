import React, { useEffect, useState, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
    const { onFilter } = props;
    const [search, setSearch] = useState("");
    const inputRef = useRef();

    const filter = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search === inputRef.current.value) {
                console.log(search);
                const query =
                    search.length === 0
                        ? ""
                        : `?orderBy="title"&equalTo="${search}"`;
                onFilter(query);
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [search, onFilter, inputRef]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        type="text"
                        value={search}
                        onChange={filter}
                        ref={inputRef}
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;
