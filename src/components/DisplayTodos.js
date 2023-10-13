import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    addTodos,
    completeTodos,
    removeTodos,
    updateTodos,
} from "../redux/reducer";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const mapStateToProps = (state) => {
    return {
        todos: state,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addTodo: (obj) => dispatch(addTodos(obj)),
        removeTodo: (id) => dispatch(removeTodos(id)),
        updateTodo: (obj) => dispatch(updateTodos(obj)),
        completeTodo: (id) => dispatch(completeTodos(id)),
    };
};
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


const DisplayTodos = (props) => {
    const [sort, setSort] = useState("active");

    const [dragDropList, setDragDropList] = useState([]);


    useEffect(() => {
        // console.log({ props });
        // if (!props.todos.length) return;
        const filteredTodos = props.todos.filter(item => {
            if (sort === "active") return !item.completed;
            if (sort === "completed") return item.completed;
            return true;
        });


        setDragDropList(filteredTodos);
        localStorage.setItem("todos", JSON.stringify(props.todos));
        console.log(JSON.parse(localStorage.getItem("todos")));

    }, [props.todos, sort]);

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const reorderedItems = reorder(
            dragDropList,
            result.source.index,
            result.destination.index
        );

        setDragDropList(reorderedItems);
    };

    return (
        <div className="displaytodos">
            <div className="buttons">
                <button
                    className={sort === "active" ? "selected" : ""}
                    onClick={() => setSort("active")}
                >
                    To do
                </button>
                <button
                    className={sort === "completed" ? "selected" : ""}
                    onClick={() => setSort("completed")}
                >
                    Completed
                </button>
                <button
                    className={sort === "all" ? "selected" : ""}
                    onClick={() => setSort("all")}
                >
                    All
                </button>
            </div>
            <ul>
                <DragDropContext onDragEnd={onDragEnd} >
                    <Droppable droppableId="1" >

                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >

                                {
                                    dragDropList
                                        .filter((item, index) => {
                                            if (sort === "active") return !item.completed;
                                            if (sort === "completed") return item.completed;
                                            return true;
                                        })
                                        .map((item, index) => (

                                            <Draggable draggableId={item.id} key={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TodoItem
                                                            key={item.id}
                                                            item={item}
                                                            removeTodo={props.removeTodo}
                                                            updateTodo={props.updateTodo}
                                                            completeTodo={props.completeTodo}

                                                        />

                                                    </div>
                                                )}
                                            </Draggable>


                                        ))}
                                {provided.placeholder}
                            </div>
                        )}

                    </Droppable>
                </DragDropContext>
            </ul>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DisplayTodos);