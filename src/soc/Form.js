
 // Step2
 const [value, setValue] = useState(null);
 const selectTime = (time) => {
   setValue(time);
 };
 const [step2Record, setStep2Record] = useState('step1');
 const [step2Record2, setStep2Record2] = useState({});

const [form] = Form.useForm();

<Form
    onValuesChange={(_, allValues) => {
        console.log(allValues)
        setStep2Record2(allValues);
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

//next() after step2Record === 'step1' ? console.log(team, date) : setResult(JSON.stringify(form.getFieldsValue()))