import React, { useState } from 'react';
import axios from 'axios';
import EzAnimate from '../components/Animations/EzAnimate';
import OutsideClick from '../components/Utils/OutsideClick';
import { SidebarItem } from '../components/Sidebar/SidebarItem';
import { Link, NavLink } from 'react-router-dom';
import { signOut, getInitialsForName } from '../Utils';
import { ImageSelector } from '../components/Forms/ImageSelector';
import { IonIcon } from '../components/IonIcons/IonIcon';

export const Layout = props => {
    const [showingMyCourses, setShowingMyCourses] = useState(false);
    const [showingImageSelection, setShowingImageSelection] = useState(false);
    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    const changeImage = async imageUrl => {
        setShowingImageSelection(false);
        const requestBody = {
            image_url: imageUrl
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            await axios.put("http://localhost:4000/api/user", requestBody, config);
            props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Profile picture updated successfully",
                time: 1.5
            });
            props.setUser({...props.user, image_url: imageUrl});
        } 
        catch (err) {
            console.error("An error occured while trying to change the profile picture");
            console.log(err);
            props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to change the profile picture",
                time: 1.5
            });
        }
    };

    return (
        <React.Fragment>
            <ImageSelector showNotification={props.showNotification} user={props.user} setUser={props.setUser} showing={showingImageSelection} onSelect={changeImage} onClose={() => setShowingImageSelection(false)} />
            <div className="nav">
                <div onClick={e => { e.stopPropagation(); setHamburgerOpen(!hamburgerOpen); }} className={`nav--hamburger ${hamburgerOpen ? "nav--hamburger-active" : ""}`}>
                    <div className="nav--hamburger--icon" />
                </div>
                <div style={{backgroundImage: `url(/logo-blue.png)`}} className="nav--logo" />
                <div className="nav--nav">
                    { !props.isAuthenticated ?
                    <React.Fragment>
                        <NavLink activeClassName="nav--nav--item-active" className="nav--nav--item" to="/signin">
                        Sign in
                        </NavLink>
                        <NavLink activeClassName="nav--nav--item-active" className="nav--nav--item" to="/signup">
                        Sign up
                        </NavLink>
                    </React.Fragment>
                    :
                    <div className="nav--nav--account">
                        <div style={{backgroundImage: `url(${props.user.image_url ? props.user.image_url.replaceAll(" ", "%20") : null})`}} className="nav--nav--account--icon">
                            {props.user.image_url ? "" : getInitialsForName(props.user.name)}
                        </div>
                        <div className="nav--nav--account--dropdown">
                            <div className="nav--nav--account--dropdown--item-header">
                                <div onClick={() => setShowingImageSelection(true)} className="nav--nav--account--dropdown--image_container">
                                    <IonIcon className={`nav--nav--account--dropdown--image-edit ${!props.user.image_url ? "nav--nav--account--dropdown--image-edit-dark" : ""}`} icon="create-outline" />
                                    <div style={{backgroundImage: `url(${props.user.image_url ? props.user.image_url.replaceAll(" ", "%20") : null})`}} className={`nav--nav--account--icon nav--nav--account--dropdown--item-icon ${props.user.image_url ? "nav--nav--account--dropdown--image" : null}`}>
                                        {props.user.image_url ? "" : getInitialsForName(props.user.name)}
                                    </div>
                                </div>
                                <div className="nav--nav--account--dropdown--item-text">
                                    {props.user.name}
                                </div>  
                                <div className="nav--nav--account--dropdown--item-email">
                                    {props.user.email}
                                </div>  
                            </div>
                            <Link to="/account?tab=account" className="nav--nav--account--dropdown--item">
                                Edit account
                            </Link>
                            <div onClick={() => { window.location.replace("/signin"); signOut(props.saveUserData); }} className="nav--nav--account--dropdown--item">
                                Sign out
                            </div>  
                        </div>  
                    </div>
                    }
                </div>
            </div>
            <div className="sidebar">
                <div className="sidebar--header">
                    <div className="sidebar--header--icon"></div>
                </div>
                <SidebarItem disabled={!props.isAuthenticated} icon="home-outline" name="Dashboard" to="/dashboard" />
                <SidebarItem disabled={!props.isAuthenticated} active={showingMyCourses} onClick={() => setShowingMyCourses(!showingMyCourses)} icon="bookmarks-outline" name="Enrolls" to="" />
                <SidebarItem icon="apps-outline" name="Categories" to="/courses" />
                <SidebarItem disabled={!props.isAuthenticated} icon="school-outline" name="Teach" to="/my-courses" />
                <SidebarItem icon="help-outline" name="Help" to="/support" />
            </div>
            <OutsideClick exceptions={[null, "sidebar--item", "sidebar--item--background", "sidebar--item--icon", "sidebar--item--icon--icon"]} onOutsideClick={() => setShowingMyCourses(false)}>
                <EzAnimate
                    transitionName="animation--sidebar--my_courses"
                    className="my_courses"
                >
                    { showingMyCourses && 
                        <div className="my_courses">
                            <div className="my_courses--header">
                                Enrolls
                                <IonIcon onClick={() => setShowingMyCourses(false)} className="my_courses--header--close" name="close-outline" />
                            </div>
                            <div className="my_courses--courses">
                                {
                                    props.enrolls.map(enroll => {
                                        const course = props.courses.find(el => el._id === enroll.course);
                                        if (!course) {
                                            return null;
                                        }
                                        const percentage = course.lessons.length === 0 ? 0 : Math.floor((enroll.completed_lessons.length / course.lessons.length)*100);
                                        return (
                                            <Link key={course._id} to={`/course/${course._id}`} onClick={() => setShowingMyCourses(false)} style={{backgroundColor: "#028da8", backgroundImage: `linear-gradient(to right, rgba(2,141,168, 0.6), rgba(142,68,173, 0.9) ${percentage}%, transparent ${percentage}%), url(${course.image_url.replaceAll(" ", "%20")})`}} className="my_courses--courses--item">
                                                <div className="my_courses--courses--item--header">
                                                    <div className="my_courses--courses--item--header--name">
                                                        {course.name}
                                                    </div>
                                                    <div className="my_courses--courses--item--header--progress">
                                                        {percentage} %
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                }
                                <div className="my_courses--courses--add_more">
                                    You can find more courses in "Categories"
                                </div>
                            </div>
                        </div>
                    }
                </EzAnimate>
            </OutsideClick>
            <OutsideClick exceptions={["nav--hamburger"]} onOutsideClick={() => hamburgerOpen ? setHamburgerOpen(false) : null}>
                <EzAnimate
                    transitionName="animation--sidebar--mobile"
                >
                    {
                        hamburgerOpen &&
                            <div className="nav--mobile">
                                <NavLink onClick={() => setHamburgerOpen(false)} activeClassName="nav--mobile--item-selected" to="/dashboard" className="nav--mobile--item">
                                    <IonIcon className="nav--mobile--item--icon" icon="home-outline" />
                                    Dashboard
                                </NavLink>
                                <NavLink onClick={() => setHamburgerOpen(false)} activeClassName="nav--mobile--item-selected" to="/enrolls" className="nav--mobile--item">
                                    <IonIcon className="nav--mobile--item--icon" icon="bookmarks-outline" />
                                    My Enrolls
                                </NavLink>
                                <NavLink onClick={() => setHamburgerOpen(false)} activeClassName="nav--mobile--item-selected" to="/courses" className="nav--mobile--item">
                                    <IonIcon className="nav--mobile--item--icon" icon="apps-outline" />
                                    Categories
                                </NavLink>
                                <NavLink onClick={() => setHamburgerOpen(false)} activeClassName="nav--mobile--item-selected" to="/my-courses" className="nav--mobile--item">
                                    <IonIcon className="nav--mobile--item--icon" icon="school-outline" />
                                    Teach
                                </NavLink>
                                <NavLink onClick={() => setHamburgerOpen(false)} activeClassName="nav--mobile--item-selected" to="/support" className="nav--mobile--item">
                                    <IonIcon className="nav--mobile--item--icon" icon="help-outline" />
                                    Help
                                </NavLink>
                                <div className="flex--filler" />
                                {
                                    !props.isAuthenticated ?
                                        <React.Fragment>
                                            <NavLink onClick={() => setHamburgerOpen(false)} activeClassName="nav--mobile--item-selected" to="/signin" className="nav--mobile--item nav--mobile--item-top_border">
                                                Sign in
                                            </NavLink>
                                            <NavLink onClick={() => setHamburgerOpen(false)} activeClassName="nav--mobile--item-selected" to="/signup" className="nav--mobile--item">
                                                Sign up
                                            </NavLink>
                                        </React.Fragment>
                                    :
                                        <React.Fragment>
                                            <NavLink onClick={() => setHamburgerOpen(false)} activeClassName="nav--mobile--item-selected" to="/account?tab=account" className="nav--mobile--item nav--mobile--item-top_border">
                                                <IonIcon className="nav--mobile--item--icon" icon="person-outline" />
                                                Edit account
                                            </NavLink>
                                            <div onClick={() => { signOut(props.saveUserData); window.location.replace("/signin"); setHamburgerOpen(false); }} className="nav--mobile--item">
                                                <IonIcon className="nav--mobile--item--icon" icon="log-out-outline" />
                                                Sign out
                                            </div>
                                        </React.Fragment>
                                }
                            </div>
                    }
                </EzAnimate>
            </OutsideClick>
        </React.Fragment>
    )
}
