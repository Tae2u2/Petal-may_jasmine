import { dbService, storageService } from "fbase";
import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

const Petals = ({ petalObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [revisedPetal, setrevisedPetal] = useState(petalObj.text);

  const petalTextRef = doc(dbService, "petals", petalObj.id);
  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(petalTextRef);
      if (petalObj.attachmentUrl !== "") {
        await deleteObject(ref(storageService, petalObj.attachmentUrl));
      }
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setrevisedPetal(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(petalTextRef, {
      text: revisedPetal,
    });
    setEditing(false);
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input onChange={onChange} value={revisedPetal} required />
            <input type="submit" value="Update Petals" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{petalObj.text}</h4>
          {petalObj.attachmentUrl && (
            <img src={petalObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Petals;
