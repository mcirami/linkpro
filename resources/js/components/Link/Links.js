import React, {useCallback, useContext, useEffect, useState} from 'react';
import {MdDragHandle, MdEdit} from 'react-icons/md';
import Switch from "react-switch";
//import {LinksContext, PageContext} from '../App';
import EventBus from '../../Utils/Bus';
import {Motion, spring} from 'react-motion';
import myLinksArray from './LinkItems';
import SubmitForm from './SubmitForm';

const springSetting1 = { stiffness: 180, damping: 10 };
const springSetting2 = { stiffness: 120, damping: 17 };

function reinsert(arr, from, to) {
    const _arr = arr.slice(0);
    const val = _arr[from];
    _arr.splice(from, 1);
    _arr.splice(to, 0, val);
    return _arr;
}

function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}

const Links = ({
   userLinks,
   setUserLinks,
   editID,
   setEditID,
}) => {


    //const  { userLinks, setUserLinks } = useContext(LinksContext);

    const [originalArray, setOriginalArray] = useState(myLinksArray);
    const [size, setSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });

    const [state, setState] = useState(() => ({
        mouseXY: [0,0],
        mouseCircleDelta: [0,0], // difference between mouse and circle pos for x + y coords, for dragging
        lastPress: null,
        isPressed: false,
    }));

    const getColWidth = () => {
        let colWidth;
        const windowWidth = window.innerWidth;

        if (windowWidth < 550 ) {
            colWidth = ((3 * windowWidth)) / 11;
        }else if (windowWidth < 992) {
            colWidth = ((3 * windowWidth - 25)) / 10;
        } else if (windowWidth < 1200) {
            colWidth = ((3 * windowWidth - 50) / 2 ) / 9.5;
        } else if (windowWidth < 1500) {
            colWidth = ((3 * windowWidth - 50) / 2) / 10
        } else {
            colWidth = 230;
        }

        return colWidth;
    };

    const getColHeight = () => {
        let colHeight;
        const windowWidth = window.innerWidth;

        if (windowWidth < 992 ) {
            colHeight = (3 * windowWidth - 50) / 10 + 25;
        } else if (windowWidth < 1200) {
            colHeight = ((3 * windowWidth - 50) / 2 ) / 8.75 + 20;
        } else if (windowWidth < 1500) {
            //colWidth = (window.innerWidth / 2) / 3 - 15;
            colHeight = ((3 * windowWidth - 50) / 2) / 10 + 20;
        } else {
            colHeight = 250;
        }

        return colHeight;
    };

    let [width, height] = [getColWidth(), getColHeight()];

    //console.log("width: " + size.width + " height: " + size.height)
    useEffect(() => {
        function handleResize() {
            setSize({
                height: getColHeight(),
                width: getColWidth(),
            })
            /*[width, height] = [getColWidth(), getColHeight()];*/
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    });

    // indexed by visual position
    const layout = userLinks.map((link, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return [width * col, height * row];
    });

    const handleMouseDown = useCallback (
        (key, [pressX, pressY], { pageX, pageY }) => {
            setState((state) => ({
                ...state,
                lastPress: key,
                isPressed: true,
                mouseCircleDelta: [pageX - pressX, pageY - pressY],
                mouseXY: [pressX, pressY],
            }));
        },
        []

    );

    const handleTouchStart = useCallback(
        (key, pressLocation, e) => {
            handleMouseDown(key, pressLocation, e.touches[0]);
        },
        [handleMouseDown]
    );

    const handleMouseMove = useCallback(
        ({ pageX, pageY }) => {
            const {
                lastPress,
                isPressed,
                mouseCircleDelta: [dx, dy],
            } = state;

            if (isPressed) {
                const mouseXY = [pageX - dx, pageY - dy];
                const col = clamp(Math.floor(mouseXY[0] / width), 0, 2);
                const row = clamp(
                    Math.floor(mouseXY[1] / height),
                    0,
                    Math.floor(userLinks.length / 3)
                );
                let index = row * 3 + col;

                //console.log(userLinks[index].id);
                if (!userLinks[index].id.toString().includes("new")) {
                    const newOrder = reinsert(
                        userLinks,
                        userLinks.findIndex((link) => link.position === lastPress),
                        index,
                    );
                    setState((state) => ({ ...state, mouseXY }));
                    setUserLinks(newOrder);
                    handleSubmit();
                }
            }
        },
        [state]
    );

    const handleTouchMove = useCallback(
        (e) => {
            e.preventDefault();
            handleMouseMove(e.touches[0]);
        },
        [handleMouseMove]
    );

    const handleMouseUp = useCallback(() => {
        setState((state) => ({
            ...state,
            isPressed: false,
            mouseCircleDelta: [0, 0]
        }));
    }, []);

    useEffect(() => {
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleTouchMove, handleMouseUp, handleMouseMove]);

    const {lastPress, isPressed, mouseXY } = state;

    const handleSubmit = () => {
        const newPostionsArray = userLinks.map((link, index) => ({...link, position: index}));

        const packets = {
            userLinks: newPostionsArray,
        }

        axios
        .post("/dashboard/links/update-positions", packets)
        .then(
            (response) => {
                console.log(JSON.stringify(response.data.message))
            }
        )
        .catch((error) => {
            console.log("ERROR:: ", error.response.data);
        });
    }

    const handleChange = (currentItem) => {
        const newStatus = !currentItem.active_status;

        const packets = {
            active_status: newStatus,
        };

        axios
        .post("/dashboard/links/status/" + currentItem.id, packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data))
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                setOriginalArray(
                    originalArray.map((item) => {
                        if (item.id === currentItem.id) {
                            return {
                                ...item,
                                active_status: newStatus,
                            };
                        }
                        return item;
                    })
                )
                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === currentItem.id) {
                            return {
                                ...item,
                                active_status: newStatus,
                            };
                        }
                        return item;
                    })
                )
            }
        )
        .catch((error) => {
            if (error.response !== undefined) {
                console.log("ERROR:: ", error.response.data);
            } else {
                console.log("ERROR:: ", error);
            }

        });
    };

    return (
        <>
            {userLinks.map((link, key) => {
                let style;
                let x;
                let y;

                const visualPosition = userLinks.findIndex((link) => link.position === key);
                if (key === lastPress && isPressed) {
                    [x, y] = mouseXY;
                    style = {
                        translateX: x,
                        translateY: y,
                        scale: spring(1.2, springSetting1),
                        boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
                    };
                } else {
                    [x, y] = layout[visualPosition];
                    style = {
                        translateX: spring(x, springSetting2),
                        translateY: spring(y, springSetting2),
                        scale: spring(.75, springSetting1),
                        boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1)
                    };
                }

                const linkID = originalArray[key].id;

                return (
                    <Motion key={key} style={style}>
                        {({ translateX, translateY, scale, boxShadow }) => (
                            <div
                                className="icon_col"
                                style={{
                                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                                    zIndex: key === lastPress ? 2 : 1,
                                    //boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                                    userSelect: "none"
                                }}
                            >

                                {linkID.toString().includes("new") ?
                                    <span>
                                        <MdDragHandle/>
                                    </span>
                                    :
                                    <span
                                        onMouseDown={handleMouseDown.bind(null,
                                            key, [x, y])}
                                        onTouchStart={handleTouchStart.bind(
                                            null, key, [x, y])}
                                    >
                                        <MdDragHandle/>
                                    </span>
                                }

                                <div className="column_content">
                                    <button className="edit_icon" onClick={(e) => { setEditID(linkID) }} >
                                        <MdEdit />
                                    </button>
                                    <div className="icon_wrap">
                                        <img src={ originalArray[key].icon || '/images/icon-placeholder.png' } alt=""/>
                                    </div>
                                    <div className="my_row">
                                        <div className="switch_wrap">
                                           {/* {console.log(Boolean(link.active_status)) || null}*/}
                                            <Switch
                                                onChange={(e) => handleChange(originalArray[key])}
                                                disabled={linkID.toString().includes("new")}
                                                height={20}
                                                checked={Boolean(originalArray[key].active_status)}
                                                // checked={Boolean(link.active_status)}
                                                onColor="#424fcf"
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Motion>
                )
            })}
            {editID ? (
                <SubmitForm
                    editID={editID}
                    setEditID={setEditID}
                    setUserLinks={setUserLinks}
                    userLinks={userLinks}
                    originalArray={originalArray}
                    setOriginalArray={setOriginalArray}
                />
            ) : (
                ""
            )}
        </>
    );
};

export default Links;
