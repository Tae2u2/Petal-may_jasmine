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
    await signInWithPopup(authService, provider);
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
            <ion-icon
              name="logo-google"
              style={{ color: "#D84315" }}
            ></ion-icon>
            With Google
          </button>
          <button
            className={styles.authBtn}
            onClick={onSocialClick}
            name="github"
          >
            <ion-icon name="logo-github"></ion-icon>
            With Github
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
