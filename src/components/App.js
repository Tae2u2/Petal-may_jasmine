import AppRouter from "components/Router";
import { authService } from "fbase";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import styles from "css/AuthStyle.module.css";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const refreshUser = () => {
    setUserObj({
      uid: authService.currentUser.uid,
      displayName: authService.currentUser.displayName,
    });
  };

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName === null) {
          updateProfile(user, {
            displayName: "jasmine",
          });
        }
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
          updateProfile: (args) => updateProfile(user, args),
        });
      } else {
        setUserObj(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <div className={styles.settingApp}>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          refreshUser={refreshUser}
          userObj={userObj}
        />
      ) : (
        "initializing..."
      )}
    </div>
  );
}

export default App;
