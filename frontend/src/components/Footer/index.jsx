import React from 'react';
import style from './index.module.css'

function Footer() {
  return (
    <footer className="page-footer">
      <div className={style["footer-copyright"]}>
        <div className="container">
          © 2020 Elbrus bootcamp
      </div>
      </div>
    </footer>
  )
}

export default Footer;
