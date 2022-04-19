import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../shared/baseUrl";

//CHECK JWTTOKEN
export const checkToken = () => (dispatch) => {
  dispatch(tokenLoading());
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + `users/checkJWTtoken`, {
    method: "GET",
    headers: {
      'Authorization': bearer
    },
  })
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      dispatch(loginError(response.statusText));
      dispatch(logoutUser());
      var error = new Error('Error ' + response.status + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
    error => {
      var errmess = new Error(error.message);
      throw errmess;
     })
  .then(response => response.json())
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
  const bearer = 'Bearer ' + localStorage.getItem('token');
  const id = JSON.parse(localStorage.getItem('id'))
  return fetch(baseUrl + `start/publications/${id}`, {
    method: "GET",
    headers: {
      'Authorization': bearer
    },
  })
    .then(response => {
      if (response.ok) {
        return response;

      }
      else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      })
    .then(response => response.json())
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
export const removePhotograph = (imgId) => dispatch => {
  dispatch(userLoading());
  const bearer = 'Bearer ' + localStorage.getItem('token');
  
  return fetch(baseUrl + `imagen/removeimage`, {
    method: "POST",
    body: JSON.stringify(imgId),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    }
  })
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      var error = new Error("Setting Error " + response.status + ": " + response.statusText);
      error.response = response;
      throw error;
    }
  }, error => {
    var errmess = new Error(error.message);
    throw errmess;
  }
  )
    .then(data => data.json())
    .then(json => {
      dispatch(receiveUser(json));
    })
    .catch(error => dispatch(receiveUserError(error)));
}

export const removeVideo = (imgId) => dispatch => {
  dispatch(userLoading());
  const bearer = 'Bearer ' + localStorage.getItem('token');
  
  return fetch(baseUrl + `imagen/removevideo`, {
    method: "POST",
    body: JSON.stringify(imgId),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    }
  })
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      var error = new Error("Setting Error " + response.status + ": " + response.statusText);
      error.response = response;
      throw error;
    }
  }, error => {
    var errmess = new Error(error.message);
    throw errmess;
  }
  )
    .then(data => data.json())
    .then(json => {
      dispatch(receiveUser(json));
    })
    .catch(error => dispatch(receiveUserError(error)));
}

//REGISTER POST DATA
export const signupUser = User => dispatch => {
  const newUser = {
    username: User.username,
    password: User.password,
    date: User.date,
    sex: User.sex,
    country: User.country
  };
 
  return fetch(baseUrl + "users/signup", {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "same-origin"
  })
    .then(
      response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then(response => response.json())
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

export const loginUser = creds => dispatch => {
  // We dispatch requestLogin to kickoff the call to the API
  dispatch(requestLogin(creds));

  return fetch(baseUrl + "users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(creds)
  })
    .then(
      response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      error => {
        throw error;
      }
    )
    .then(response => response.json())
    .then(response => {
      if (response.success) {
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
        if(!name && !lastname){
          return new Promise((resolve,reject) =>{
            resolve(true);
          });
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
export const inboxFetch = () => dispatch => {
  dispatch(inboxLoading());
  const QUERY = JSON.parse(localStorage.getItem('id'));
  const bearer = "Bearer " + localStorage.getItem("token");
  return fetch(baseUrl + `inbox-message/getch/${QUERY}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer

    }
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Setting Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    }, error => {
      var errmess = new Error(error.message);
      throw errmess;
    }
    )
    .then(response => response.json())
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

export const fetchUser = (id) => dispatch => {
  dispatch(userLoading());
  const bearer = "Bearer " + localStorage.getItem("token");
  return fetch(baseUrl + "users/get-home-user/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    }
  })
    .then(response => response.json())
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
export const fetchDataUser = (url) => dispatch => {
  dispatch(usersLoading());
  const bearer = "Bearer " + localStorage.getItem("token");
  return fetch(baseUrl + `users/profile/${url.host}/${url.user}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    }
  })
    .then(response => response.json())
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

export const settingsUser = (userID, Settings) => dispatch => {
  const settingsUser = {
    firstname: Settings.firstname,
    lastname: Settings.lastname,
    phrase: Settings.phrase,
    status: Settings.status
  };
 

  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + "users/settings/" + userID, {
    method: "PUT",
    body: JSON.stringify(settingsUser),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error(
          "Setting Error " + response.status + ": " + response.statusText
        );
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
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

export const imagenUser = (userID, image) => dispatch => {

  const bearer = "Bearer " + localStorage.getItem("token");
  return fetch(baseUrl + "imagen/profile-image-post/change/" + userID, {
    method: "POST",
    body: image,
    headers: {
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Image Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then(response => {
      console.log('response', response);
    })
    .catch(error => {
      console.log("SETTINGS ERROR");
    });
};

//IMAGEN WALL FETCH

export const imagenWall = (userID, image) => dispatch => {

  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + "imagen/imageswall/" + userID, {
    method: "POST",
    body: image,
    headers: {
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Image Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then(response => {
      console.log('response', response);
    })
    .catch(error => {
      console.log("SETTINGS ERROR");
    });
};

//STORIES
export const storiesCreator = (userID, image) => dispatch => {

  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + "imagen/story-post/" + userID, {
    method: "POST",
    body: image,
    headers: {
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Image Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then(response => {
      console.log('response', response);
    })
    .catch(error => {
      console.log("SETTINGS ERROR");
    });
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

export const storiesView = (userID, image) => dispatch => {

  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + `imagen/story-view/${userID}/${image}`, {
    method: "POST",
    headers: {
      'Authorization': bearer
    }
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Image Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then(response => {
      console.log('response', response);
    })
    .catch(error => {
      console.log("SETTINGS ERROR");
    });
};
//STORIES

//FETCH IMAGEN AND COMMENTS TO ImagenComponent
export const imagenFetch = (image) => dispatch => {
  dispatch(imagenLoading());
  const bearer = "Bearer " + localStorage.getItem("token");
  return fetch(baseUrl + `imagen/view/imagenwall/${image}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    }
})
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      var error = new Error("Image Error " + response.status + ": " + response.statusText);
      error.response = response;
      throw error;
    }
  },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      })
  .then(response => response.json())
  .then(img => {
      dispatch(imagenFetchComments(image, img));
    })
  .catch(error => {
      dispatch(imagenError(error))
    });
};
const imagenFetchComments = (image, imgObj) => dispatch => {
  const bearer = "Bearer " + localStorage.getItem("token");
  const DATA = {
    imagen: imgObj,
    comments: null
  }
  return fetch(baseUrl + `comments/get-comments-image/${image}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    }
  })
  .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error("Image Error " + response.status + ": " + response.statusText);
          error.response = response;
          throw error;
        }
      },
        error => {
          var errmess = new Error(error.message);
          throw errmess;
        }
      )
  .then(response => response.json())
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
export const fetchNotifications = (query) => (dispatch) => {
  dispatch(notifLoading());

  const bearer = 'Bearer ' + localStorage.getItem('token');
  const QUERY = query;
  return fetch(baseUrl + `notification/user-notifications/get/${QUERY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    }
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    })
    .then(response => response.json())
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

export const followFetch = (followingId, followerId) => dispatch => {

  const data = {
    followingId: followingId,
    message: "Friend Request"
  }
  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + `notification/following-user/send/${followerId}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Setting Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    }, error => {
      var errmess = new Error(error.message);
      throw errmess;
    }
    )
}

//FOLLOWER ACEPTAR/RECHAZAR SOLICITUD

export const friendRequestResponse = (dataNotification) => dispatch => {
  const data = {
    action: dataNotification.action,
    followingId: JSON.parse(localStorage.getItem("id")),
  }
  const bearer = "Bearer " + localStorage.getItem("token");

  return fetch(baseUrl + `notification/following-request/${dataNotification.followerId}/${dataNotification.notiId}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Setting Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    }, error => {
      var errmess = new Error(error.message);
      throw errmess;
    }
    )
}
//GET Users followers
export const fetchFollowers = () => (dispatch) => {
  dispatch(followersLoading());

  const bearer = 'Bearer ' + localStorage.getItem('token');
  const QUERY = JSON.parse(localStorage.getItem("id"));
  return fetch(baseUrl + `users/followers-notifications-return/${QUERY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    }
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    })
    .then(response => response.json())
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
export const fetchFollowing = () => (dispatch) => {
  dispatch(followingLoading());

  const bearer = 'Bearer ' + localStorage.getItem('token');
  const QUERY = JSON.parse(localStorage.getItem("id"));
  return fetch(baseUrl + `users/following/${QUERY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearer
    }
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    })
    .then(response => response.json())
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

export const commentsPost = dataComment => dispatch => {
  const newComment = {
    comment: dataComment.comment,
    author: dataComment.author,
    image: dataComment.image
  };
  const bearer = "Bearer " + localStorage.getItem("token");
  return fetch(baseUrl + 'comments/post-comment', {
    method: "POST",
    body: JSON.stringify(newComment),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
  .then(response => {
    if (response.ok) {
      return response;

    }
    else {
      var error = new Error('Error ' + response.status + ': ' + response.statusText);
      error.response = response;
      throw error;
    }
  },
    error => {
      var errmess = new Error(error.message);
      throw errmess;
    })
  .then(response => response.json())
  .catch(error => dispatch(startFailed(error.message)));
}

// LIKE POST
export const postImageLike = (imageid, usersData) => async (dispatch) => {
  var DATA = {
    id: await usersData.id,
    liked: await usersData.liked
  }
  const bearer = 'Bearer ' + localStorage.getItem('token');

  return fetch(baseUrl + 'likes/post-i-like-it/' + await imageid, {
    method: "POST",
    body: JSON.stringify(DATA),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        throw error;
      })
    .then(response => response.json())
    .then(like => { console.log('Favorite Added', like) }) //dispatch(addFavorites(favorites)); })
    .catch(error => console.log(error.message))//dispatch(favoritesFailed(error.message)));
}
export const postVideoLike = (videoid, usersData) => async (dispatch) => {
  var DATA = {
    id: await usersData.id,
    liked: await usersData.liked
  }
  const bearer = 'Bearer ' + localStorage.getItem('token');

  return fetch(baseUrl + 'likes/post-i-like-it-video/' + await videoid, {
    method: "POST",
    body: JSON.stringify(DATA),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        throw error;
      })
    .then(response => response.json())
    .then(like => { console.log('Favorite Added', like) }) //dispatch(addFavorites(favorites)); })
    .catch(error => console.log(error.message))//dispatch(favoritesFailed(error.message)));
}

export const fetchLikes = (userId, imgId) => (dispatch) => {
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + `likes/get-i-like-it/${userId}/${imgId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      })
    .then(response => response.json())
    .then(likes => dispatch(addlikes(likes)))
    .catch(error => dispatch(likesFailed(error.message)));
}
export const fetchVideoLikes = (userId, imgId) => (dispatch) => {
  const bearer = 'Bearer ' + localStorage.getItem('token');
  return fetch(baseUrl + `likes/get-i-like-it-video/${userId}/${imgId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      }
      else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      })
    .then(response => response.json())
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
