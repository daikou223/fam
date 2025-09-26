import React from 'react';

export default function Modal(props) {
  // 変数******************************************
  const onSelect = props.onSelect;
  const modalDisp = props.modalDisp;
  const modalData = props.modalData;
  // スタイル
  const styles = {
    backgroundBrocker:{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1100, // モーダルより下
      backgroundColor: "rgba(0, 0, 0, 0.3)", // 半透明ブラック
      pointerEvents: "auto", // これが重要！
    },
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
    <div style = {modalDisp ? styles.backgroundBrocker:styles.nonModalStyle}>
      <div style={modalDisp ? styles.modalStyle: styles.nonModalStyle}>
        <div style={{ marginBottom: "10px", textAlign: "center" }}>
          {modalData.message}
        </div>
        {modalData.selection.map((select, idx) => (
          <button key={idx} style={{...styles.buttonStyle,backgroundColor:select.color}} onClick = {()=>onSelect(idx)}>
            {select.selectMessage}
          </button>
        ))}
      </div>
    </div>
  );
}
