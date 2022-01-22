import { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Petals from "components/Petals";
import Factory from "components/Factory";
import style from "css/HomeStyle.module.css";

const Home = ({ userObj }) => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const querySnapshot = query(
      collection(dbService, "petals"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(querySnapshot, (snapshot) => {
      const petalArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPetals(petalArr);
    });
  }, []);

  return (
    <div className={style.homeDep}>
      <Factory userObj={userObj} />
      <div>
        {petals.map((petal) => (
          <Petals
            key={petal.id}
            petalObj={petal}
            userObj={userObj}
            isOwner={petal.writerId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
