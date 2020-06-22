import React from 'react';
import style from './index.module.css';

function Rating({ rating }) {
  return (<>
    <div className={style.color}>
      <div><i className="material-icons">{rating > 0.5 ? 'star' : rating > 0.25 ? 'star_half' : 'star_border'}</i></div>
      <div><i className="material-icons">{rating > 1.5 ? 'star' : rating > 1.25 ? 'star_half' : 'star_border'}</i></div>
      <div><i className="material-icons">{rating > 2.5 ? 'star' : rating > 2.25 ? 'star_half' : 'star_border'}</i></div>
      <div><i className="material-icons">{rating > 3.5 ? 'star' : rating > 3.25 ? 'star_half' : 'star_border'}</i></div>
      <div><i className="material-icons">{rating > 4.5 ? 'star' : rating > 4.25 ? 'star_half' : 'star_border'}</i></div>
    </div>
  </>
  )
}

export default Rating;
