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
    // const [dragDropList, setDragDropList] = useState([]);
    // // useEffect(() => {
    // //     console.log(dragDropList);
    // // }, [dragDropList]);

    // const onDragComplete = (result) => {
    //     console.log(props.todos);
    //     if (!result.destination) return;

    //     const arr = [...props.todos];

    //     // Sử dụng result.source.index và result.destination.index để di chuyển phần tử
    //     let [removedItem] = arr.splice(result.source.index, 1);
    //     arr.splice(result.destination.index, 0, removedItem);

    //     // Cập nhật lại dragDropList sau khi kéo và thả
    //     setDragDropList(arr);
    //     console.log(dragDropList);


    // };


    const [dragDropList, setDragDropList] = useState([]);
    useEffect(() => {
        // Lọc danh sách todos dựa trên giá trị mới của sort
        const filteredTodos = props.todos.filter(item => {
            if (sort === "active") return !item.completed;
            if (sort === "completed") return item.completed;
            return true;
        });

        // Cập nhật dragDropList với danh sách đã lọc
        setDragDropList(filteredTodos);
    }, [props.todos, sort]);

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        const sourceItem = dragDropList[sourceIndex];
        const destinationItem = dragDropList[destinationIndex];

        // if (sourceItem.sort === destinationItem.sort) {
        const reorderedItems = reorder(
            dragDropList,
            sourceIndex,
            destinationIndex
        );

        console.log({ reorderedItems });
        setDragDropList(reorderedItems);
        // }
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