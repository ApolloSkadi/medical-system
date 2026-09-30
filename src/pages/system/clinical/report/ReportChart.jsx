import {useEffect, useRef} from "react";
import * as echarts from "echarts";

// 报表echarts容器: option变化整图重绘, 窗口尺寸变化自适应
export default ({option, height = '22rem'}) => {
    const containerRef = useRef();
    const chartRef = useRef();

    useEffect(() => {
        if (!chartRef.current) {
            chartRef.current = echarts.init(containerRef.current);
        }
        chartRef.current.setOption(option, true);
    }, [option]);

    useEffect(() => {
        const onResize = () => chartRef.current?.resize();
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            chartRef.current?.dispose();
            chartRef.current = null;
        };
    }, []);

    return <div ref={containerRef} style={{width: '100%', height}}/>;
};
