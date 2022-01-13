import AppRouter from "components/Router";
import { authService } from "fbase";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [newName, setNewName] = useState("");

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
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <div>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          refreshUser={refreshUser}
          userObj={userObj}
        />
      ) : (
        "initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} petal-may-jasmine</footer>
    </div>
  );
}

export default App;
