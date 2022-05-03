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
      if (newAccount) {
        //회원가입
        await createUserWithEmailAndPassword(authService, email, password);
      } else {
        //로그인
        signInWithEmailAndPassword(authService, email, password);
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
        {newAccount ? "이미 회원이신가요?" : "계정을 만들고 싶습니다."}
      </span>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          className={styles.authInput}
          onChange={onChange}
          value={email}
          placeholder="이메일"
          required
        />
        <br />
        <input
          name="password"
          type="password"
          className={styles.authInput}
          onChange={onChange}
          value={password}
          placeholder="비밀번호"
          required
        />
        <br />
        <input
          className={styles.authBtn}
          type="submit"
          value={newAccount ? "계정생성" : "로그인"}
        />
        {error}
      </form>
    </div>
  );
};

export default AuthForm;
