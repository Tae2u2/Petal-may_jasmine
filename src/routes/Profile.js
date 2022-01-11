import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { getDocs, orderBy, where, query, collection } from "firebase/firestore";

const Profile = ({ userObj }) => {
  const navigate = useNavigate();
  const [myPetals, setMyPetals] = useState([]);

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyPetals = async () => {
    const petalRef = collection(dbService, "petals");
    const q = query(
      petalRef,
      where("writerId", "==", `${userObj.uid}`),
      orderBy("createdAt", "asc")
    );
    const petals = await getDocs(q);
    const myArr = [];
    petals.forEach((doc) => {
      myArr[myArr.length] = doc.data().text;
    });
    setMyPetals(myArr);
  };

  useEffect(() => {
    getMyPetals();
  }, []);

  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>
      <div>
        <h4>
          {myPetals.map((my) => (
            <li key={my.index}>{my}</li>
          ))}
        </h4>
      </div>
    </div>
  );
};
export default Profile;
