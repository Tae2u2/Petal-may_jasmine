import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { getDocs, orderBy, where, query, collection } from "firebase/firestore";
import { updateProfile, signOut } from "firebase/auth";

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [myPetals, setMyPetals] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newDisplayName !== userObj.displayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    } else if (userObj.displayName === newDisplayName) {
      alert("기존 이름으로는 바꿀 수 없습니다");
    }
  };

  const onLogOutClick = () => {
    signOut(authService)
      .then(() => navigate("/", { replace: true }))
      .catch((error) => {
        alert("죄송합니다. 다시 시도해주세요!");
      });
  };

  const getMyPetals = async () => {
    const petalRef = collection(dbService, "petals");
    const q = query(
      petalRef,
      where("writerId", "==", `${userObj.uid}`),
      orderBy("createdAt", "desc")
    );
    const petals = await getDocs(q);
    let myArr = [];
    petals.forEach(
      (doc) =>
        (myArr[myArr.length] = {
          myText: doc.data().text,
          myUrl: doc.data().attachmentUrl,
        })
    );
    setMyPetals(myArr);
  };

  useEffect(() => {
    if (userObj.displayName == null) {
      updateProfile(authService.currentUser, {
        displayName: "jasmine",
      });
    }
    getMyPetals();
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newDisplayName}
          onChange={onChange}
          placeholder="Display Name"
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>signOut</button>
      <div>
        {myPetals.map((my, index) => (
          <div key={index}>
            <h4>{my.myText}</h4>
            {my.myUrl && (
              <div>
                <img src={my.myUrl} width="50px" height="50px" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Profile;
