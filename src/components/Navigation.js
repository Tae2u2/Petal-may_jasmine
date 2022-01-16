import { Link } from "react-router-dom";
import style from "css/HomeStyle.module.css";

const Navigation = ({ userObj }) => {
  return (
    <nav className={style.homeNav}>
      <ul className={style.homeUl}>
        <li className={style.homeLi}>
          <Link to="/" className={style.homeLink}>
            <ion-icon name="flower-outline"></ion-icon>Home
          </Link>
        </li>
        <li className={style.homeLi}>
          <Link to="/profile" className={style.homeLink}>
            <ion-icon name="person-circle-outline"></ion-icon>
            {userObj.displayName}'s Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
