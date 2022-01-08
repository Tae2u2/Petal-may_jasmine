import { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Home = ({ userObj }) => {
  const [petal, setPetal] = useState("");
  const [petals, setPetals] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "petals"), {
        text: petal,
        createdAt: Date.now(),
        writerId: userObj.uid,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setPetal("");
  };

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

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setPetal(value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          value={petal}
          onChange={onChange}
          type="text"
          placeholder="Count your petals."
          maxLength={140}
        />
        <input type="submit" value="take Off" />
      </form>
      <div>
        {petals.map((petal) => (
          <div key={petal.id}>
            <h4>{petal.text}</h4>
          </div>
        ))}
      </div>
    </>
  );
};
export default Home;
