import React, { useEffect, useState } from 'react';
import { withRouter} from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

export const WallUserStory = withRouter((props) =>{
    const [userId, setUserId] = useState(null);
    const [currentDisplayStory, setCurrentDisplayStory] = useState([]);
    const [indexDisplayStory, setIndexDisplayStory] = useState(0);
    const [indexTime, setIndexTime] = useState(0);
    const [timeImage, setTimeImage] = useState(0);
    useEffect(()=>{
        setUserId(JSON.parse(localStorage.getItem("id")))
        let getStories = !props.story ? null : props.story //get story props
        let noSeenFilter = !props.story.stories ? null : getStories.stories.noSeen //filter stories with noSeen
        let seenFilter = !props.story.stories ? null : getStories.stories.seen //filter stories seen
       
        let allStories = !noSeenFilter || !seenFilter ? null : noSeenFilter.concat(seenFilter) //filter props stories and joint it
        
        let id = props.match.params.user //url user id
        //get stories based on user params id
        let fixCurrentDisplayStories = !allStories ? null : allStories.filter(h => h[0].userData._id === id)[0]
        setCurrentDisplayStory(fixCurrentDisplayStories)

        //set time start story
        let getDuration = !fixCurrentDisplayStories ? null : fixCurrentDisplayStories[0].duration / 1000
        setIndexTime(getDuration)
    }, [props.story, props.match.params.user])
    
    const userStories = !currentDisplayStory ? null : currentDisplayStory.map( (w, index) => {
       
        let view = !currentDisplayStory[0] ? null : currentDisplayStory[indexDisplayStory].views.some( v => v === userId)

        let loadImage = (last, img) => {
            let gettime;
            window.clearTimeout(timeImage);
            setIndexTime(10)
            if(!view) props.storiesView(userId, img).then(resp => console.log(resp)).catch(e => console.log(e))
            
            if(last){
                setTimeImage(setTimeout(()=>{
                window.history.back()
                }, 10000))
            
            } else {
                setTimeImage(setTimeout(()=>{
                    gettime = currentDisplayStory[indexDisplayStory + 1].duration / 1000
                    setIndexTime(gettime)
                    setIndexDisplayStory(indexDisplayStory + 1)
                }, 10000))
            }
        }
        let videoEnd = (last, img) => {
            let gettime;
            window.clearTimeout(timeImage);
            if(!view) props.storiesView(userId, img).then(resp => console.log(resp)).catch(e => console.log(e))
            
            if(last){
                window.history.back()
            } else {
                gettime = currentDisplayStory[indexDisplayStory + 1].duration / 1000
                setIndexTime(gettime)
                setIndexDisplayStory(indexDisplayStory + 1)
            }
        }
        let forth = (last) => {
            let gettime;
            window.clearTimeout(timeImage);
            if(last){
                window.history.back()
            } else {
                gettime = currentDisplayStory[indexDisplayStory + 1].duration / 1000
                setIndexTime(gettime)
                setIndexDisplayStory(indexDisplayStory + 1)
            } 
        }
        let back = (first) => {
            let gettime;
            window.clearTimeout(timeImage);
            if(first){
                window.history.back()
            } else {
                gettime = currentDisplayStory[indexDisplayStory - 1].duration / 1000
                setIndexTime(gettime)
                setIndexDisplayStory(indexDisplayStory - 1)
            }
        }
        
         let ext = !currentDisplayStory[0] ? null : currentDisplayStory[indexDisplayStory].filename.split('.')
         let extItem = !ext ? null : ext[ext.length -1]
         if (indexDisplayStory === index) {
         return (
           <div className="modal-story" key={w._id}>
             <div className="stories-row" >
                     <div className="modal-story-image" >
                         <div className="set">
                         {
                                currentDisplayStory.map( (i, it) => {
                                    return(
                                        <React.Fragment key={it}>
                                            {
                                                it === index ?
                                                <div className='set-items'>
                                                    <div className='time-fill' style={{animationDuration: `${indexTime}s`}}></div>
                                                </div>
                                                :
                                                it > index ?
                                                <div className='set-items-noseen'>
                                                
                                                </div>
                                                :
                                                <div className='set-item'>
                                                
                                                </div>
                                            }
                                        </React.Fragment>
                                    )
                                })
                            }
                         </div>
                             {
                             extItem === "png" || extItem === "jpg" || extItem === "jpeg" || extItem === "gif" || extItem === "ico" ?

                             
                             <img className="responsive" src={baseUrl + currentDisplayStory[indexDisplayStory].filename} alt={currentDisplayStory[indexDisplayStory]._id} onLoad={()=> loadImage(indexDisplayStory === currentDisplayStory.length - 1, currentDisplayStory[indexDisplayStory]._id)} />
                             :
                             <video className="responsive" src={baseUrl + currentDisplayStory[indexDisplayStory].filename} alt={currentDisplayStory[indexDisplayStory]._id} autoPlay onEnded={()=> videoEnd(indexDisplayStory === currentDisplayStory.length - 1, currentDisplayStory[indexDisplayStory]._id)} />
                             }
                         <div className='arrow-cointainer-left' onClick={()=> back(indexDisplayStory === 0)}>
                             <div className="cursor arrow-story-cointainer-left">
                                 <span className="fa fas fa-angle-left left-arrow-story"></span>
                             </div>
                         </div>
                         <div className='arrow-cointainer-right' onClick={()=> forth(indexDisplayStory === currentDisplayStory.length - 1)}>
                             <div className="cursor arrow-story-cointainer-right">
                                 <span className="fas fa-angle-right right-arrow-story"></span>
                             </div>
                         </div>
                     </div>
             </div>
             </div>
         )
        } else {
            return <div></div>
        }
     })

    return (
        <div className="modal-story">
            {userStories}
        </div>
    )
})