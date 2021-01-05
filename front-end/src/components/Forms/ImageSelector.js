import React, { useState } from 'react';
import axios from 'axios';
import EzAnimate from '../Animations/EzAnimate';
import { Button } from './Button';
import { Switch } from './Switch';
import { IonIcon } from '../IonIcons/IonIcon';

export const ImageSelector = props => {

    const [imageUrl, setImageUrl] = useState(null);
    const [activeTab, setActiveTab] = useState("upload");
    const [dragOver, setDragOver] = useState(false);

    const onFileSelect = async file => {
        const formData = new FormData();
        formData.append("image", file);

        if (!["image/gif", "image/jpeg", "image/png"].includes(file.type)) {
            props.showNotification({
                type: "toast",
                contentType: "error",
                text: "File type not allowed",
                time: 3
            });
            return;
        }
        
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };

        try {
            let res = await axios.post(`http://localhost:4000/api/upload/image`, formData, config);
            setImageUrl(res.data.url);
            props.setUser({...props.user, uploads: [...props.user.uploads, res.data.upload]})
        } 
        catch (err) {
            console.error("An error occured while trying to upload the image");
            console.log(err);
            props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to upload the image",
                time: 3
            });
            setImageUrl(null);
        }
    };

    const onAnimationEnd = () => {
        if (!props.showing && imageUrl) {
            setImageUrl(null);
        }
    };

    const onDrop = e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (["image/gif", "image/jpeg", "image/png"].includes(file.type)) {
            onFileSelect(file);
        }
        else {
            props.showNotification({
                type: "toast",
                contentType: "error",
                text: "File type not allowed",
                time: 3
            });
        }
        setDragOver(false);
    };

    const onDragOver = e => {
        e.preventDefault();
        if (!dragOver) {
            setDragOver(true);
        }
    };
    
    const onDragEnter = e => {
        e.preventDefault();
        setDragOver(true);
    };
    
    const onDragLeave = e => {
        e.preventDefault();
        setDragOver(false);
    };

    return (
        <EzAnimate onAnimationEnd={() => onAnimationEnd()} transitionName="animation--fadeInOut">
            {
                props.showing &&
                    <div className="image_selector--animation_container">
                        <div onClick={() => { props.onClose(); setImageUrl(null); }} className="image_selector--background">
                            <div onClick={e => { e.stopPropagation(); }} className="image_selector">
                                {
                                    activeTab === "upload" &&
                                        <div style={{backgroundImage: `url(${imageUrl ? imageUrl.replaceAll(" ", "%20") : null}), linear-gradient(to right, #f4f4f4, #f4f4f4)`, content: imageUrl, display: imageUrl ? "block" : null}} className="image_selector--image" />
                                }
                                <div className="image_selector--header">
                                    <Switch className="image_selector--header--switch" options={[{text: "Upload", icon: "cloud-upload-outline", key: "upload"}, {text: "My uploads", icon: "images-outline", key: "libary"}]} onSelect={option => { setImageUrl(null); setActiveTab(option); }} />
                                    <div className="flex--filler image_selector--header--filler" />
                                    <div className="image_selector--header--title">
                                        {activeTab === "upload" ? "Upload image from your computer" : "Select your image"}
                                    </div>
                                    <Button onClick={() => { props.onClose(); setImageUrl(null); }} className="image_selector--header--close" disableDefaultStyle={true} hintText="Close">
                                        <IonIcon className="image_selector--header--close--icon" name="close-outline" />
                                    </Button>
                                </div>
                                <div    
                                    onDragOver={activeTab === "upload" ? onDragOver : null}
                                    onDragEnter={activeTab === "upload" ? onDragEnter : null}
                                    onDragLeave={activeTab === "upload" ? onDragLeave : null}
                                    onDrop={activeTab === "upload" ? onDrop : null} 
                                    className={`${activeTab === "libary" ? "image_selector--container-grid" : `image_selector--container ${dragOver ? "image_selector--container-dragOver" : ""}`}`}
                                >
                                    {
                                        activeTab === "upload" ? 
                                            <React.Fragment>
                                                <input
                                                    onDragOver={e => { e.preventDefault(); }}
                                                    onDragEnter={e => { e.preventDefault(); }}
                                                    onDragLeave={e => { e.preventDefault(); }}
                                                    onChange={e => { onFileSelect(Array.from(e.target.files)[0]); }} type="file" id="image-input" accept=".jpg, .png, .webp, .gif, .jpeg, .ico" className="image_selector--container--input" />
                                                <label 
                                                    onDragOver={e => { e.preventDefault(); e.preventDefault();}}
                                                    onDragEnter={e => { e.preventDefault(); }}
                                                    onDragLeave={e => { e.preventDefault(); }}
                                                    htmlFor="image-input" className="image_selector--container--label">
                                                    {
                                                        !dragOver ?
                                                            <React.Fragment><IonIcon className="image_selector--container--label--icon" name="image-outline" /> Select Image</React.Fragment>
                                                            :
                                                            <React.Fragment><IonIcon className="image_selector--container--label--icon" name="image-outline" /> Drop here</React.Fragment>
                                                    }
                                                </label>
                                            </React.Fragment>
                                        :
                                            <React.Fragment>
                                                {
                                                    props.user.uploads.map(upload => 
                                                        <img alt="" key={upload.file_name} className={`image_selector--container--upload ${`http://localhost:4000/api/upload/image/${upload.file_name}` === imageUrl ? "image_selector--container--upload-selected" : ""}`} onClick={() => { setImageUrl(`http://localhost:4000/api/upload/image/${upload.file_name}`); }} src={`http://localhost:4000/api/upload/image/${upload.file_name}`} />                                                        
                                                    )
                                                }
                                                <div style={{width: "100%", height: "1rem"}}></div>
                                            </React.Fragment>
                                    }
                                    <Button disabled={imageUrl === null} hintPosition="left" onClick={() => { props.onSelect(imageUrl); setImageUrl(null); }} disableDefaultStyle={true} hintText="Select image" className="image_selector--select" wrapperClassName="image_selector--select--position">
                                        <IonIcon className="image_selector--header--select--icon" name="checkmark-outline" />
                                    </Button>
                                    {   activeTab === "upload" &&
                                        <Button disabled={imageUrl === null} hintPosition="right" onClick={() => { setImageUrl(null); }} disableDefaultStyle={true} hintText="Clear selection" className="image_selector--clear" wrapperClassName="image_selector--clear--position">
                                            <IonIcon className="image_selector--header--select--icon" name="arrow-undo-outline" />
                                        </Button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </EzAnimate>
    )
}
