import React, {useEffect, useState} from 'react';
import {Calendar, Badge, List, Card, Tag, Modal, Button, Row, Col, Statistic} from 'antd';
import { CalendarOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import './index.scss'
import {FollowCalendar} from "@/api/system/home/index.js";

export default () => {
    const [followSituation, setFollowSituation] = useState({
        totalCount: 0,
        followCount: 0,
        unFollowCount: 0,
    });
    // todo 获取随访情况
    const getSituation = () => {

    }

    useEffect(() => {
        getSituation();
    },[])

    const [followData, setFollowData] = useState([]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // 获取指定日期随访记录
    const getListData = (dateStr) => {
        return followData.filter(item => item.label === dateStr);
    };

    // 状态颜色映射
    const statusColor = {
        pending: 'orange',
        completed: 'green',
        cancelled: 'red'
    };

    const statusText = {
        pending: '待完成',
        completed: '已完成',
        cancelled: '已取消'
    };

    // 随访类型颜色
    const typeColor = {
        1: 'blue',
        2: 'purple'
    };

    // 日历单元格渲染
    const dateCellRender = (current) => {
        const dateStr = current.format('YYYY-MM-DD');
        const listData = getListData(dateStr);

        if (listData.length === 0) return null;

        return (
            <div className="calendar-cell" style={{ minHeight: 80 }}>
                {listData.map((item, index) => (
                    <div
                        key={item.id}
                        style={{
                            margin: '2px 0',
                            padding: '2px 4px',
                            background: typeColor[item.followType] + '15',
                            borderLeft: `3px solid ${typeColor[item.followType]}`,
                            borderRadius: '2px',
                            fontSize: '12px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold' }}>{item.time}</span>
                            <StatusLabel
                                type={'badge'}
                                options={Constant.FollowStatusOptions}
                                value={item.status}
                                size="small"
                            />
                        </div>
                        <div>{item.patientName}</div>
                        <StatusLabel
                            type={'tag'}
                            options={Constant.FollowTypeOptions}
                            value={item.followType}
                            size="small"
                        />
                    </div>
                ))}
            </div>
        );
    };

    // 月份单元格渲染（显示当月随访数量）
    const monthCellRender = (current) => {
        const monthStr = current.format('YYYY-MM');
        const monthData = followData.filter(item =>
            item.label.startsWith(monthStr)
        );

        if (monthData.length === 0) return null;

        return (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
                <Badge
                    count={monthData.length}
                    style={{ backgroundColor: '#52c41a' }}
                    showZero={false}
                />
            </div>
        );
    };

    const cellRender = (current, info) => {
        if (info.type === 'date') {
            return dateCellRender(current);
        }
        if (info.type === 'month') {
            return monthCellRender(current);
        }
        return info.originNode
    }

    // 处理日期选择
    const onSelect = (date) => {
        console.log('日历选中日期', date)
        const dateStr = date.format('YYYY-MM-DD');
        setSelectedDate(dateStr);
        setModalVisible(true);
    };

    useEffect(()=>{
        getCalendar()
    },[selectedDate])
    // 获取随访日历数据
    const getCalendar = () => {
        console.log('获取随访数据')
        return FollowCalendar({
            chooseDate: selectedDate
        }).then(res => {
            setFollowData(res.data);
        })
    }

    return (
        <div style={{padding: 10, background: '#fff'}} className={'home'}>
            <div className={'record-list'}>
                <div className={'title'}>
                    随访情况
                </div>
                <Row gutter={12}>
                    <Col span={8}>
                        <Card variant="borderless">
                            <Statistic
                                title={'总计随访人数'}
                                value={followSituation.totalCount}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card variant="borderless">
                            <Statistic
                                title={'待随访人数'}
                                value={followSituation.unFollowCount}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card variant="borderless">
                            <Statistic
                                title={'已完成随访人数'}
                                value={followSituation.followCount}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
            <div className={'calendar'}>
                <Card
                    title={
                        <div>
                            <CalendarOutlined style={{marginRight: 8}}/>
                            随访日历
                        </div>
                    }
                    extra={
                        <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
                            <div>
                                <Badge color="blue" text="常规随访"/>
                                <Badge color="purple" text="术后复查" style={{marginLeft: 8}}/>
                            </div>
                            <div>
                                <Badge status="success" text="已完成"/>
                                <Badge status="processing" text="待完成" style={{marginLeft: 8}}/>
                                <Badge status="default" text="已取消" style={{marginLeft: 8}}/>
                            </div>
                        </div>
                    }
                >
                    <Calendar
                        cellRender={cellRender}
                        onSelect={onSelect}
                    />
                </Card>
                {/* 日期详情模态框 */}
                <Modal
                    title={`${selectedDate} 随访安排`}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setModalVisible(false)}>
                            关闭
                        </Button>
                    ]}
                    width={600}
                >
                    {selectedDate && (
                        <List
                            dataSource={getListData(selectedDate)}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <Button type="link" size="small">查看详情</Button>,
                                        <Button type="link" size="small">编辑</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                background: typeColor[item.followType],
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}>
                                                {item.patientName.charAt(0)}
                                            </div>
                                        }
                                        title={
                                            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                                <span>{item.patientName}</span>
                                                <StatusLabel
                                                    type={'tag'}
                                                    options={Constant.FollowTypeOptions}
                                                    value={item.followType}
                                                    size="small"
                                                />
                                                <StatusLabel
                                                    type={'badge'}
                                                    options={Constant.FollowStatusOptions}
                                                    value={item.status}
                                                    size="small"
                                                />
                                            </div>
                                        }
                                        description={
                                            <div>
                                                <div>
                                                    <UserOutlined/> 随访医生：{item.doctorName}
                                                </div>
                                                <div>
                                                    <TeamOutlined/> 时间：{item.time}
                                                </div>
                                                <div>患者ID：{item.patientId}</div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                            locale={{emptyText: '该日期暂无随访安排'}}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
};
