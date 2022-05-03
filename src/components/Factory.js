import { useState, useRef } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import style from "css/HomeStyle.module.css";

const Factory = ({ userObj, setChangeCheck, changeCheck }) => {
  const [petal, setPetal] = useState("");
  const [attachment, setAttachment] = useState("");
  const fileInput = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const responseFile = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(responseFile.ref).catch((error) => {
        console.log(error);
        switch (error.code) {
          case "storage/object-not-found":
            alert("File doesn't exist :: 파일을 찾지 못했습니다.");
            break;
          case "storage/unauthorized":
            alert(
              "you doesn't have permission to access the object :: 선택하신 파일에 접근이 되지 않습니다."
            );
            break;
          case "storage/canceled":
            alert("It's been canceled. :: 취소되었습니다.");
            break;
          default:
            alert("Sorry, Please retry :: 죄송합니다. 다시 시도해주세요.");
        }
      });
    }
    try {
      await addDoc(collection(dbService, "petals"), {
        text: petal,
        createdAt: Date.now(),
        likeCount: 0,
        writerId: userObj.uid,
        writer: userObj.displayName,
        attachmentUrl,
      });
      setPetal("");
      fileInput.current.value = null;
      setAttachment("");
      if (changeCheck) {
        setChangeCheck(false);
      } else {
        setChangeCheck(true);
      }
    } catch (e) {
      alert("죄송합니다. 다시 시도해주세요!");
    }
  };

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setPetal(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }
  };

  const onClearAttachment = () => {
    fileInput.current.value = null;
    setAttachment("");
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={style.textBox}>
        <input
          value={petal}
          onChange={onChange}
          className={style.homeInput}
          type="text"
          placeholder="당신이 가장 빛나는 순간을 기록하세요"
          maxLength={140}
          required
        />
        <small style={{ color: "#424242", textAlign: "right" }}>
          *({petal.length}/140)
        </small>
        <div className={style.together}>
          <input
            type="file"
            className={style.homeFileBox}
            ref={fileInput}
            accept="image/*"
            onChange={onFileChange}
          />
          {attachment && (
            <div className={style.viewBox}>
              <img src={attachment} alt="preview" width="70px" height="70px" />
              <button className={style.clearBtn} onClick={onClearAttachment}>
                Clear
              </button>
            </div>
          )}
        </div>
        <input type="submit" className={style.homeLi} value="기록하기" />
      </div>
    </form>
  );
};

export default Factory;
