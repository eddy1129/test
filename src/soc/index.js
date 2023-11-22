import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Button, message, Steps, theme, Radio, DatePicker, Space, Form, Input, Card, TimePicker, Result } from 'antd';
import { CloseOutlined, IconProvider } from '@ant-design/icons';


export default () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  // Step 1
  const [team, setTeam] = useState('TN');
  const [date, setDate] = useState('2024/01/01');
  const [inputList, setInputlist] = useState([]);
  const dateFormat = 'YYYY/MM/DD';
  const selectDate = (date, dateString) => {
    setDate(dateString)
  };
 
  const step1 = (
    <>
      <p>Your Team</p>
      <Radio.Group name="radiogroup" value={team} onChange={(e) => setTeam(e.target.value)}>
        <Radio value={'TN'} defaultChecked>TN</Radio>
        <Radio value={'CS'}>CS</Radio>
        <Radio value={'PS'}>PS</Radio>
        <Radio value={'RN'}>RN</Radio>
      </Radio.Group>
      <p>Input Date</p>
      <Space direction="vertical">
        <DatePicker defaultValue={dayjs(date, dateFormat)} onChange={selectDate} />
      </Space>
    </>
  );

  const step2 = (
    <>
     
    </>
  )
  const last = (
    <>

      

    </>
  );


  const steps = [
    {
      title: 'Input',
      content: step1,
    },
    {
      title: 'Second',
      content: step2,
    },
    {
      title: 'Last',
      content: last,
    },
  ];

  const next = () => {
    if (current === 0 && !team) {
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle = {
    lineHeight: '180px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => {
            next()      
          }}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
}