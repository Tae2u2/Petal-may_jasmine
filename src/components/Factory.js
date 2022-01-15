import { useState, useRef } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";

const Factory = ({ userObj }) => {
  const [petal, setPetal] = useState("");
  const [attachment, setAttachment] = useState("");
  const fileInput = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const responseFile = await uploadString(fileRef, attachment, "data_url");
      console.log(responseFile.ref);
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
          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            alert("Sorry, Please retry :: 죄송합니다. 다시 시도해주세요.");
            break;
        }
      });
    }
    try {
      const docRef = await addDoc(collection(dbService, "petals"), {
        text: petal,
        createdAt: Date.now(),
        writerId: userObj.uid,
        attachmentUrl,
      });
      setPetal("");
      fileInput.current.value = null;
      setAttachment("");
    } catch (e) {
      console.error("Error adding document: ", e);
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
      <input
        value={petal}
        onChange={onChange}
        type="text"
        placeholder="Count your petals."
        maxLength={140}
      />
      <input
        type="file"
        ref={fileInput}
        accept="image/*"
        onChange={onFileChange}
      />
      <input type="submit" value="take Off" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default Factory;
