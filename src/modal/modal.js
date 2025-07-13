import React from 'react';

export default function Modal(props) {
  // 変数******************************************
  const message = props.message ?? ""; 
  const selection = props.selection ?? [];
  const onSelect = props.onSelect;
  const modalDisp = props.modalDisp;

  // スタイル
  const styles = {
    modalStyle: {
      position: "fixed",
      top: "20%",
      left: "50%",
      transform: "translate(-50%, -20%)",
      zIndex: 1200,
      padding: "20px",
      border: "2px solid black",
      backgroundColor: "white",
      width: "300px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column", // 縦並び
      alignItems: "center",
      gap: "10px"
    },
    nonModalStyle: {
      display:"none"
    },
    buttonStyle: {
      width: "100%",
      padding: "8px",
      fontSize: "16px",
      cursor: "pointer"
    }
  };
  //関数定義*****************************************
  return (
    <div style={modalDisp ? styles.modalStyle: styles.nonModalStyle}>
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        {message}
      </div>
      {selection.map((select, idx) => (
        <button key={idx} style={styles.buttonStyle} onClick = {()=>onSelect(idx)}>
          {select}
        </button>
      ))}
    </div>
  );
}
