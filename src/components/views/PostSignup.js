import React from 'react';

export const PostSignup = props => {
  return (
    <div className="container">
      <div className="row">
        <h3 className="col-12 text-center">{props.signup.successMess}</h3>
      </div>
      <div className="row">
          <button className="btn-success col-12">
            <a href="/"> <span className="fa fa-user fa-lg text-light" /></a>
          </button>
      </div>
    </div>
  );
};