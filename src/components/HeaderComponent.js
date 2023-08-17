import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  Collapse,
  NavItem,
  Form, FormGroup, Input, UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarToggler
} from 'reactstrap';
import { SearchRender } from './SearchWindow';
import { Notifications } from './NotificationsWindow'
import { baseUrl } from '../shared/baseUrl';
import { getHelper, postHelperBody } from '../redux/fetchsHelpers';
import Brand from '../shared/assets/images/b.png';


export const Header = (props) => {
  const [styled, setStyled] = useState("none"); 
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false); 
  const [noti, setNoti] = useState('');
  const [readTrue, setReadTrue] = useState(false); 
  const [results, setResults] = useState([]); 
  const [isNavOpen, setIsNavOpen] = useState(false); 
  const [viewMessage, setViewMessage] = useState(''); 

  useEffect(()=>{
    const test = () => {
      const testing = props.notifications.results;
      let f = 0;
      for (let i = 0; i < testing.length; i++) {
        if (testing[i].readstatus === false) {
          f++
        }
      }
      if (f >= 1) {
        setNoti(false)
      } else {
        setNoti(true)
      }
    }
    test();
    setViewMessage(props.inbox.read)
  }, [props.inbox.read, props.notifications])
  useEffect(()=>{
    const name = !props.user.user ? null : props.user.user.username
    const id = JSON.parse(localStorage.getItem('id'))
    props.socketConection.on("chatNotification", data => {
      setViewMessage(true)
    })
    if (name && id) props.socketConection.emit("username",{id, name})
  }, [props.socketConection, props.user.user])

  useEffect(()=>{
   let pathname = window.location.pathname
   if(pathname === "/inbox") setViewMessage(false)
}, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    props.logoutUser();
  }
  const toggleNav = () => {
      setIsNavOpen(!isNavOpen)
  }

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    setSearch(value)
  }
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchLoading(true)
    // const bearer = 'Bearer ' + localStorage.getItem('token');
    // var config = {
    //   headers: { 'Authorization': bearer }
    // };
    
    // fetch(baseUrl + `search/search?q=${QUERY}`, config)
    // .then(data => data.json())
    const QUERY = search;
    getHelper(`search/search?q=${QUERY}`)
    .then(json => {
      setSearchLoading(false)
      return search === "" ? (
        setResults([])
        ) : (
          setResults(json)
        )
    })
    .catch(err => {
      console.log(err)
    })
  }

  const handleStyle = (e) => {
    e.preventDefault();
      setStyled(styled === "none" ? "" : "none")
    if (readTrue === false) {
      // const bearer = 'Bearer ' + localStorage.getItem('token');
      // var config = {
      //   method: "POST",
      //   headers: { 'Authorization': bearer }
      // };
      //      fetch(baseUrl + `notification/all/readtrue/${QUERY}`, config)

      const QUERY = JSON.parse(localStorage.getItem('id'))
      postHelperBody(`notification/all/readtrue/${QUERY}`,{})
        .then(json => {
          setReadTrue(true)
          props.handleNotificationStatus();
        })
  }
}
    let messageAlert = viewMessage
    return (
      <React.Fragment>
        <Navbar className="container-fluid main-nav navbar-dark" expand="md">
          <div className="container">
            <NavbarToggler onClick={toggleNav} />
            <NavbarBrand className="brand-image" href="/">
              <img
                src={Brand}
                alt="Red Social"
                className="imagen-navbar-profile"
                height="30" width="41"
              />
            </NavbarBrand>
            <Collapse isOpen={isNavOpen} navbar  >
              <div className="segundoItemUno">
                <Form>
                  <FormGroup className="text-white search">
                    <Input name="search" id="search" className="btn bg-success input search" placeholder="Search"
                      onKeyUp={(e) => handleSearch(e)} onChange={handleChange} value={search} />
                    <SearchRender className="" search={results} searchLoading={searchLoading}
                    fetchDataUser={props.fetchDataUser}  user={props.user}/>
                  </FormGroup>
                </Form>
              </div>
              <Nav navbar >
                <div className="itemGrupoDos ">
                  <NavLink className="nav-link" to="/userpage">
                    { !props.user.user ?
                    <img src={baseUrl + "images/perfildefault.png"}
                    alt="userimg" className="imagen-navbar-profile" />
                    :
                    <img src={baseUrl + props.user.user.image.filename}
                    alt="userimg" className="imagen-navbar-profile" />
                    }
                  </NavLink>
                </div>
                <div className="itemGrupoDos">
                  <NavItem>
                    <NavLink className="nav-link" to="/home">
                      <span className="fa fa-home fa-md" />
                    </NavLink>
                  </NavItem>
                </div>
                <div className="itemGrupoDos">
                  <NavItem>
                    <NavLink className="nav-link" to="/settings">
                      <span className="fa fa-cog fa-md" />
                    </NavLink>
                  </NavItem>
                </div>
                <div className="itemGrupoDos">
                  <NavItem >
                  {messageAlert ?
                      (<div>
                        <NavLink className="nav-link" to="/inbox">
                          <span className="fa fa-envelope fa-md" style={{ color: '#ceac10' }}/>
                        </NavLink>
                      </div>)
                  :
                    (
                    <div>
                      <NavLink className="nav-link" to="/inbox">
                        <span className="fa fa-envelope fa-md" />
                      </NavLink>
                    </div>)
                    }
                    
                </NavItem>
                </div>
                <div className="itemGrupoDos">
                  <NavItem>
                    {noti === false ?
                      (<div>
                        <NavbarBrand className="nav-link" onClick={handleStyle}>
                          <span className="fa fa-bell fa-md" style={{ color: '#ceac10' }} />
                        </NavbarBrand>
                        <div>
                          <div className="row mt-4 notification" style={{ display: styled }}  >
                            <div className="col-12" >
                              <Notifications notifications={props.notifications} className="col-12"
                                friendRequestResponse={props.friendRequestResponse} />
                            </div>
                          </div>
                        </div>
                      </div>) :
                      (<div>
                        <NavbarBrand className="nav-link" onClick={handleStyle}>
                          <span className="fa fa-bell fa-md" />
                        </NavbarBrand>
                        <div style={{ display: styled }}  >
                        <div className="pik pick-notification"></div>
                          <div className="row mt-4 notification"  >
                            <div className="col-12" >                             
                              <Notifications notifications={props.notifications} className="col-12"
                                friendRequestResponse={props.friendRequestResponse} />
                            </div>
                            </div>
                        </div>
                      </div>
                      )}
                  </NavItem>

                </div>

                <div className="itemGrupoDos">
                  
                    {
                      !props.auth.isAuthenticated ? null : (
                        <UncontrolledDropdown nav inNavbar>
                          <DropdownToggle nav >
                            <span className="fas fa-align-justify fa-md" />
                          </DropdownToggle>
                          <DropdownMenu right className="dropmenu position-absolute" >
                            <DropdownItem onClick={handleLogout}>
                              Logout
                                </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      )
                    }
                </div>

              </Nav>
            </Collapse>
          </div>
        </Navbar>
      </React.Fragment >
    );
}
