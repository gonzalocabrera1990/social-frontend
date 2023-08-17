import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../shared/baseUrl";
import { getHelper, postHelperBody, postHelperMedia, putHelperBody } from "./fetchsHelpers";

//CHECK JWTTOKEN
export const checkToken = () => (dispatch) => {
  dispatch(tokenLoading());
  // let tokenResponse = await getHelper('users/checkJWTtoken')
  getHelper('users/checkJWTtoken')
  .then(result => {
    dispatch(tokenCheck());
  })
  .catch(error => {
    dispatch(tokenCheck());
  })
}
export const tokenLoading = () => ({
  type: ActionTypes.TOKEN_LOADING
});
export const tokenCheck = () => ({
  type: ActionTypes.TOKEN_CHECK
});
export const userCheck = () => ({
  type: ActionTypes.USER_CHECK
});

//VIEW AFTER LOGIN
export const fetchStart = () => (dispatch) => {
  dispatch(startLoading());
  const id = JSON.parse(localStorage.getItem('id'))
  getHelper(`start/publications/${id}`)
    .then(start => dispatch(addStart(start)))
    .then(start => dispatch(inboxFetch()))
    .catch(error => dispatch(startFailed(error.message)));
}
export const startLoading = () => ({
  type: ActionTypes.START_LOADING
});

export const startFailed = (errmess) => ({
  type: ActionTypes.START_FAILED,
  payload: errmess
});

export const addStart = (start) => ({
  type: ActionTypes.START_ADD,
  payload: start
});
//DELETE IMAGE AND VIDEO WALL
export const removePhotograph = (imgId) => async dispatch => {
  dispatch(userLoading());
  postHelperBody( `imagen/removeimage`, imgId)
    .then(json => {
      dispatch(receiveUser(json));
    })
    .catch(error => dispatch(receiveUserError(error)));
}

export const removeVideo = (imgId) => async dispatch => {
  dispatch(userLoading());
  postHelperBody(`imagen/removevideo`, imgId)
    .then(json => {
      dispatch(receiveUser(json));
    })
    .catch(error => dispatch(receiveUserError(error)));
}

//REGISTER POST DATA
export const signupUser =  User => async dispatch => {
  const newUser = {
    username: User.username,
    password: User.password,
    date: User.date,
    sex: User.sex,
    country: User.country
  };
  postHelperBody("users/signup", newUser)
  // return fetch(baseUrl + "users/signup", {
  //   method: "POST",
  //   body: JSON.stringify(newUser),
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   credentials: "same-origin"
  // })
  //   .then(
  //     response => {
  //       if (response.ok) {
  //         return response;
  //       } else {
  //         var error = new Error(
  //           "Error " + response.status + ": " + response.statusText
  //         );
  //         error.response = response;
  //         throw error;
  //       }
  //     },
  //     error => {
  //       var errmess = new Error(error.message);
  //       throw errmess;
  //     }
  //   )
  //   .then(response => response.json())
    .then(response => {
      const Resp = response.status;
      dispatch(responseSignup(Resp));
    })
    .catch(error => {
      const Err = error.status;
      dispatch(errorSignup(Err));
    });
};
export const responseSignup = creds => {
  return {
    type: ActionTypes.SIGNUP_SUCCESS,
    payload: creds
  };
};
export const errorSignup = creds => {
  return {
    type: ActionTypes.SIGNUP_FAILURE,
    payload: creds
  };
};

export const requestLogin = creds => {
  return {
    type: ActionTypes.LOGIN_REQUEST,
    creds
  };
};
//se agrego userdata: response.user
export const receiveLogin = response => {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    token: response.token,
    userdata: response
  };
};

export const loginError = message => {
  return {
    type: ActionTypes.LOGIN_FAILURE,
    errMess: message
  };
};

export const loginUser = creds => async dispatch => {
  // We dispatch requestLogin to kickoff the call to the API
  dispatch(requestLogin(creds));
  postHelperBody("users/login", creds)
    .then(response => {
      if (response.success) {
        console.log('ccccccccc',response);
        // If login was successful, set the token in local storage
        localStorage.setItem("token", response.token);
        localStorage.setItem("creds", JSON.stringify({username: creds.username}));
        localStorage.setItem("id", JSON.stringify(response.userdata._id));
        
        let id = response.userdata.username;
        let name = response.userdata.firstname;
        let lastname = response.userdata.lastname;
       
        dispatch(receiveLogin(response));
        dispatch(fetchUser(id));
        dispatch(fetchNotifications(id));
        dispatch(fetchFollowers());
        dispatch(fetchFollowing());
        dispatch(fetchStart());
        console.log(!name && !lastname);
        console.log(name);
        console.log(lastname);
        if(!name && !lastname){
          return true
          // return new Promise((resolve,reject) =>{
          //   resolve(true);
          // });
        }        
      } else {
        var error = new Error("Error " + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch(error => dispatch(loginError(error.message)));
};

export const requestLogout = () => {
  return {
    type: ActionTypes.LOGOUT_REQUEST
  };
};

export const receiveLogout = () => {
  return {
    type: ActionTypes.LOGOUT_SUCCESS
  };
};
//INBOX
export const inboxFetch = () => async dispatch => {
  dispatch(inboxLoading());
  const QUERY = JSON.parse(localStorage.getItem('id'));
  getHelper(`inbox-message/getch/${QUERY}`)
  .then(inbox => {
    const message = inbox.some(i => i.talk.some(t => t.author !== QUERY && t.seen === false))
    dispatch(inboxAdd(inbox, message))})
  .catch(error => dispatch(inboxFailed(error.message)));
}
export const inboxLoading = () => ({
  type: ActionTypes.INBOX_LOADING
});

export const inboxFailed = (errmess) => ({
  type: ActionTypes.INBOX_FAILED,
  payload: errmess
});

export const inboxAdd = (inbox, read) => ({
  type: ActionTypes.INBOX_SUCCESS,
  payload: inbox,
  read
});

// Logs the user out
export const logoutUser = () => dispatch => {
  dispatch(requestLogout());
  localStorage.removeItem("token");
  localStorage.removeItem("creds");
  localStorage.removeItem("id");
  dispatch(receiveLogout());
};

export const fetchUser = (id) => async dispatch => {
  dispatch(userLoading());
  getHelper(`users/get-home-user/${id}`)
    .then(response => {
      localStorage.setItem("img", JSON.stringify(response.image.filename));
      dispatch(receiveUser(response));
    })
    .catch(error => dispatch(receiveUserError(error)));
};

export const userLoading = () => ({
  type: ActionTypes.USER_LOADING
});

export const receiveUser = response => {
  return {
    type: ActionTypes.USER_SUCCESS,
    user: response
  };
};
export const receiveUserError = error => {
  return {
    type: ActionTypes.USER_ERROR,
    errMess: error
  };
};

//FETCH USERS COMPONENT
export const fetchDataUser = (url) => async dispatch => {
  dispatch(usersLoading());
  getHelper(`users/profile/${url.host}/${url.user}`)
    .then(response => {
      dispatch(receiveUsers(response));
    })
    .catch(error => dispatch(receiveUsersError(error)));
};

export const usersLoading = () => ({
  type: ActionTypes.USERS_LOADING
});

export const receiveUsers = response => {
  return {
    type: ActionTypes.USERS_SUCCESS,
    user: response
  };
};
export const receiveUsersError = error => {
  return {
    type: ActionTypes.USERS_ERROR,
    errMess: error
  };
};

//Settings fetch

export const settingsUser = (userID, Settings) => async dispatch => {
  const settingsUser = {
    firstname: Settings.firstname,
    lastname: Settings.lastname,
    phrase: Settings.phrase,
    status: Settings.status
  };
  putHelperBody("users/settings/", settingsUser, userID)
    .then((response) => {
      const Resp = response.status;
      dispatch(responseSettings(Resp));
    })
    .catch(error => {
      const Err = error.status;
      dispatch(errorSettings(Err));
    });
};

export const responseSettings = creds => {
  return {
    type: ActionTypes.SETTINGS_SUCCESS,
    payload: creds
  };
};
export const errorSettings = creds => {
  return {
    type: ActionTypes.SETTINGS_FAILURE,
    payload: creds
  };
};

//IMAGEN FETCH

export const imagenUser = (userID, image) => async dispatch => {
  postHelperMedia(`imagen/profile-image-post/change/${userID}`, image)
    .then(() => {
      window.location.reload();
    })
    .catch(error => {
      console.log("ERROR");
    });
};

//IMAGEN WALL FETCH

export const imagenWall = (userID, image) => async dispatch => {
postHelperMedia(`imagen/imageswall/${userID}`, image)
.then(() => {
  window.location.reload();
})
.catch(error => {
  console.log("ERROR");
});
};

//STORIES
export const storiesCreator = (userID, image) => async dispatch => {
  try {
    let response = await postHelperMedia(`imagen/story-post/${userID}`, image)
    return response
  } catch (error) {
    console.log("SETTINGS ERROR", error);
  }
    // .then(response => {
    //   console.log('response', response);
    // })
    // .catch(error => {
    //   console.log("SETTINGS ERROR");
    // });
};
const measure = (timestamp) => {
  let inicio = new Date(timestamp).getTime();
  let now = Date.now();
  let res = now - inicio;
  const hours = (Math.floor((res)/1000))/3600;
  return hours;
}
export const storyFetcher = (followingList) => dispatch => {
  dispatch(storyLoading());
  let storageId = JSON.parse(localStorage.getItem('id'))
  let nss = followingList.filter(us=> us.id.stories.find(h => measure(h.timestamp) <= 24 && !h.views.some(v => v === storageId)))
  let ss = followingList.filter(us=> us.id.stories.every(h => measure(h.timestamp) <= 24 && h.views.includes(storageId)))
  
  let measureNoSeenStory = !nss ? null : nss.map(u=>u.id.stories.filter(s=>measure(s.timestamp) <= 24))
  let filterMeasureNoSeenStory = measureNoSeenStory.filter(n => n.length > 0)
  let measureSeenStory = !ss ? null : ss.map(u=>u.id.stories.filter(s=>measure(s.timestamp) <= 24))
  let filterMeasureSeenStory = measureSeenStory.filter(n => n.length > 0)

  const storyStore = {
    users: {
      noSeen: nss,
      seen: ss
    },
    stories: {
      noSeen: filterMeasureNoSeenStory,
      seen: filterMeasureSeenStory
    }
  }
  dispatch(receiveStory(storyStore));
};
export const storyLoading = () => ({
  type: ActionTypes.STORY_LOADING
});

export const receiveStory = response => {
  return {
    type: ActionTypes.STORY_SUCCESS,
    story: response
  };
};
export const receiveStoryError = error => {
  return {
    type: ActionTypes.STORY_FAILED,
    errMess: error
  };
};

export const storiesView = (userID, image) => async dispatch => {
  postHelperBody(`imagen/story-view/${userID}/${image}`)
    .then(response => {
      console.log('response', response);
    })
    .catch(error => {
      console.log("SETTINGS ERROR");
    });
};
//STORIES

//FETCH IMAGEN AND COMMENTS TO ImagenComponent
export const imagenFetch = (image) => async dispatch => {
  dispatch(imagenLoading());
  getHelper(`imagen/view/imagenwall/${image}`)
  .then(img => {
      dispatch(imagenFetchComments(image, img));
    })
  .catch(error => {
      dispatch(imagenError(error))
    });
};
const imagenFetchComments = (image, imgObj) => async dispatch => {
  const DATA = {
    imagen: imgObj,
    comments: null
  }
  getHelper(`comments/get-comments-image/${image}`)
  .then(comments => {
      DATA.comments = comments
    })
  .then(x => {
      dispatch(imagenSuccess(DATA))
    })
  .catch(error => {
      dispatch(imagenError(error))
    });
};
export const imagenLoading = () => {
  return {
    type: ActionTypes.IMAGEN_LOADING
  }
}

export const imagenSuccess = (users) => {
  return {
    type: ActionTypes.IMAGEN_SUCCESS,
    payload: users
  }
}

export const imagenError = (message) => {
  return {
    type: ActionTypes.IMAGEN_FAILED,
    payload: message
  }
}

//GET Users notifications
export const fetchNotifications = (query) =>async dispatch => {
  dispatch(notifLoading());
  const QUERY = query;
  getHelper(`notification/user-notifications/get/${QUERY}`)
    .then(response => {
      dispatch(nofifSuccess(response));
    })
    .catch(error => dispatch(notifError(error.message)))

}
export const notifLoading = () => {
  return {
    type: ActionTypes.NOTIFICATION_LOADING
  }
}

export const nofifSuccess = (users) => {
  return {
    type: ActionTypes.NOTIFICATION_SUCCESS,
    payload: users
  }
}

export const notifError = (message) => {
  return {
    type: ActionTypes.NOTIFICATION_ERROR,
    ERR: message
  }
}


//FOLLOWER

export const followFetch = (followingId, followerId, urlUsers) => async dispatch => {
  const data = {
    followingId: followingId,
    message: "Friend Request"
  }
  postHelperBody(`notification/following-user/send/${followerId}`, data)
  .then(list => {
    dispatch(fetchDataUser(urlUsers));
  })
}

//FOLLOWER ACEPTAR/RECHAZAR SOLICITUD

export const friendRequestResponse = (dataNotification) => async dispatch => {
  const data = {
    action: dataNotification.action,
    followingId: JSON.parse(localStorage.getItem("id")),
  }
  postHelperBody(`notification/following-request/${dataNotification.followerId}/${dataNotification.notiId}`, data).then(res => res)
}
//GET Users followers
export const fetchFollowers = () => async dispatch => {
  dispatch(followersLoading());
  const QUERY = JSON.parse(localStorage.getItem("id"));
  getHelper(`users/followers-notifications-return/${QUERY}`)
    .then(response => {
      dispatch(followersSuccess(response));
    })
    .catch(error => dispatch(followersError(error.message)))
}
export const followersLoading = () => {
  return {
    type: ActionTypes.FOLLOWERS_LOADING
  }
}

export const followersSuccess = (followers) => {
  return {
    type: ActionTypes.FOLLOWERS_SUCCESS,
    payload: followers
  }
}

export const followersError = (message) => {
  return {
    type: ActionTypes.FOLLOWERS_ERROR,
    ERR: message
  }
}

//GET Users followings
export const fetchFollowing = () => async dispatch => {
  dispatch(followingLoading());
  const QUERY = JSON.parse(localStorage.getItem("id"));
  getHelper(`users/following/${QUERY}`)
    .then(response => {
      dispatch(followingSuccess(response));
      return response.follow
    })
    .then(response => {
      dispatch(storyLoading());
      let storageId = JSON.parse(localStorage.getItem('id'))
      let nss = response.filter(us=> us.id.stories[0] && us.id.stories.find(h => measure(h.timestamp) <= 24 && !h.views.some(v => v === storageId)))
      let ss = response.filter(us=> us.id.stories[0] && us.id.stories.every(h => measure(h.timestamp) <= 24 && h.views.some(v => v === storageId)))
    
      let measureNoSeenStory = !nss ? null : nss.map(u=>u.id.stories.filter(s=>measure(s.timestamp) <= 24))
      let filterMeasureNoSeenStory = measureNoSeenStory.filter(n => n.length > 0)
      let measureSeenStory = !ss ? null : ss.map(u=>u.id.stories.filter(s=>measure(s.timestamp) <= 24))
      let filterMeasureSeenStory = measureSeenStory.filter(n => n.length > 0)
      const storyStore = {
        users: {
          noSeen: nss,
          seen: ss
        },
        stories: {
          noSeen: filterMeasureNoSeenStory,
          seen: filterMeasureSeenStory
        }
      }
      return storyStore
    })
    .then(list => {
      dispatch(receiveStory(list));
    })
    .catch(error => dispatch(followingError(error.message)))

}
export const followingLoading = () => {
  return {
    type: ActionTypes.FOLLOWING_LOADING
  }
}

export const followingSuccess = (following) => {
  return {
    type: ActionTypes.FOLLOWING_SUCCESS,
    payload: following
  }
}

export const followingError = (message) => {
  return {
    type: ActionTypes.FOLLOWING_ERROR,
    ERR: message
  }
}

//CHANGE THE NOTIFICATION STATUS OF REDUX STORE

export const readStatusHandle = () => {
  return {
    type: ActionTypes.NOTIFICATION_STATUS
  }
}
export const handleNotificationStatus = () => (dispatch) => {
  dispatch(readStatusHandle());
}


//COMMENTS POST

export const commentsPost = dataComment => async dispatch => {
  const newComment = {
    comment: dataComment.comment,
    author: dataComment.author,
    image: dataComment.image
  };
  try {
    let messege = await postHelperBody('comments/post-comment', newComment);
    return messege
  } catch (error) {
    dispatch(startFailed(error.message))
  }
  //postHelperBody('comments/post-comment', newComment)
  // .then(response => {
  //   console.log("333333333", response);
  //   return response
  // })
  // .catch(error => dispatch(startFailed(error.message)));
}

// LIKE POST
export const postImageLike = (imageid, usersData) => async (dispatch) => {
  var DATA = {
    id: await usersData.id,
    liked: await usersData.liked
  }
try {
  let response = await postHelperBody(`likes/post-i-like-it/${imageid}`, DATA)
  return response
} catch (error) {
  console.log(error.message)
}
  // postHelperBody(`likes/post-i-like-it/${imageid}`, DATA)
  // .then(like => { 
  //   return like
  // }) //dispatch(addFavorites(favorites)); })
  // .catch(error => console.log(error.message))//dispatch(favoritesFailed(error.message)));
}
export const postVideoLike = (videoid, usersData) => async (dispatch) => {
  var DATA = {
    id: await usersData.id,
    liked: await usersData.liked
  }
  try {
    let response = await postHelperBody(`likes/post-i-like-it-video/${videoid}`, DATA)
    return response
  } catch (error) {
    console.log(error.message)
  }
}

export const fetchLikes = (userId, imgId) => async dispatch => {
  getHelper(`likes/get-i-like-it/${userId}/${imgId}`)
    .then(likes => dispatch(addlikes(likes)))
    .catch(error => dispatch(likesFailed(error.message)));
}
export const fetchVideoLikes = (userId, imgId) => async dispatch => {
  getHelper(`likes/get-i-like-it-video/${userId}/${imgId}`)
    .then(likes => dispatch(addlikes(likes)))
    .catch(error => dispatch(likesFailed(error.message)));
}
export const likesLoading = () => ({
  type: ActionTypes.LIKES_LOADING
});

export const likesFailed = (errmess) => ({
  type: ActionTypes.LIKES_FAILED,
  payload: errmess
});

export const addlikes = (likes) => ({
  type: ActionTypes.LIKES_ADD,
  payload: likes
});