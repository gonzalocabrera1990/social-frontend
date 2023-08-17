import React, { Component } from 'react';
import io from 'socket.io-client';
import { baseUrl } from '../shared/baseUrl';
import { Poster } from './views/PosterComponent';
import { Home } from './views/HomeComponent';
import { Forms } from './views/RegisterForm';
import { PostSignup } from './views/PostSignup';
import { StartComponent } from './views/StartComponent';
import { MainUser } from './views/Users/MainUser';
import { UsersComponent } from './views/Users/Users';
import { Outline }  from './views/Users/OutlineUserComponent';
import { ImagenComponent } from './views/ImagenComponent';
import { RenderInbox } from './views/Inbox/Socketio';
import { Settings } from './views/SettingsComponent';
import { Header } from './HeaderComponent';
import { WallUserStory } from './StoryModal';
import { StoryModal } from './StoryModalTest';
import { RegisterFormHeader } from './RegisterFormNav';

import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  loginUser,
  logoutUser,
  fetchUser,
  signupUser,
  settingsUser,
  inboxFetch,
  imagenUser,
  imagenWall,
  storiesCreator,
  storiesView,
  storyFetcher,
  fetchNotifications,
  followFetch,
  friendRequestResponse,
  fetchFollowers,
  fetchFollowing,
  handleNotificationStatus,
  commentsPost,
  imagenFetch,
  postImageLike,
  postVideoLike,
  fetchLikes,
  fetchVideoLikes,
  fetchStart,
  fetchDataUser,
  removePhotograph,
  removeVideo,
  checkToken,
  userCheck,
  inboxAdd
} from "../redux/ActionCreators";

const socket = io(baseUrl);
const mapStateToProps = state => {
  return {
    auth: state.auth,
    user: state.user,
    users: state.users,
    signup: state.signup,
    start: state.start,
    inbox: state.inbox,
    settings: state.settings,
    notifications: state.notifications,
    followers: state.followers,
    following: state.following,
    imagen: state.imagen,
    likes: state.likes,
    story: state.story
  };
};

const mapDispatchToProps = dispatch => ({
  loginUser: creds => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  fetchUser: id => dispatch(fetchUser(id)),
  signupUser: User => dispatch(signupUser(User)),
  fetchStart: () => dispatch(fetchStart()),
  inboxFetch: () => dispatch(inboxFetch()),
  settingsUser: (userID, Settings) => dispatch(settingsUser(userID, Settings)),
  imagenUser: (userID, imagen) => dispatch(imagenUser(userID, imagen)),
  imagenWall: (userID, imagen) => dispatch(imagenWall(userID, imagen)),
  storiesCreator: (userID, imagen) => dispatch(storiesCreator(userID, imagen)),
  storiesView: (userID, imagen) => dispatch(storiesView(userID, imagen)),
  storyFetcher: (userID) => dispatch(storyFetcher(userID)),
  fetchNotifications: (query) => dispatch(fetchNotifications(query)),
  followFetch: (followingId, followerId, urlUsers) => dispatch(followFetch(followingId, followerId, urlUsers)),
  friendRequestResponse: (dataNotification) => dispatch(friendRequestResponse(dataNotification)),
  fetchFollowers: () => dispatch(fetchFollowers()),
  fetchFollowing: () => dispatch(fetchFollowing()),
  handleNotificationStatus: () => dispatch(handleNotificationStatus()),
  imagenFetch: num => dispatch(imagenFetch(num)),
  commentsPost: (comment) => dispatch(commentsPost(comment)),
  postImageLike: (imageid, usersData) => dispatch(postImageLike(imageid, usersData)),
  postVideoLike: (videoid, usersData) => dispatch(postVideoLike(videoid, usersData)),
  fetchLikes: (userId, imgId) => dispatch(fetchLikes(userId, imgId)),
  fetchVideoLikes: (userId, imgId) => dispatch(fetchVideoLikes(userId, imgId)),
  fetchDataUser: url => dispatch(fetchDataUser(url)),
  removePhotograph: img => dispatch(removePhotograph(img)),
  removeVideo: img => dispatch(removeVideo(img)),
  checkToken: () => dispatch(checkToken()),
  userCheck: () => dispatch(userCheck()),
  inboxAdd : (inbox, read) => dispatch(inboxAdd(inbox, read))
});

class Main extends Component {
  componentDidMount() {
    let pathname = window.location.pathname.split('/')
    if( pathname[1] === "start" ||
    pathname[1] === "inbox" ||
    pathname[1] === "userpage" ||
    pathname[1] === "settings" ||
    pathname[1] === "profiles" ||
    pathname[1] === "view" ||
    pathname[1] === "story" ||
    pathname[1] === "story-user-wall") this.props.checkToken();
     if (this.props.auth.isAuthenticated) {
      const id = this.props.auth.user.username;
      this.props.fetchUser(id);
    }
    if (this.props.auth.isAuthenticated) {
      const name = this.props.auth.user.username;
      this.props.fetchStart();
      this.props.fetchNotifications(name);
      this.props.fetchFollowers();
      this.props.fetchFollowing();
    }
    if (!this.props.auth.isAuthenticated) {
      this.props.userCheck();
    }
  }

  render() {
    const PosterScreen = () => {
      return this.props.auth.isLoading ||
      this.props.user.isLoading
      ? (
        <Poster />
      ) :
        null
    };
    const Headers = () => {
      return this.props.auth.isAuthenticated ? (
        <Header
          auth={this.props.auth}
          inbox={this.props.inbox}
          logoutUser={this.props.logoutUser}
          searchUsers={this.props.searchUsers}
          search={this.props.search}
          user={this.props.user}
          fetchDataUser={this.props.fetchDataUser}
          notifications={this.props.notifications}
          friendRequestResponse={this.props.friendRequestResponse}
          handleNotificationStatus={this.props.handleNotificationStatus}
          socketConection={socket}
          inboxFetch={this.props.inboxFetch}
          inboxAdd={this.props.inboxAdd}
        />

      ) :
        this.props.location.pathname === "/" ? null
          : <RegisterFormHeader />
    };

    const StartPage = () => {
      return this.props.auth.isAuthenticated ? (
        <StartComponent start={this.props.start}
          following={this.props.following}
          followers={this.props.followers}
          commentsPost={this.props.commentsPost}
          fetchStart={this.props.fetchStart}
          postImageLike={this.props.postImageLike}
          postVideoLike={this.props.postVideoLike}
          likes={this.props.likes}
          fetchLikes={this.props.fetchLikes}
          fetchVideoLikes={this.props.fetchVideoLikes}
          user={this.props.user}
          storyFetcher={this.props.storyFetcher}
          story={this.props.story.story}
          storiesView={this.props.storiesView}
        />
      ) : (
          <Redirect to="/" />
        );
    };

    const HomePage = () => {
      return this.props.auth.isAuthenticated ? (
        <Redirect to="/start" />
      ) : (
        <Home loginUser={this.props.loginUser} />
        );
    };
    const UserPages = () => {
      return this.props.auth.isAuthenticated ? (
        <MainUser
          imagenUser={this.props.imagenUser}
          imagenWall={this.props.imagenWall}
          storiesCreator={this.props.storiesCreator}
          user={this.props.user}
          auth={this.props.auth}
          commentsPost={this.props.commentsPost}
          fetchLikes={this.props.fetchLikes}
          fetchVideoLikes={this.props.fetchVideoLikes}
          likes={this.props.likes.likes}
          socketConection={socket}
          inboxFetch={this.props.inboxFetch}
          removePhotograph={this.props.removePhotograph}
          removeVideo={this.props.removeVideo}
        />
      ) : (
          <Redirect to="/" />
        );
    };

    const UserForms = () => {
      return !this.props.auth.isAuthenticated ? (
        <Forms signupUser={this.props.signupUser} />
      ) : (
          <Redirect to="/" />
        );
    };

    const SettingComponent = () => {
      return this.props.auth.isAuthenticated ? (
        <Settings
          settingsUser={this.props.settingsUser}
          user={this.props.user}
          auth={this.props.auth}
        />
      ) : (
          <Redirect to="/" />
        );
    };

    const PrivateInbox = () => {
      return this.props.auth.isAuthenticated ? (
        <RenderInbox
          followers={this.props.followers}
          inbox={this.props.inbox}
          socketConection={socket}
          inboxFetch={this.props.inboxFetch}
        />

      ) : (
          <Redirect to='/' />
        )
    }

    const OutlineRoute = () => {
      return !this.props.auth.isAuthenticated ? (
        <Outline />
      ) : (
          <Redirect to='/start' />
        )
    }
    const ImagenOne = () => {
      return this.props.auth.isAuthenticated ? (
        <ImagenComponent 
        imagenFetch={this.props.imagenFetch}
        commentsPost={this.props.commentsPost}
        postImageLike={this.props.postImageLike}
        postVideoLike={this.props.postVideoLike}
        imagen={this.props.imagen}
        user={this.props.user}
        removePhotograph={this.props.removePhotograph}
        removeVideo={this.props.removeVideo}
        />
      ) : (
          <Redirect to='/' />
        )
    }
    const Story = () => {
      return this.props.auth.isAuthenticated ? (
        <StoryModal
        story={this.props.story.story}
        storiesView={this.props.storiesView}
        />
      ) : (
          <Redirect to='/' />
        )
    }
    const UserWallStory = () => {
      return this.props.auth.isAuthenticated ? (
        <WallUserStory
        story={this.props.story.story}
        storiesView={this.props.storiesView}
        />
      ) : (
          <Redirect to='/' />
        )
    }

    return (
      <div>
        <Headers />
        <PosterScreen/> 
        <div>
          <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signup" component={UserForms} />
          <Route
              exact
              path="/users/post"
              component={() => <PostSignup signup={this.props.signup} />}
            />
            <Route exact path="/start" component={StartPage} />
            <Route exact path="/userpage" component={UserPages} />
            <Route exact path="/settings" component={SettingComponent} />
            <Route exact path="/inbox" component={PrivateInbox} />
            <Route exact path="/:idUsuario" component={OutlineRoute} />
            <Route exact path="/view/imagenwall/:idimg" component={ImagenOne} />
            <Route exact path="/story/:user/:storyid" component={Story} />
            <Route exact path="/story-user-wall/:user" component={UserWallStory} />
            <Route exact path="/profiles/:idhost/:idusers/" render={(props) =>
            this.props.auth.isAuthenticated ? (
              <UsersComponent {...props} auth={this.props.auth} followFetch={this.props.followFetch}
                user={this.props.user} followers={this.props.followers}
                fetchDataUser={this.props.fetchDataUser} users={this.props.users}
                commentsPost={this.props.commentsPost} postImageLike={this.props.postImageLike}
                postVideoLike={this.props.postVideoLike} fetchLikes={this.props.fetchLikes}
                fetchVideoLikes={this.props.fetchVideoLikes} likes={this.props.likes.likes}
                socketConection={socket} inboxFetch={this.props.inboxFetch}/>)
                : (
                  <Redirect to='/' />
                )
                } />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Main)
);