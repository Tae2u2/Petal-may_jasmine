import {
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { authService } from "fbase";
import AuthForm from "components/AuthForm";
import styles from "css/AuthStyle.module.css";

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
  };
  return (
    <div className={styles.authDep}>
      <div className={styles.authBundle}>
        <AuthForm />
        <div>
          <button
            className={styles.authBtn}
            onClick={onSocialClick}
            name="google"
          >
            <span className={styles.icons}>
              <ion-icon
                name="logo-google"
                style={{ color: "#D84315" }}
              ></ion-icon>
            </span>
            With Google
          </button>
          <br />
          <button
            className={styles.authBtn}
            onClick={onSocialClick}
            name="github"
          >
            <span className={styles.icons}>
              <ion-icon name="logo-github"></ion-icon>
            </span>
            With Github
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
