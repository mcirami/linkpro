import React from "react";
import { useDrop } from 'react-dnd';
import ITEM_TYPE from "./Types";
//import statuses  from "./LinkItems";

const DropWrapper = ({ onDrop, children, status}) => {
    const [{ isOver }, drop ] = useDrop({
        accept: ITEM_TYPE,
        canDrop:(item, monitor) => {
            /*const itemIndex = statuses.findIndex(si => si.id === item.id )
            const statusIndex = statuses.findIndex(si => si.id === id);
            return [itemIndex + 1, itemIndex - 1, itemIndex].includes(statusIndex);*/
        },
        drop: (item, monitor) => {
            onDrop(item, monitor, status);
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    });

    return (
        <div ref={drop} className={"drop-wrapper"}>
            {React.cloneElement(children, { isOver })}
        </div>
    )
};

export default DropWrapper;
