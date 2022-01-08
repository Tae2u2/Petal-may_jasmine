import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { authService } from "fbase";

const Auth = () => {
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
          console.log(`회원가입user : ${user}`);
        });
      } else {
        //로그인
        data = signInWithEmailAndPassword(authService, email, password).then(
          (userCredential) => {
            const user = userCredential.user;
            console.log(`로그인user : ${user}`);
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
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          onChange={onChange}
          value={email}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          onChange={onChange}
          value={password}
          placeholder="password"
          required
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
      <div>
        <button onClick={onSocialClick} name="google">
          Continue With Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue With Github
        </button>
      </div>
    </div>
  );
};

export default Auth;