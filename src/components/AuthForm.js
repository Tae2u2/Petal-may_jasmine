import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "fbase";
import styles from "css/AuthStyle.module.css";
import jasminelogo from "images/jasmineBtn.png";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        //회원가입
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        ).then((userCredential) => {
          const user = userCredential.user;
        });
      } else {
        //로그인
        data = signInWithEmailAndPassword(authService, email, password).then(
          (userCredential) => {
            const user = userCredential.user;
          }
        );
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(`${errorCode} ::: ${errorMessage}`);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <div className={styles.authFormDep}>
      <img className={styles.jasmineLogo} src={jasminelogo} alt="logo" />
      <span className={styles.authToggle} onClick={toggleAccount}>
        I want {newAccount ? "Sign In" : "Create Account"}
      </span>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          className={styles.authInput}
          onChange={onChange}
          value={email}
          placeholder="Email"
          required
        />
        <br />
        <input
          name="password"
          type="password"
          className={styles.authInput}
          onChange={onChange}
          value={password}
          placeholder="password"
          required
        />
        <br />
        <input
          className={styles.authBtn}
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
        />
        {error}
      </form>
    </div>
  );
};

export default AuthForm;
