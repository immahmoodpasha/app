import {useState, useEffect} from 'react';
import box from '../assets/box.png';
import '../styles/OverviewAnalytics.css';

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
        <div className='Main-Container'>
            {/* ************************* */}
            <div className='oa-header-card'>
                <div className='oa-header-content'>
                    <img src={box} alt="logo" style={{height: '12px'}} id='img1' />
                    <p id='card-main-text'>Total Sales</p>
                </div>
                <div className='card-main-value-div'>
                    <h4 id='card-main-value-text'>₹ {data.metrics.totalSales.current}</h4>
                </div>
                <div className='card-percentage'>
                    <div className='card-percent-backgroud' style={{backgroundColor: totalsalespercentage > 0 ? 'rgba(75, 255, 56, 0.2)' : 'rgba(255, 0, 0, 0.2)'}}><p id='card-percentage-text' >{totalsalespercentage > 0 ? '+' : ' '}{totalsalespercentage} %</p></div>
                    <p id='last-year'>vs last year</p>
                </div>
             </div>
             {/* ************************* */}
             <div className='oa-header-card'>
                <div className='oa-header-content'>
                    <img src={box} alt="logo" style={{height: '12px'}} id='img1' />
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
                    <img src={box} alt="logo" style={{height: '12px'}} id='img1' />
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
                    <img src={box} alt="logo" style={{height: '12px'}} id='img1' />
                    <p id='card-main-text'>Active Customers</p>
                </div>
                <div className='card-main-value-div'>
                    <h4 id='card-main-value-text'>{data.metrics.activeCustomers.current}</h4>
                </div>
                <div className='card-percentage'>
                    <div className='card-percent-backgroud' style={{backgroundColor: changeinactivecustomers > 0 ? 'rgba(75, 255, 56, 0.2)' : 'rgba(255, 0, 0, 0.2)'}}><p id='card-percentage-text' >{changeinactivecustomers > 0 ? '+' : ' '}{changeinactivecustomers} %</p></div>
                    <p id='last-year'>vs last year</p>
                </div>
             </div>
             {/* ************************* */}
        </div>
        
    )
}


export default OverviewAnalytics;