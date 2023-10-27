import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input, Col, Row, Table, Card, Statistic, Space, Radio, Modal } from 'antd';
import { Typography } from 'antd';
import { Line } from '@ant-design/plots';
import moment from 'moment';
import { AlertTwoTone } from '@ant-design/icons';
import classes from './soc.module.css'


const { Text } = Typography;
// import SubmitTicket from './components/SubmitTicket';

export default function DashBoard() {
  const [currentTime, setCurrentTime] = useState('');
  const [dashBoardCount, setDashBoardCount] = useState([{ total: '6', a2p: '6', leased: '0', ddos: '0' }]);
  const [TableData, setTableData] = useState([{
    date: '1',
    category: '1',
    project: '1',
    details: '1',
    sla: '1',
    time_left: '1',
  }]);
  // Time's background color
  const [selectedOption, setSelectedOption] = useState('1');
  const [selectedPast, setSelectedPast] = useState('7');
  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // const [Data, setData] = useState([]);
  // useEffect(() => {
  //     asyncFetch();
  //   }, []);

  //   const asyncFetch = () => {
  //     fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
  //       .then((response) => response.json())
  //       .then((json) => setData(json))
  //       .catch((error) => {
  //         console.log('fetch data failed', error);
  //       });
  //   };
  const ChangeTotal = (e) => {
    const value = e.target.value;
    //const newData = getMockData(value); // 根据时间范围获取模拟数据
    //setData(newData); // 更新数据
    // fetch("http://10.250.70.184/main/eric/ssoc_dashboard/soc_count.php?day=" + value, {
    /*     fetch("http://172.19.1.17/main/eric/ssoc_dashboard/soc_count.php?day=" + value, { */
    fetch(`https://raw.githubusercontent.com/eddy1129/test/master/src/count${value}.json`, {
      method: "GET",
      /*  headers: { "Content-Type": "application/json" }, */
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedOption(value);
        setDashBoardCount(data.data);
      });
  };
  const ChangeChart = (e) => {

    const value = e.target.value;
    /*     fetch("http://172.19.1.17/main/eric/ssoc_dashboard/soc_trend.php?day=" + value, {*/
    fetch(`https://raw.githubusercontent.com/eddy1129/test/master/src/trend${value}.json`, {
      method: "GET",
      /* headers: { "Content-Type": "application/json" }, */
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.trend);
        setSelectedPast(value);
      });
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    /*     fetch("http://172.19.1.17/main/eric/ssoc_dashboard/soc_count.php?day=1", { */
    fetch("https://raw.githubusercontent.com/eddy1129/test/master/src/day1.json", {
      method: "GET",
      /* headers: { "Content-Type": "application/json" }, */
    })
      .then((response) => response.json())
      .then((data) => {
        setDashBoardCount(data.data);
        console.log(data.data);
        console.log(dashBoardCount[0].total)
      });
    /*     fetch("http://172.19.1.17/main/eric/ssoc_dashboard/soc_trend.php?day=7", { */
    fetch("https://raw.githubusercontent.com/eddy1129/test/master/src/day7.json", {
      method: "GET",
      /* headers: { "Content-Type": "application/json" }, */
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.trend);
      });

/*     fetch("http://172.19.1.17/main/eric/ssoc_dashboard/soc_table.php", {
 */    fetch("https://raw.githubusercontent.com/eddy1129/test/master/src/data.json", {
        method: "GET",
        /* headers: { "Content-Type": "application/json" }, */
      })
      .then((response) => response.json())
      .then((data) => {
        setTableData(data.table);
      });

    const interval = setInterval(() => {
      const formattedTime = moment().format('YYYY-MM-DD');
      setCurrentTime(formattedTime);
    }, 1000);


    // Changed value Each 30 second
    const options = [{ target: { value: '1' } }, { target: { value: '7' } }, { target: { value: '30' } }, { target: { value: '90' } }];
    let newCurrentIndex = 0;

    const optionInterval = setInterval(() => {
      newCurrentIndex = (newCurrentIndex + 1) % options.length;
      const selectedValue = options[newCurrentIndex].target.value;
      setSelectedOption(selectedValue);
      ChangeTotal(options[newCurrentIndex]);
      ChangeChart(options[newCurrentIndex]);
    }, 2000);



    return () => {
      clearInterval(interval);
      clearInterval(optionInterval);

    };
  }, []);

  const config = {
    data,
    xField: 'sdate',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {
        // 数值格式化为千分位
        //formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };
  const columns = [
    {
      title: 'Date/Time',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'Details/Actions',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'SLA',
      dataIndex: 'sla',
      key: 'sla',
    },
    {
      title: 'Time Left',
      dataIndex: 'time_left',
      key: 'time_left',
    },
    {
      title: '',
      dataIndex: 'time_left',
      key: 'time_left',
      render: (time_left) => {
        //<>
        if (time_left <= 0) {
          return (
            <>
              <Button type="primary" onClick={showModal}>
                Clear
              </Button>
              <Modal title="Cleared by the below reasons?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <input type='radio' name='reasons' /> Cleared by Customer<br />
                <input type='radio' name='reasons' /> Cleared by CMHK internal support<br />
                <input type='radio' name='reasons' /> Cleared by Vendor support<br />
                <input type='radio' name='reasons' /> Cleared but none of action taken<br />
              </Modal>
            </>
          );
        }

        //</>
      },
    },
    {
      title: '',
      dataIndex: 'time_left',
      key: 'time_left',
      render: (time_left) => {
        //<>
        if (time_left <= 0) {
          return (
            <AlertTwoTone twoToneColor="#eb2f96" style={{ fontSize: '30px' }} />
          );
        }

        //</>
      },
    },
  ];

  return (
    <div id={classes.soc}>
      <Row>
      <Text strong style={{ fontSize: '24px' }} className={classes.date}>
        Date: {currentTime}
      </Text>
      </Row>
      <Row gutter={16} style={{ marginBottom: '10px' }}>
        <Col span={6} >
          <Card
            
            style={{
              background: 'linear-gradient(to top right, #60d8d4, #25a1fb)',
              color: 'white',
              
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: '10px',
                
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0',
                }}
              >
                Total
              </h2>


              <Radio.Group
                value={selectedOption}
                size="small"
                style={{ color: 'white' }}
                
                onChange={ChangeTotal}
              >
                <Radio.Button value="1" style={{ background: selectedOption === '1' ? 'rgb(251, 170, 124)' : 'transparent', color: 'white', border: '1px solid white' }}>today</Radio.Button>
                <Radio.Button value="7" style={{ background: selectedOption === '7' ? 'rgb(251, 170, 124)' : 'transparent', color: 'white', border: '1px solid white' }}>7 days</Radio.Button>
                <Radio.Button value="30" style={{ background: selectedOption === '30' ? 'rgb(251, 170, 124)' : 'transparent', color: 'white', border: '1px solid white' }}>30 days</Radio.Button>
                <Radio.Button value="90" style={{ background: selectedOption === '90' ? 'rgb(251, 170, 124)' : 'transparent', color: 'white', border: '1px solid white' }}>90 days</Radio.Button>
              </Radio.Group>
            </div>
            <Statistic
              value={dashBoardCount[0].total}
              valueStyle={{
                fontSize: '36px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: 'linear-gradient(to top right, #ec6f9e, #eb835e)',
              color: 'white',
            }}
          >
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
            }}>
              A2P
            </h2>
            <Statistic
              value={dashBoardCount[0].a2p}
              valueStyle={{
                fontSize: '36px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: 'linear-gradient(to top right, #f8c36e, #fbaa7c)',
              color: 'white',
            }}
          >
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
            }}>
              Leased Line
            </h2>
            <Statistic
              value={dashBoardCount[0].leased}
              titleStyle={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
              }}
              valueStyle={{
                fontSize: '36px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              background: 'linear-gradient(to top right, #677be5, #754ca3)',
              color: 'white',
            }}
          >
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
            }}>
              DDOS DIA
            </h2>
            <Statistic
              value={dashBoardCount[0].ddos}
              valueStyle={{
                fontSize: '36px',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginBottom: '16px'}} >
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'black',
        }}>
          Alarms Trend
        </h2>
        <Radio.Group onChange={ChangeChart} defaultValue="a">
          <Radio.Button value="7" style={{ background: selectedPast === '7' ? 'rgb(251, 170, 124)' : 'transparent', color: 'black', border: '1px solid white' }}>7 days</Radio.Button>
          <Radio.Button value="30" style={{ background: selectedPast === '30' ? 'rgb(251, 170, 124)' : 'transparent', color: 'black', border: '1px solid white' }}>30 days</Radio.Button>
          <Radio.Button value="90" style={{ background: selectedPast === '90' ? 'rgb(251, 170, 124)' : 'transparent', color: 'black', border: '1px solid white' }}>90 days</Radio.Button>
        </Radio.Group>
        <div style={{ marginBottom: '16px'}}></div>
        <Line {...config} style={{ marginBottom: '16px',height:'200px' }}/>
      </Card>
      <Card>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'black',
          
        }}>
          Alarms Highlights
        </h2>
        <Table
          dataSource={TableData}
          columns={columns}
          pagination
          scroll={{ x: 300 }}
        />
      </Card>
    </div>
  );

};
