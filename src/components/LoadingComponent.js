import React from 'react';
import { Spinner } from 'reactstrap';

export const Loading = () => {
    return (
        <div className="col-12 d-flex justify-content-center" size="lg">
          <Spinner color="success" />
        </div>
    );
};
