import React, { Component } from 'react';

const EAnimationState = {
    SHOWING: 'showing',
    HIDDEN: 'hidden',
    ENTERING: 'enter',
    LEAVING: 'leave'
};

export default class EzAnimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animationState: this.props.children ? EAnimationState.ENTERING : EAnimationState.HIDDEN,
            buffer: {
                old: null
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.children && this.props.children) {
            this.setState({
                animationState: EAnimationState.ENTERING,
                buffer: {
                    old: null
                }
            });
        }
        else if (prevProps.children && !this.props.children) {
            this.setState({
                animationState: EAnimationState.LEAVING,
                buffer: {
                    old: prevProps.children
                }
            });
        }
    }

    handleAnimationEnd = () => {
        if (this.state.animationState === EAnimationState.ENTERING) {
            this.setState({...this.setState, animationState: EAnimationState.SHOWING});
        }
        else if (this.state.animationState === EAnimationState.LEAVING) {
            this.setState({...this.setState, buffer: { ...this.state.buffer, old: null }, animationState: EAnimationState.HIDDEN});
        }

        if (this.props.onAnimationEnd) {
            this.props.onAnimationEnd();
        }
    };

    getAnimationName = () => {
        switch (this.state.animationState) {
            case EAnimationState.ENTERING:
                return `${this.props.transitionName}-enter ${this.props.transitionName}-enter-active`;
            case EAnimationState.LEAVING:
                return `${this.props.transitionName}-leave ${this.props.transitionName}-leave-active`;
            default:
                return "";
        }
    };
    
    render() {
        let disabled = this.props.disabled === null ? false : this.props.disabled;

        if (!this.props.children && this.state.animationState !== EAnimationState.LEAVING) {
            return <span></span>;
        }
        
        let rootChild = React.Children.toArray(this.state.animationState === EAnimationState.LEAVING ? this.state.buffer.old : this.props.children)[0];

        return React.cloneElement(rootChild, {
                    className: `${rootChild.props.className} ${disabled ? "" : this.getAnimationName()}`,
                    onAnimationEnd: () => this.handleAnimationEnd()
                });
    }
}
