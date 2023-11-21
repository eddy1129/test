import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Button, message, Steps, theme, Radio, DatePicker, Space, Form, Input, Card, TimePicker } from 'antd';
import { CloseOutlined, IconProvider } from '@ant-design/icons';


export default () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  // Step 1
  const [team, setTeam] = useState('TN');
  const [date, setDate] = useState('2024/01/01');
  const dateFormat = 'YYYY/MM/DD';
  const selectDate = (date, dateString) => {
    setDate(dateString)
  };
  // Step2
  const [value, setValue] = useState(null);
  const selectTime = (time) => {
    setValue(time);
  };
  const [step2Record, setStep2Record] = useState('step1');
  const [result, setResult] = useState({ items: [] });


  const [form] = Form.useForm();


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
      <Form
        onValuesChange={(_, allValues) => {
          setStep2Record(allValues);
        }}
        labelCol={{
          span: 6,
        }}
        form={form}
        name="dynamic_form_complex"
        style={{
          margin: '0 auto',
          width: '50vw',
        }}
        autoComplete="off"
        initialValues={{
          items: [{}],
        }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Member ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >

                  <Form.Item name={[field.name, `time`]} style={{
                    width: '50%',
                    margin: '0 auto',
                    value: "9"
                  }}>
                    <TimePicker minuteStep={15} secondStep={60} hourStep={1} value={value} onChange={selectTime} />
                  </Form.Item>


                  <Form.Item name={[field.name, `action`]} style={{
                    width: '50%',
                    margin: '0 auto'
                  }}>
                    <div>
                      Action
                      <input />
                    </div>
                  </Form.Item>

                  <Form.Item name={[field.name, `alarm`]} style={{
                    width: '50%',
                    margin: '0 auto'
                  }}>
                    <div>
                      Alarm option
                      on<input type='radio' name={`member${field.name + 1}_alarm`} value={'alarm on'} />
                      off<input type='radio' name={`member${field.name + 1}_alarm`} value={'alarm off'} />
                    </div>
                  </Form.Item>

                  <Form.Item name={[field.name, `impact`]} style={{
                    width: '50%',
                    margin: '0 auto'

                  }}>
                    <div>
                      Impact option
                      on<input type='radio' name={`member${field.name + 1}_impact`} value={'Impact on'} />
                      off<input type='radio' name={`member${field.name + 1}_impact`} value={'Impact off'} />
                    </div>
                  </Form.Item>
                </Card>
              ))}

              <Button type="dashed"
                style={{
                  margin: '0 auto',
                  width: '50%',
                  marginTop: '16px'

                }}
                onClick={() => {
                  add()
                  console.log(JSON.stringify(form.getFieldsValue()))

                }} block>
                + Add Item
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </>
  )
  const last = (
    <>

      {result?.items?.map(item => item.alarm)}


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
            step2Record === 'step1' ? console.log(team, date) : setResult(JSON.stringify(form.getFieldsValue()))
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