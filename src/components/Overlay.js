import React from 'react';

const Overlay = ({ message }) => (
    <div className="overlay">
        <div
            role="document"
            tabIndex="-1"
            className="overlayMessage">
            <h4 id="modal-label">{message}</h4>
        </div>
        
    </div>
);


export { Overlay };


