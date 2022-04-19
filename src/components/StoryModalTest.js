import React, { useEffect, useState, useLayoutEffect } from 'react';
import { withRouter} from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

function useWindowSize() {
    const [size, setSize] = useState([0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

export const StoryModal = withRouter((props) =>{
    const [userId, setUserId] = useState(null);
    const [allDisplayStory, setAllDisplayStory] = useState([]);
    const [currentDisplayStory, setCurrentDisplayStory] = useState([]);
    const [indexDisplayStory, setIndexDisplayStory] = useState('');
    const [width] = useWindowSize();
    const [nextIndex, setNextIndex] = useState(0);
    const [indexTime, setIndexTime] = useState(0);
    const [timeImage, setTimeImage] = useState(0);
   
    useEffect(()=>{
        setUserId(JSON.parse(localStorage.getItem("id")))
        let getStories = !props.story ? null : props.story //get story props
        let noSeenFilter = !props.story.stories ? null : getStories.stories.noSeen //filter stories with noSeen
        let seenFilter = !props.story.stories ? null : getStories.stories.seen //filter stories seen
     
        let allStories = !noSeenFilter || !seenFilter ? null : noSeenFilter.concat(seenFilter) //filter props stories and joint it
        setAllDisplayStory(allStories) //array of all stories

        let id = props.match.params.user //url user id
        //get stories based on user params id
        let fixCurrent = !allStories ? null : allStories.filter(h => h[0].userData._id === id)[0]
        setCurrentDisplayStory(fixCurrent)
        //get user index
        let currentIndex = !allStories ? null : allStories.findIndex(h => h[0].userData._id === id)
        setIndexDisplayStory(currentIndex)

        let getDuration = !fixCurrent ? null : fixCurrent[0].duration / 1000
        setIndexTime(getDuration)
    }, [props.story, props.match.params.user])
   
    const stylos = {
        storiesLeft:{
            itemuno: {
                a: {
                    transform: `translateX(${(width * 21)/100}px) scale(${0.4})`,
                    left: `-${(width * 2)/ 100}px`
                }
            },
            itemdos: {
                a:{
                transform: `translateX(${(width * 8)/100}px) scale(${0.4})`,
                left: `-${(width * 3)/ 100}px`
                },
                b:{
                    transform: `translateX(${(width * 9)/100}px) scale(${0.4})`,
                    left: `-${(width * 15)/ 100}px`
                }
            }
        },
        storiesRight: {
            itemmasuno: {
                a:{
                    transform: `translateX(${(width * 14)/100}px) scale(${0.4})`,
                    right: `${(width * 14)/ 100}px`
                },
                b:{
                    transform: `translateX(${(width * 10)/100}px) scale(${0.4})`,
                    right: `-${(width * 12)/ 100}px`
                }
            },
            itemmasdos: {
                a: {
                    transform: `translateX(${(width * 8)/100}px) scale(${0.4})`,
                    right: `-${(width * 6)/ 100}px`
                },
                b: {
                    transform: `translateX(${(width * 1)/100}px) scale(${0.4})`,
                    right: `-${(width * 20)/ 100}px`
                },
                c: {
                    transform: `translateX(${(width * 4)/50}px) scale(${0.4})`,
                    left: `${(width * 78)/ 100}px`
                }
            }
        }

    }
    const windowst = !allDisplayStory ? null : allDisplayStory.map( (w, index) => {
       
        let view = allDisplayStory[indexDisplayStory][nextIndex].views.some( v => v === userId)
        
        let loadImage = (last, index, img) => {
            let gettime;
            window.clearTimeout(timeImage)
            setIndexTime(10)
            if(!view) props.storiesView(userId, img).then(resp => console.log(resp)).catch(e => console.log(e))
            let changeUserIndex =  index === allDisplayStory.length - 1
            if(last && changeUserIndex){
                setTimeImage(setTimeout(()=>{
                    props.history.push("/start")
                }, 10000))
               
            } else if (last){ 
                setTimeImage(setTimeout(()=>{
                    gettime = allDisplayStory[indexDisplayStory + 1][0].duration / 1000
                    setNextIndex(0)
                    setIndexTime(gettime)
                    setIndexDisplayStory(indexDisplayStory + 1)
                }, 10000))
            } else {
                setTimeImage(setTimeout(()=>{
                    gettime = allDisplayStory[indexDisplayStory][nextIndex + 1].duration / 1000
                    setIndexTime(gettime)
                    setNextIndex(nextIndex + 1)
                }, 10000))
            }
        }
        let videoEnd = (last, index, img) => {
            let gettime;
            if(!view) props.storiesView(userId, img).then(resp => console.log(resp)).catch(e => console.log(e))
            let changeUserIndex =  index === allDisplayStory.length - 1
            
            if(last && changeUserIndex){
                props.history.push("/start")
            } else if(last){
                setNextIndex(0)
                gettime = allDisplayStory[indexDisplayStory + 1][0].duration / 1000
                setIndexTime(gettime)
                setIndexDisplayStory(indexDisplayStory + 1)
            } else {
                gettime = allDisplayStory[indexDisplayStory][nextIndex + 1].duration / 1000
                setIndexTime(gettime)
                setNextIndex(nextIndex + 1)
            }
        }
        let forth = (last, index) => {
            let gettime;
            window.clearTimeout(timeImage)
            let changeUserIndex =  index === allDisplayStory.length - 1
            if(last && changeUserIndex){
                props.history.push("/start")
            } else if (last){
                gettime = allDisplayStory[indexDisplayStory + 1][0].duration / 1000
                setNextIndex(0)
                setIndexTime(gettime)
                setIndexDisplayStory(indexDisplayStory + 1)
            } else {
                gettime = allDisplayStory[indexDisplayStory][nextIndex + 1].duration / 1000
                setIndexTime(gettime)
                setNextIndex(nextIndex + 1)
            }
        }
        let back = (first, index) => {
            let gettime;
            window.clearTimeout(timeImage)
            let changeUserIndex =  index === 0
            if(first && changeUserIndex){
                props.history.push("/start")
            } else if(first){
                gettime = allDisplayStory[indexDisplayStory - 1][0].duration / 1000
                setNextIndex(0)
                setIndexTime(gettime)
                setIndexDisplayStory(indexDisplayStory - 1)
            } else {
                gettime = allDisplayStory[indexDisplayStory][nextIndex - 1].duration / 1000
                setIndexTime(gettime)
                setNextIndex(nextIndex - 1)
            }
        }

        let ext = allDisplayStory[indexDisplayStory][nextIndex].filename.split('.')
        return (
                <div key={index} className="stories-row" >
                {
                    index === indexDisplayStory ?
                    <div className="modal-story-image" >
                        <div className='set'>
                            {
                                !w ? null : w.map( (i, it) => {
                                    return(
                                        <React.Fragment key={it}>
                                            {
                                                it === nextIndex ?
                                                <div className='set-items'>
                                                    <div className='time-fill' style={{animationDuration: `${indexTime}s`}}></div>
                                                </div>
                                                :
                                                it > nextIndex ?
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
                            ext[ext.length -1] === "png" || ext[ext.length -1] === "jpg" || ext[ext.length -1] === "jpeg" || ext[ext.length -1] === "gif" || ext[ext.length -1] === "ico" ?

                            <img className="responsive" src={baseUrl + w[nextIndex].filename} alt={w[nextIndex]._id} onLoad={()=> loadImage(nextIndex === w.length - 1, index, w[nextIndex]._id)} />
                            :
                            <video className="responsive" src={baseUrl + w[nextIndex].filename}
                            alt={w[nextIndex]._id} autoPlay 
                            onEnded={()=> videoEnd(nextIndex === w.length - 1, index, w[nextIndex]._id)} />
                            }
                        
                        <div className='arrow-cointainer-left' onClick={()=> back(nextIndex === 0, index)}>
                            <div className="cursor arrow-story-cointainer-left">
                                <span className="fa fas fa-angle-left left-arrow-story"></span>
                            </div>
                        </div>
                        <div className='arrow-cointainer-right' onClick={()=> forth(nextIndex === w.length - 1, index)}>
                            <div className="cursor arrow-story-cointainer-right">
                                <span className="fas fa-angle-right right-arrow-story"></span>
                            </div>
                        </div>
                    </div>
                :
                index === indexDisplayStory - 1 ?
                <div className="story-item item-prev-1 " 
                style={(width < 888 && width > 660 ? stylos.storiesLeft.itemdos.a : width <= 660 ? stylos.storiesLeft.itemdos.b : stylos.storiesLeft.itemuno.a)}
                >
                    <div className='stories-item-img'>
                        <img src={baseUrl + allDisplayStory[index][0].userData.image.filename} alt="chatimgstatus" />
                        <h3>{allDisplayStory[index][0].userData.firstname}</h3>
                        <h3>{allDisplayStory[index][0].userData.lastname}</h3>
                     </div>
                </div>
                :
                index === indexDisplayStory - 2 && index >= 0 ?
                <div className="story-item item-prev-2"
                style={(width < 1050 ? stylos.storiesLeft.itemdos.b : stylos.storiesLeft.itemdos.a)}>
                    <div className='stories-item-img'>
                        <img src={baseUrl + allDisplayStory[index][0].userData.image.filename} alt="chatimgstatus" />
                        <h3>{allDisplayStory[index][0].userData.firstname}</h3>
                        <h3>{allDisplayStory[index][0].userData.lastname}</h3>
                     </div>
                </div>
                :
                index === indexDisplayStory + 2 && index <= allDisplayStory.length -1 ?
                <div className="story-item item-next-2" 
                style={(width < 1050 ? stylos.storiesRight.itemmasdos.b :stylos.storiesRight.itemmasdos.a)}>
                    <div className='stories-item-img'>
                        <img src={baseUrl + allDisplayStory[index][0].userData.image.filename} alt="chatimgstatus" />
                        <h3>{allDisplayStory[index][0].userData.firstname}</h3>
                        <h3>{allDisplayStory[index][0].userData.lastname}</h3>
                     </div>
                </div>
                :
                index === indexDisplayStory + 1 && index <= allDisplayStory.length -1 ?
                <div className="story-item item-next-1"
                style={(width < 888 && width > 660 ? stylos.storiesRight.itemmasuno.b : width <= 660 ? stylos.storiesRight.itemmasdos.c : stylos.storiesRight.itemmasuno.a)}>
                    <div className='stories-item-img'>
                        <img src={baseUrl + allDisplayStory[index][0].userData.image.filename} alt="chatimgstatus" />
                        <h3>{allDisplayStory[index][0].userData.firstname}</h3>
                        <h3>{allDisplayStory[index][0].userData.lastname}</h3>
                     </div>
                </div>
                 : null
                }
            </div>
        )
    })

    return (
        <div className="modal-story">
            {windowst}
        </div>
    )
})