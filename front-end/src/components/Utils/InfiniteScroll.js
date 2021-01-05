import React, { Component } from 'react';

export default class InfiniteScroll extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numberDisplayed: this.props.initialNumberDisplayed || 50,
            step: this.props.step || 10,
        }
    }

    handleScroll = event => {
        let target = event.target;
        
        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            this.setState({
                ...this.state,
                numberDisplayed: this.state.numberDisplayed + this.state.step
            });
        }
        if (this.props.onScroll) {
            this.props.onScroll(event);
        }
    };

    render() {
        let children = React.Children.toArray(this.props.children).slice(0, this.state.numberDisplayed);

        return (
            <div onAnimationEnd={this.props.onAnimationEnd} id={this.props.id} onDrop={this.props.onDrop ? this.props.onDrop : null} onDragOver={this.props.onDragOver ? this.props.onDragOver : null} onClick={this.props.onClick} onScroll={this.handleScroll} className={this.props.className}>
                {children}
            </div>
        );
    }
}
