import React from 'react';

var date = new Date().getFullYear();

function Footer(){
    return (
            <footer>
            <p>Copyright ⓒ {date}</p>
            </footer>
    );
};

export default Footer;