import React, { useEffect, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
    const { onFilter } = props;
    const [search, setSearch] = useState("");
    // useEffect(() => {
    //     const query =
    //         search.length === 0 ? "" : `?orderBy="title"&equalTo="${search}"`;
    //     fetch(
    //         "https://react-hooks-34dd9.firebaseio.com/ingredients.json" + query
    //     )
    //         .then((response) => response.json())
    //         .then((responseData) => {
    //             const newArray = [];
    //             for (const key in responseData) {
    //                 newArray.push({
    //                     id: key,
    //                     amount: responseData[key].amount,
    //                     title: responseData[key].title,
    //                 });
    //             }
    //             onFilter(newArray);
    //         });
    // }, [search, onFilter]);

    const filter = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        console.log(search);
        const query =
            search.length === 0 ? "" : `?orderBy="title"&equalTo="${search}"`;
        onFilter(query);
    }, [search, onFilter]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input type="text" value={search} onChange={filter} />
                </div>
            </Card>
        </section>
    );
});

export default Search;
