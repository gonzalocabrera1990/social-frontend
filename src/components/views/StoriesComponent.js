import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../shared/baseUrl';

export const Stories = (props) => {
    const [userStory, setUserStory] = useState([]);
    
    useEffect(()=>{
        let nss = !props.story ? null : props.story
        setUserStory(nss)
    },[props.story])

    return (
        <div>
            <StoryMap userStory={userStory} />
        </div>
    )
}
export const StoryMap = (props) => {
    const titleRef = useRef();
    const scrollStories = (x,y) => titleRef.current.scrollBy(x,y);
    const NoSeen = !props.userStory.users ? null : props.userStory.users.noSeen.map(f => {
        return (
            <Link to={`/story/${f.id._id}/${f.id.stories[0]._id}`} key={f._id}>
                <div  className='stories-img no-seen'>
                    <img src={baseUrl + f.id.image.filename} alt="chatimgstatus" />
                </div>
            </Link>
        )
    })
    const Seen =  !props.userStory.users ? null : props.userStory.users.seen.map(f => {
        return (
            <Link to={`/story/${f.id._id}/${f.id.stories[0]._id}`} >
                <div key={f._id} className='stories-img'>
                    <img src={baseUrl + f.id.image.filename} alt="chatimgstatus" />
                </div>
            </Link>
        )
    })
    return (
        <div className='stories-frame' ref={titleRef}>
            {NoSeen}
            {Seen}
            <div className="cursor " onClick={() => scrollStories(-100, 0)}>
            <span className="fa fas fa-angle-left arrow-component-story arrow-component-story-left"></span>
            </div>
            <div className="cursor" onClick={() => scrollStories(100, 0)}>
            <span className="fas fa-angle-right arrow-component-story arrow-component-story-right"></span>
            </div>
        </div>
    )
}