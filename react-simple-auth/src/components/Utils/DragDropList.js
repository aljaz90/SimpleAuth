import React, { Component } from 'react';
import InfiniteScroll from './InfiniteScroll';

const EDragDropListType = {
    ROW: "row",
    COLUMN: "column",
    GRID: "grid"
}

export default class DragDropList extends Component {

    constructor(props) {
        super(props);

        let type = EDragDropListType.COLUMN;
        if (props.type === "grid") {
            type = EDragDropListType.GRID;
        }
        else if (props.type === "row") {
            type = EDragDropListType.ROW;
        }

        this.state = {
            dragPosition: {
                initX: null,
                initY: null,
                offsetY: null,
                offsetX: null
            },
            draggedElement: null,
            clonedElement: null,
            container: null,
            scrollY: null,
            lastRow: false,
            type: type
        };
    }

    checkLastRow = (target, container) => {
        let draggableElements = [...container.childNodes]
            .filter(el => el.draggable)
            .map(el => ({el: el, yPosition: el.getBoundingClientRect().top}))
            .sort((a, b) => b.yPosition - a.yPosition);

        let lastRowPos = draggableElements.length > 0 ? draggableElements[0].yPosition : 0;

        return target.getBoundingClientRect().top === lastRowPos;
    };

    handleOnDragStart = e => {
        e.stopPropagation();
        e.persist();

        let target = e.target;
        let container = target.parentNode;
        
        let dragImgEl = document.createElement('span');
        dragImgEl.setAttribute(
            'style',
            'position: absolute; display: block; top: 0;left: 0; width: 0; height: 0;'
        );
        e.dataTransfer.setDragImage(dragImgEl, 0, 0);

        let clientY = e.clientY;
        let clientX = e.clientX;
        let lastRow = this.checkLastRow(target, container);

        setTimeout(() => { 
            let clonedEl = target.cloneNode(true);
            clonedEl.id = clonedEl.id + "_clone";
            container.appendChild(clonedEl);
            
            target.style.opacity = 0;
            
            let offsetY = clientY - target.getBoundingClientRect().top;
            let positionY = clientY - offsetY - container.getBoundingClientRect().top;
            
            let offsetX = 0;
            let positionX = 0;
    
            if (this.state.scrollY) {
                positionY = clientY - offsetY - container.getBoundingClientRect().top + this.state.scrollY;
            }
    
            if (["grid", "row"].includes(this.state.type)) {
                offsetX = clientX - target.getBoundingClientRect().left;
                positionX = clientX - offsetX - container.getBoundingClientRect().left;
                if (lastRow) {
                    positionX += target.offsetWidth / 2;
                }
            }
            
            if (this.state.type === "row") {                
                offsetX = clientX - target.getBoundingClientRect().left - 60;
                positionX = clientX - offsetX - container.getBoundingClientRect().left;                
            }
    
            clonedEl.setAttribute(
                'style',
                `position: absolute; width: ${target.offsetWidth}px; height: ${target.offsetHeight}px; top: ${positionY}px; left: ${positionX}px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);`
            );
            clonedEl.setAttribute('draggable', false);
    
            this.setState({
                ...this.state,
                dragPosition: {
                    initX: e.clientX,
                    initY: e.clientY,
                    offsetY: offsetY,
                    offsetX: offsetX
                },
                draggedElement: target,
                clonedElement: clonedEl,
                container: container,
                lastRow: lastRow,
            });
        }, 10)
    };

    changeChildPosition = (element, direction) => {    
        let parent = element.parentNode;
        if (direction === -1 && element.previousElementSibling) {
            parent.insertBefore(element, element.previousElementSibling);
        } 
        else if (direction === 1 && element.nextElementSibling) {
            parent.insertBefore(element, element.nextElementSibling.nextElementSibling)
        }
    }

    checkGridPositions = (element, positionX, positionY, usingScrollY=false) => {
        let parent = element.parentNode;
        let clonedElement = this.state.clonedElement;

        if (
            element.nextElementSibling && 
            clonedElement.getBoundingClientRect().left + element.offsetWidth / 2 > element.nextElementSibling.getBoundingClientRect().left && 
            element.getBoundingClientRect().top === element.nextElementSibling.getBoundingClientRect().top
        ) {
            parent.insertBefore(element, element.nextElementSibling.nextElementSibling);
        }
        else if (
            element.previousElementSibling && 
            clonedElement.getBoundingClientRect().left < element.previousElementSibling.getBoundingClientRect().left + element.offsetWidth / 2 &&
            element.getBoundingClientRect().top === element.previousElementSibling.getBoundingClientRect().top
        ) {
            parent.insertBefore(element, element.previousElementSibling);
        }
        else if (
            element.previousElementSibling && 
            clonedElement.getBoundingClientRect().left < element.previousElementSibling.getBoundingClientRect().left + element.offsetWidth / 2 &&
            element.getBoundingClientRect().top === element.previousElementSibling.getBoundingClientRect().top
        ) {
            parent.insertBefore(element, element.previousElementSibling);
        }
        else if (clonedElement.getBoundingClientRect().top <= element.getBoundingClientRect().top - element.offsetHeight / 2 || clonedElement.getBoundingClientRect().top >= element.getBoundingClientRect().top + element.offsetHeight / 2) {
            let draggableElements = [...this.state.container.childNodes]
                .filter(el => el.draggable && el.getBoundingClientRect().top !== element.getBoundingClientRect().top && Math.abs(clonedElement.getBoundingClientRect().top - el.getBoundingClientRect().top) < element.offsetHeight / 2)
                .map(el => ({el: el, xDistance: Math.abs(clonedElement.getBoundingClientRect().left - el.getBoundingClientRect().left)}))
                .sort((a, b) => a.xDistance - b.xDistance);
            
            if (draggableElements.length > 0) {
                parent.insertBefore(element, draggableElements[0].el.nextElementSibling);
            }
        }

    };

    checkColumnPositions = (prevEl, element, positionY, nextEl, container, usingScrollY=false) => {
        let draggedElTopPosFromCenter = positionY + element.offsetHeight / 2;
        if (usingScrollY) {
            draggedElTopPosFromCenter -= this.state.scrollY;
        }

        if (prevEl && prevEl.draggable && prevEl.offsetHeight > element.offsetHeight && (draggedElTopPosFromCenter - element.offsetHeight / 2) < (prevEl.getBoundingClientRect().top - container.getBoundingClientRect().top + prevEl.offsetHeight / 2)) {
            this.changeChildPosition(this.state.draggedElement, -1);
        }
        else if (prevEl && prevEl.draggable && prevEl.offsetHeight <= element.offsetHeight && draggedElTopPosFromCenter < (prevEl.getBoundingClientRect().top - container.getBoundingClientRect().top + prevEl.offsetHeight)) {
            this.changeChildPosition(this.state.draggedElement, -1);
        }
        else if (nextEl && nextEl.draggable  && nextEl.offsetHeight > element.offsetHeight && (draggedElTopPosFromCenter + element.offsetHeight / 2) > (nextEl.getBoundingClientRect().top - container.getBoundingClientRect().top + nextEl.offsetHeight / 2)) {
            this.changeChildPosition(this.state.draggedElement, 1);
        }
        else if (nextEl && nextEl.offsetHeight <= element.offsetHeight && nextEl.draggable && draggedElTopPosFromCenter > (nextEl.getBoundingClientRect().top - container.getBoundingClientRect().top)) {
            this.changeChildPosition(this.state.draggedElement, 1);
        }
    };
    
    checkRowPositions = (prevEl, element, positionX, nextEl, container) => {
        let draggedElLeftPosFromCenter = positionX + element.offsetWidth / 2;

        if (prevEl && prevEl.draggable && prevEl.offsetWidth > element.offsetWidth && (draggedElLeftPosFromCenter - element.offsetWidth / 2) < (prevEl.getBoundingClientRect().left - container.getBoundingClientRect().left + prevEl.offsetWidth / 2)) {
            this.changeChildPosition(this.state.draggedElement, -1);
        }
        else if (prevEl && prevEl.draggable && prevEl.offsetWidth <= element.offsetWidth && draggedElLeftPosFromCenter < (prevEl.getBoundingClientRect().left - container.getBoundingClientRect().left + prevEl.offsetWidth)) {
            this.changeChildPosition(this.state.draggedElement, -1);
        }
        else if (nextEl && nextEl.draggable  && nextEl.offsetWidth > element.offsetWidth && (draggedElLeftPosFromCenter + element.offsetWidth / 2) > (nextEl.getBoundingClientRect().left - container.getBoundingClientRect().left + nextEl.offsetWidth / 2)) {
            this.changeChildPosition(this.state.draggedElement, 1);
        }
        else if (nextEl && nextEl.offsetWidth <= element.offsetWidth && nextEl.draggable && draggedElLeftPosFromCenter > (nextEl.getBoundingClientRect().left - container.getBoundingClientRect().left)) {
            this.changeChildPosition(this.state.draggedElement, 1);
        }
    };

    handleOnDragOver = e => {
        e.preventDefault();

        if (!this.state.draggedElement || !this.state.container) {
            return;
        }

       let positionY = e.clientY - this.state.dragPosition.offsetY - this.state.container.getBoundingClientRect().top;
       let positionX = 0;

        if (this.state.scrollY) {
            positionY = e.clientY - this.state.dragPosition.offsetY - this.state.container.getBoundingClientRect().top + this.state.scrollY;
        }

        if (["grid", "row"].includes(this.state.type)) {
            positionX = e.clientX - this.state.dragPosition.offsetX - this.state.container.getBoundingClientRect().left;
            if (this.state.lastRow) {
                positionX += this.state.draggedElement.offsetWidth / 2;
            }

            let maxPositionX = this.state.container.offsetWidth - this.state.draggedElement.offsetWidth;

            // Limiting X movement to the continer
            if (positionX < 0) {
                positionX = 0;
            }
            else if (positionX > maxPositionX) {
                positionX = maxPositionX;
            }
        }

        // Workaround for row container
        if (this.state.type === "row") {                
            positionX = e.clientX - this.state.dragPosition.offsetX - this.state.container.getBoundingClientRect().left; 
            
            let maxPositionX = this.state.container.offsetWidth - this.state.draggedElement.offsetWidth;

            // Limiting X movement to the continer
            if (positionX < 0) {
                positionX = 0;
            }
            else if (positionX > maxPositionX) {
                positionX = maxPositionX;
            }
        }

        // Limiting Y movement to the continer
        let maxPositionY = (this.state.scrollY !== null ? this.state.container.scrollHeight : this.state.container.offsetHeight) - this.state.draggedElement.offsetHeight;
        if (positionY < 0) {
            positionY = 0;
        }
        else if (positionY > maxPositionY) {
            positionY = maxPositionY;
        }        

        let clonedEl = this.state.clonedElement;
        clonedEl.style.top = `${positionY}px`;
        clonedEl.style.left = `${positionX}px`;

        let prevEl = this.state.draggedElement.previousElementSibling;
        let nextEl = this.state.draggedElement.nextElementSibling;

        switch (this.state.type) {
            case EDragDropListType.ROW:
                this.checkRowPositions(prevEl, this.state.draggedElement, positionX, nextEl, this.state.container);
                break;
            case EDragDropListType.GRID:
                this.checkGridPositions(this.state.draggedElement, positionX, positionY, Boolean(this.state.scrollY));
                break;
            case EDragDropListType.COLUMN:
                this.checkColumnPositions(prevEl, this.state.draggedElement, positionY, nextEl, this.state.container, Boolean(this.state.scrollY));
                break;
            default:
                break;
        }
    };
    
    handleOnDrop = () => {
        let draggedEl = this.state.draggedElement;

        if (!draggedEl || !this.state.container) {
            return;
        }

        draggedEl.style.opacity = 1;
        this.state.clonedElement.remove();
        
        if (this.props.onOrderChanged) {
            let children = [...this.state.container.childNodes].filter(el => el.draggable).map(el => el.id);
            this.props.onOrderChanged(children)
        }

        this.setState({
            ...this.state,
            dragPosition: {
                initX: null,
                initY: null,
                offsetY: null,
                offsetX: null
            },
            draggedElement: null,
            clonedElement: null,
            container: null,
            lastRow: false
        });
    };

    handleOnDragCancel = () => {
        this.handleOnDrop();
    };

    dealWithScroll = e => {
        this.setState({
            ...this.state,
            scrollY: e.target.scrollTop
        });
    };

    render() {
        let children = React.Children.toArray(this.props.children);

        if (this.props.usingInfiniteScroll) {
            return (
                <InfiniteScroll onAnimationEnd={this.props.onAnimationEnd} id={this.props.id} onScroll={this.dealWithScroll} onDragOver={!this.props.disabled ? this.handleOnDragOver : null} initialNumberDisplayed={this.props.initialNumberDisplayed} step={this.props.step} className={this.props.className}>
                    {
                        children.map(child => {
                            if (child.props.draggable && !this.props.disabled) {
                                return React.cloneElement(child, {
                                    onDragStart: e => this.handleOnDragStart(e),
                                    onDragEnd: () => this.handleOnDragCancel()
                                });
                            }
                            return child;
                        })
                    }
                </InfiniteScroll>
            );
        }

        return (
            <div onAnimationEnd={this.props.onAnimationEnd} id={this.props.id} onDragOver={!this.props.disabled ? this.handleOnDragOver : null} onClick={this.props.onClick ? this.props.onClick : null} className={this.props.className}>
                {
                    children.map(child => {
                        if (child.props.draggable && !this.props.disabled) {
                            return React.cloneElement(child, {
                                onDragStart: e => this.handleOnDragStart(e),
                                onDragEnd: () => this.handleOnDragCancel()
                            });
                        }
                        return child;
                    })
                }
            </div>
        );
    }
}
