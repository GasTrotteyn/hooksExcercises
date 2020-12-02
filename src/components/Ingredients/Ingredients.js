import React, { useCallback, useEffect, useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
    const [ingredientList, setIngredientList] = useState([]);
    const [search, setSearch] = useState("");

    // const filteredIngredientsHandler = useCallback(
    //     (filteredIngredients) => {
    //         setIngredientList(filteredIngredients);
    //     },
    //     [setIngredientList]
    // );

    // useEffect(() => {
    //     fetch("https://react-hooks-34dd9.firebaseio.com/ingredients.json")
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
    //             setIngredientList(newArray);
    //         });
    // }, []);

    const filteredIngredientsHandler = useCallback(
        (search) => {
            setSearch(search);
        },
        [setSearch]
    );

    useEffect(() => {
        // const query =
        //     search.length === 0 ? "" : `?orderBy="title"&equalTo="${search}"`;

        fetch(
            "https://react-hooks-34dd9.firebaseio.com/ingredients.json" + search
        )
            .then((response) => response.json())
            .then((responseData) => {
                const newArray = [];
                for (const key in responseData) {
                    newArray.push({
                        id: key,
                        amount: responseData[key].amount,
                        title: responseData[key].title,
                    });
                }
                setIngredientList(newArray);
            });
    }, [search]);

    // useEffect(() => {
    //     console.log("rendering ingrdients");
    // }, [ingredientList]);

    const addIngredientHandler = (ingredient) => {
        fetch("https://react-hooks-34dd9.firebaseio.com/ingredients.json", {
            method: "POST",
            body: JSON.stringify(ingredient),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((respData) =>
                setIngredientList((prevList) => [
                    ...prevList,
                    { ...ingredient, id: respData.name },
                ])
            );
    };
    const removeItemHandler = (id) => {
        setIngredientList((prevList) => {
            return prevList.filter((ing) => ing.id !== id);
        });
    };
    return (
        <div className="App">
            <IngredientForm addIgredient={addIngredientHandler} />

            <section>
                <Search onFilter={filteredIngredientsHandler} />
                <IngredientList
                    ingredients={ingredientList}
                    onRemoveItem={removeItemHandler}
                />
            </section>
        </div>
    );
};

export default Ingredients;
