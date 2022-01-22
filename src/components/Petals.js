import { dbService, storageService } from "fbase";
import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import style from "css/HomeStyle.module.css";

const Petals = ({ petalObj, isOwner, userObj }) => {
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

  const ownBtnHandle = (event) => {};

  const toggleEditing = () => setEditing((prev) => !prev);
  return (
    <div className={style.textBox} style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ marginBottom: "5px" }}>{userObj.displayName}</h4>
        <span
          style={{ cursor: "pointer", transform: "translateY(-6px)" }}
          onClick={ownBtnHandle}
        >
          <ion-icon name="flower-outline"></ion-icon>
        </span>
      </div>
      {editing ? (
        <div className={style.contentsBox}>
          <form onSubmit={onSubmit}>
            <input
              className={style.homeInput}
              style={{ width: "38px" }}
              onChange={onChange}
              value={revisedPetal}
              required
            />
            <input className={style.editBtn} type="submit" value="수정" />
          </form>
          <button className={style.cancelBtn} onClick={toggleEditing}>
            취소
          </button>
        </div>
      ) : (
        <div className={style.contentsBox}>
          <p className={style.contents}>{petalObj.text}</p>
          {petalObj.attachmentUrl && (
            <div className={style.together}>
              <img src={petalObj.attachmentUrl} width="250px" height="250px" />
            </div>
          )}
          {isOwner && (
            <div className={style.ownBox}>
              <button className={style.ownBtn} onClick={onDeleteClick}>
                삭제하기
              </button>
              <button className={style.ownBtn} onClick={toggleEditing}>
                수정하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Petals;
