import React from "react";

const AlarmDisplay = ({ step2Record2 }) => {
  const { items } = step2Record2;

  return (
    <div>
      {items.map((item, index) => (
        <>
          <p>Member1: {index}</p>
          <p key={index}>{item.time.format('YYYY-MM-DD HH:mm:ss')}</p>
          <p key={index}>{item.action}</p>
          <p key={index}>{item.alarm}</p>
          <p key={index}>{item.impact}</p>
        </>
      ))}
    </div>
  );
};

export default AlarmDisplay;
