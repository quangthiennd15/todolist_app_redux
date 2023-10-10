import React, { useState } from "react";
import { connect } from "react-redux";
import { addTodos } from "../redux/reducer";


const mapStateToProps = (state) => {
    return {
        todos: state,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addTodo: (obj) => dispatch(addTodos(obj)),
    };
};

const Todos = (props) => {
    const [todo, setTodo] = useState("");

    const handleChange = (e) => {
        setTodo(e.target.value);
    };

    const add = async (event) => {
        event.preventDefault();
        if (todo === "") {
            alert("Input is Empty");
        } else {
            await props.addTodo({
                id: Math.floor(Math.random() * 1000),
                item: todo,
                completed: false,
            });
            setTodo("");
        }
    };
    return (
        <div>
            <form onSubmit={(event) => add(event)} className="addTodos">

                <input
                    type="text"
                    onChange={(e) => handleChange(e)}
                    className="todo-input"
                    value={todo}
                />

                <button type="submit" className="addTodoSubmit">Add</button>
            </form>
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(Todos);