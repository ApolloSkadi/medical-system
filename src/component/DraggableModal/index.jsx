import { Modal } from 'antd'
import Draggable from 'react-draggable'
import { useState, useRef } from 'react'

export default ({
    title,
    children,
    ...props
}) => {
    // 拖拽功能
    const draggableRef = useRef();
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const [disabled, setDisabled] = useState(true);
    const onStart = (_event, uiData) => {
        const {clientWidth, clientHeight} = window.document.documentElement;
        const targetRect = draggableRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };
    return (
        <Modal
            centered
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                    }}
                    onMouseOver={() => {
                        if (disabled) setDisabled(false);
                    }}
                    onMouseOut={() => setDisabled(true)}
                >
                    {title}
                </div>
            }
            modalRender={modal => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    nodeRef={draggableRef}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggableRef}>{modal}</div>
                </Draggable>
            )}
            className={'ant-model_scroll'}
            {...props}
        >
            {children}
        </Modal>
    )
}
