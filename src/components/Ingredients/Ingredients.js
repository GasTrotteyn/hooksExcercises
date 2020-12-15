import React, {
    useCallback,
    useEffect,
    useReducer,
    useState,
    useMemo,
} from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import Spinner from "../UI/LoadingIndicator";
import Modal from "../UI/ErrorModal";

const ingredientReducer = (courrentIngredients, action) => {
    switch (action.type) {
        case "SET":
            return action.newIngredients;
        case "ADD":
            return [...courrentIngredients, action.newIngredient];
        case "DELETE":
            return courrentIngredients.filter((ing) => ing.id !== action.id);
        default:
            throw new Error("You shoul not get there!");
    }
};

const httpStateReducer = (prevHttpState, action) => {
    switch (action.type) {
        case "SEND":
            return { loading: true, error: null };
        case "RESPONSE":
            return { ...prevHttpState, loading: false };
        case "ERROR":
            return { loading: false, error: action.errorMessage };
        case "CLEAR":
            return { ...prevHttpState, error: null };
        default:
            throw new Error("Dispatch without case!");
    }
};

const Ingredients = () => {
    const [ingredientList, dispatch] = useReducer(ingredientReducer, [
        //{ title: "inicial", amount: "5" },
    ]);
    //const [ingredientList, setIngredientList] = useState([]);
    const [search, setSearch] = useState("");

    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState();

    const [httpState, httpDispatch] = useReducer(httpStateReducer, {
        loading: false,
        error: null,
    });

    const filteredIngredientsHandler = useCallback(
        (search) => {
            setSearch(search);
        },
        [setSearch]
    );

    useEffect(() => {
        //setLoading(true);
        httpDispatch({ type: "SEND" });
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
                dispatch({ type: "SET", newIngredients: newArray });
                //setLoading(false);
                httpDispatch({ type: "RESPONSE" });
            })
            .catch((error) => {
                //setError(error.mesage);
                httpDispatch({ type: "ERROR", errorMessage: error.message });
            });
    }, [search]);

    const addIngredientHandler = useCallback((ingredient) => {
        //setLoading(true);
        httpDispatch({ type: "SEND" });
        fetch("https://react-hooks-34dd9.firebaseio.com/ingredients.json", {
            method: "POST",
            body: JSON.stringify(ingredient),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((respData) => {
                //setLoading(false);
                httpDispatch({ type: "RESPONSE" });
                // setIngredientList((prevList) => [
                //     ...prevList,
                //     { ...ingredient, id: respData.name },
                // ]);
                dispatch({
                    type: "ADD",
                    newIngredient: { ...ingredient, id: respData.name },
                });
            })
            .catch((error) => {
                httpDispatch({ type: "ERROR", errorMessage: error.message });
            });
    }, []);
    const removeItemHandler = useCallback((id) => {
        //setLoading(true);
        httpDispatch({ type: "SEND" });
        fetch(
            `https://react-hooks-34dd9.firebaseio.com/ingredients/${id}.json`,
            {
                method: "DELETE",
            }
        )
            .then((resp) => {
                // setIngredientList((prevList) => {
                //     return prevList.filter((ing) => ing.id !== id);
                // });
                dispatch({ type: "DELETE", id: id });
                //setLoading(false);
                httpDispatch({ type: "RESPONSE" });
            })
            .catch((error) => {
                //setError("Sorry, the Cosmos is like this...");
                httpDispatch({ type: "ERROR", errorMessage: error.message });
            });
    }, []);

    const clearError = useCallback(() => {
        // setError(null);
        // setLoading(false);
        httpDispatch({ type: "CLEAR" });
    }, []);

    const list = useMemo(() => {
        return (
            <IngredientList
                ingredients={ingredientList}
                onRemoveItem={removeItemHandler}
            />
        );
    }, [ingredientList, removeItemHandler]);

    return (
        <div className="App">
            {httpState.error && (
                <Modal onClose={clearError}>{httpState.error}</Modal>
            )}
            <IngredientForm addIgredient={addIngredientHandler} />
            {httpState.loading && <Spinner />}
            <section>
                <Search onFilter={filteredIngredientsHandler} />
                {list}
            </section>
        </div>
    );
};

export default Ingredients;
