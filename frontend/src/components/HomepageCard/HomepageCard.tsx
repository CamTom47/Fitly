import React from 'react';
import './HomepageCard.css';
import { Link } from 'react-router-dom';

interface HomepageCardProps {
  text: string;
  link: string;
}
const HomepageCard = ({ text, link }: HomepageCardProps): React.JSX.Element => {
  return (
    <div id="HomepageCardContainer">
      <Link className='testlink' to={link}>
        <p className='HomepageCardText'>{text}</p>
      </Link>
    </div>
  );
};

export default HomepageCard;
