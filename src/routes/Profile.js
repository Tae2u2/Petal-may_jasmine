import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService, storageService } from "fbase";
import { getDocs, orderBy, where, query, collection } from "firebase/firestore";
import { updateProfile, signOut } from "firebase/auth";

import style from "css/HomeStyle.module.css";

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
    <div className={style.homeDep}>
      <div className={style.editNameBox}>
        <h3>이름을 설정하고 변경하세요!</h3>
        <form className={style.together} onSubmit={onSubmit}>
          <input
            className={style.nameEdit}
            type="text"
            value={newDisplayName}
            onChange={onChange}
            placeholder="Display Name"
          />
          <input type="submit" className={style.clearBtn} value="이름바꾸기" />
        </form>
        <button
          onClick={onLogOutClick}
          style={{ marginTop: "15px", marginLeft: "50px", width: "400px" }}
          className={style.clearBtn}
        >
          로그아웃
        </button>
      </div>

      <div className={style.homeDep}>
        {myPetals.map((my, index) => (
          <div key={index} className={style.textBox}>
            <h4 style={{ marginBottom: "5px" }}>{userObj.displayName}</h4>
            <p className={style.contents}>{my.myText}</p>
            {my.myUrl && (
              <div className={style.together}>
                <img src={my.myUrl} width="250px" height="250px" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Profile;
