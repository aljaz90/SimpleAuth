import React, { Component } from 'react';

const EAnimationState = {
    IDLE: 'idle',
    ENTERING: 'enter',
    LEAVING: 'leave'
};

export default class EzAnime extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            animationState: this.props.disabled ? EAnimationState.IDLE : EAnimationState.ENTERING,
            buffer: {
                old: null
            }
        };
    }

    componentDidUpdate(prevProps, prevState) {
        let newRootChild = React.Children.toArray(this.props.children)[0];
        let prevRootChild = React.Children.toArray(prevProps.children)[0];

        if (prevRootChild.props.id !== newRootChild.props.id && this.state.animationState === EAnimationState.IDLE) {
            let oldChildren = prevProps.children;
            
            this.setState({
                animationState: EAnimationState.LEAVING,
                buffer: {
                    old: oldChildren
                }
            });
        }
    }

    handleAnimationEnd = () => {
        if (this.state.animationState === EAnimationState.ENTERING) {
            this.setState({...this.setState, animationState: EAnimationState.IDLE});
        }
        else if (this.state.animationState === EAnimationState.LEAVING) {
            this.setState({...this.setState, buffer: { ...this.state.buffer, old: null }, animationState: EAnimationState.ENTERING});
        }

        if (this.props.onAnimationEnd) {
            this.props.onAnimationEnd();
        }
    }

    getAnimationName = () => {
        switch (this.state.animationState) {
            case EAnimationState.ENTERING:
                return `${this.props.transitionName}-enter`;
            case EAnimationState.LEAVING:
                return `${this.props.transitionName}-leave`;
            default:
                return "";
        }

    };

    
    render() {
        let disabled = this.props.disabled === null ? false : this.props.disabled;
        let rootChild = React.Children.toArray(this.state.animationState === EAnimationState.LEAVING && !disabled ? this.state.buffer.old : this.props.children)[0];

        return  React.cloneElement(rootChild, {
                    className: `${rootChild.props.className} ${disabled ? "" : this.getAnimationName()}`,
                    onAnimationEnd: () => this.handleAnimationEnd()
                });
    }
}
