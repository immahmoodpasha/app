import {useState, useEffect} from 'react';
import cash from '../assets/cash.png';
import percent from '../assets/percent.png';
import money from '../assets/money.png';
import customer from '../assets/group.png';
import '../styles/OverviewAnalytics.css';
import { AreaChart,Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, defs, linearGradient, LabelList} from 'recharts';


function OverviewAnalytics() {
    const url = "http://localhost:3113/OverviewAnalytics"
    const [data, setData] = useState(null);
    useEffect(()=> {
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            setData(data);
            console.log("data fetched successfully:", data);
        })
        .catch(err=>console.error("error while fetching data:", err))
    }, [])

    if(!data) return <p>Data not Fetched</p>
    // ************************
    const totalsalespercentage = ((data.metrics.totalSales.current - data.metrics.totalSales.previous) / data.metrics.totalSales.previous * 100).toFixed(2);
    // ************************
    const conversionrate = ((data.metrics.conversion.converted / data.metrics.conversion.visitors) * 100).toFixed(2);
    const lastYearConversionRate = ((data.metrics.conversion.lastYearConverted / data.metrics.conversion.lastYearVisitors) * 100).toFixed(2);
    const conversionRateChange = ((conversionrate - lastYearConversionRate) / (lastYearConversionRate)* 100).toFixed(2);
    // ************************
    const avgordervalue = (data.metrics.averageOrderValue.totalRevenue / data.metrics.averageOrderValue.totalOrders).toFixed(2);
    const lastYearAvgOrderValue = (data.metrics.averageOrderValue.lastYearRevenue / data.metrics.averageOrderValue.lastYearOrders).toFixed(2);
    const avgOrderValueChange = ((avgordervalue - lastYearAvgOrderValue) / lastYearAvgOrderValue * 100).toFixed(2);
    // ************************
    const changeinactivecustomers = ((data.metrics.activeCustomers.current - data.metrics.activeCustomers.previous)/ data.metrics.activeCustomers.previous * 100).toFixed(2);
    // ************************
    return (
        <>
        <div className='Main-Container'>
            {/* ************************* */}
            <div className='oa-header-card'>
                <div className='oa-header-content'>
                    <img src={cash} alt="logo" style={{height: '12px'}} id='img1' />
                    <p id='card-main-text'>Total Sales</p>
                </div>
                <div className='card-main-value-div'>
                    <h4 id='card-main-value-text'>₹ {data.metrics.totalSales.current.toLocaleString()}</h4>
                </div>
                <div className='card-percentage'>
                    <div className='card-percent-backgroud' style={{backgroundColor: totalsalespercentage > 0 ? 'rgba(75, 255, 56, 0.2)' : 'rgba(255, 0, 0, 0.2)'}}><p id='card-percentage-text' >{totalsalespercentage > 0 ? '+' : ' '}{totalsalespercentage} %</p></div>
                    <p id='last-year'>vs last year</p>
                </div>
             </div>
             {/* ************************* */}
             <div className='oa-header-card'>
                <div className='oa-header-content'>
                    <img src={percent} alt="logo" style={{height: '12px'}} id='img2' />
                    <p id='card-main-text'>Conversion Rate</p>
                </div>
                <div className='card-main-value-div'>
                    <h4 id='card-main-value-text'> {conversionrate} %</h4>
                </div>
                <div className='card-percentage'>
                    <div className='card-percent-backgroud' style={{backgroundColor: conversionRateChange > 0 ? 'rgba(75, 255, 56, 0.2)' : 'rgba(255, 0, 0, 0.2)'}}><p id='card-percentage-text' >{conversionRateChange > 0 ? '+' : ' '}{conversionRateChange} %</p></div>
                    <p id='last-year'>vs last year</p>
                </div>
             </div>
             {/* ************************* */}
             <div className='oa-header-card'>
                <div className='oa-header-content'>
                    <img src={money} alt="logo" style={{height: '12px'}} id='img3' />
                    <p id='card-main-text'>Avg. Order Value</p>
                </div>
                <div className='card-main-value-div'>
                    <h4 id='card-main-value-text'>₹ {avgordervalue}</h4>
                </div>
                <div className='card-percentage'>
                    <div className='card-percent-backgroud' style={{backgroundColor: avgOrderValueChange > 0 ? 'rgba(75, 255, 56, 0.2)' : 'rgba(255, 0, 0, 0.2)'}}><p id='card-percentage-text' >{avgOrderValueChange > 0 ? '+' : ' '}{avgOrderValueChange} %</p></div>
                    <p id='last-year'>vs last year</p>
                </div>
             </div>
             {/* ************************* */}
             <div className='oa-header-card'>
                <div className='oa-header-content'>
                    <img src={customer} alt="logo" style={{height: '12px'}} id='img4' />
                    <p id='card-main-text'>Active Customers</p>
                </div>
                <div className='card-main-value-div'>
                    <h4 id='card-main-value-text'>{data.metrics.activeCustomers.current.toLocaleString()}</h4>
                </div>
                <div className='card-percentage'>
                    <div className='card-percent-backgroud' style={{backgroundColor: changeinactivecustomers > 0 ? 'rgba(75, 255, 56, 0.2)' : 'rgba(255, 0, 0, 0.2)'}}><p id='card-percentage-text' >{changeinactivecustomers > 0 ? '+' : ' '}{changeinactivecustomers} %</p></div>
                    <p id='last-year'>vs last year</p>
                </div>
             </div>
             {/* ************************* */}
        </div>

        <div className='graph-container'>
            <div className='graph-header'>
                <h3 id='graph-header-text'>Revenue Growth</h3>
                <hr></hr>
            </div>
                <div className='graphh'>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={data.monthlyRevenue} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            

                        <defs>
                            <linearGradient id="gradientStroke" x1="1  " y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(0, 26, 255, 1)" />
                                <stop offset="10%" stopColor="rgba(0, 26, 255, 0.95)" />
                                <stop offset="20%" stopColor="rgba(0, 26, 255, 0.65)" />
                                <stop offset="25%" stopColor="rgba(0, 26, 255, 0.5)" />
                                <stop offset="30%" stopColor="rgba(0, 26, 255, 0.45)" />
                                <stop offset="35%" stopColor="rgba(0, 26, 255, 0.35)" />
                                <stop offset="50%" stopColor="rgba(0, 26, 255, 0.25)" />
                                <stop offset="75%" stopColor="rgba(0, 26, 255, 0.1)" />
                                <stop offset="100%" stopColor="rgba(0, 26, 255, 0.0)" />
                            </linearGradient>
                        </defs>
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false}/>
                            <YAxis tick={{ fontSize: 10 }} axisLine={false}/>
                            <Tooltip   itemStyle={{ color: '#1b3d82ff' }}
                                       formatter={(value) => `₹${value.toLocaleString("en-IN")}`} 
                                       labelStyle={{ color: '#c46767ff', fontWeight: 'bold' }}
                                       contentStyle={{
                                       backgroundColor: '#ebebebff',
                                       borderColor: '#000000ff',
                                       borderRadius: '5px',
                                    }}
                                       />
                            <Line
                                        type="monotone"
                                        dataKey="revenue" 
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        dot={{ r: 5, fill: '#ffffffff', stroke: '#4f46e5', strokeWidth: 2 }} 
                                        activeDot={{ r: 8, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="url(#gradientStroke)"
                                fill="url(#gradientStroke)"
                            />
                            
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
        </div>
        </>
        
    )
}


export default OverviewAnalytics;