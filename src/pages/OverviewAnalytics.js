import {useState, useEffect} from 'react';
import cash from '../assets/cash.png';
import percent from '../assets/percent.png';
import money from '../assets/money.png';
import customer from '../assets/group.png';
import cart from '../assets/trolley.png';
import '../styles/OverviewAnalytics.css';
import clock from '../assets/wall-clock.png';
import checkmark from '../assets/check-mark.png';
import cancel from '../assets/remove.png';
import { AreaChart,Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, defs, linearGradient, LabelList} from 'recharts';
import { useJWT } from "../jwtContextProvider.js";
import apiClient from "../apiClient/axiosObject.js";
import fire from '../assets/fire.webp'
import { useRefresh } from '../refreshContextProvider.js';


function OverviewAnalytics() {
   const {getAuthHeader} = useJWT();

   const headers = getAuthHeader();
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
       const fetchData = async () => {
           setLoading(true);
           try {
             const response = await apiClient.get("api/Statistics/RevenueAnalysis", {headers});
             setData(response.data.data || []);
             console.log("Data fetched:", response.data.data);
           } catch (error) {
             console.error("Error fetching data:", error);
           } finally {
             setLoading(false);
           }
          };
  const {refreshKey} = useRefresh();

   useEffect(()=> {
       fetchData();
   }, [refreshKey])

   if(!data) return <p>Data not Fetched</p>
   // ************************
   // ************************
   const {activeCustomers, avgOrderValue, completedOrders, pendingOrders, totalSales, totalOrders, yearlyRevenue, mostSoldProduct} = data;
   return (
       <>
       <div className='Main-Container'>
           {/* ************************* */}
           <div className='oa-header-card'>
               <div className='oa-header-content'>
                   <img src={cash} alt="logo" style={{height: '40px'}} id='img1' />
                   <p id='card-main-text'>Total Sales</p>
               </div>
               <div className='card-main-value-div'>
                   <h4 id='card-main-value-text'>₹ {totalSales}</h4>
               </div>
            </div>
            {/* ************************* */}
            <div className='oa-header-card'>
               <div className='oa-header-content'>
                   <img src={money} alt="logo" style={{height: '40px'}} id='img3' />
                   <p id='card-main-text'>Avg. Order Value</p>
               </div>
               <div className='card-main-value-div'>
                   {console.log(avgOrderValue)}
                   <h4 id='card-main-value-text'>₹ {avgOrderValue}</h4>
               </div>
            </div>
            {/* ************************* */}
            <div className='oa-header-card'>
               <div className='oa-header-content'>
                   <img src={percent} alt="logo" style={{height: '40px'}} id='img2' />
                   <p id='card-main-text'>Active Customers</p>
               </div>
               <div className='card-main-value-div'>
                   <h4 id='card-main-value-text'> {activeCustomers}</h4>
               </div>
            </div>
            {/* ************************* */}
            <div className='oa-header-card'>
               <div className='oa-header-content'>
                   <img src={fire} alt="logo" style={{height: '40px', width: '40px'}} id='img5' />
                   <p id='card-main-text'>Most Sold Product</p>
               </div>
               <div className='card-main-value-div'  style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4%'}}>
                   <h4 id='card-main-value-text'> {mostSoldProduct.quantity}</h4>
                   <p id='card-sub-value-text'> {mostSoldProduct.pName}</p>
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
                       <AreaChart data={yearlyRevenue} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
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
                           <Tooltip   itemStyle={{color: '#002164ff' }}
                                      formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                                      labelStyle={{ color: '#000000ff', fontWeight:300 }}
                                      contentStyle={{
                                      backgroundColor: '#0037ff39',
                                      border: 'none',
                                      borderRadius: '5px',
                                      boxShadow: '0px 1px 0px 3px #16de0b38'
                                   }}
                           />
                           {/* <Line
                                       type="monotone"
                                       dataKey="revenue"                                                                               
                                       stroke="#4f46e5"
                                       strokeWidth={3}
                                       dot={{ r: 5, fill: '#ffffffff', stroke: '#4f46e5', strokeWidth: 2 }}
                           /> */}
                           <Area
                               type="monotone"
                               dataKey="revenue"
                               stroke="rgba(0, 26, 255, 1)"
                               fill="url(#gradientStroke)"
                               strokeWidth={2}
                           />
                       </AreaChart>
                   </ResponsiveContainer>
               </div>
               <div className='graphh-footer' style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                   <div className='graphh-footer-box'>
                       <div>
                           <h1 id='graph-footer-header'>Total Orders</h1>
                           <h1 id='total-orders'>{totalOrders}</h1>
                       </div>
                       <img src={cart} alt="logo" style={{height: '40px'}} id='footer-icon'/>
                   </div>
                   <div className='graphh-footer-box'>
                       <div>
                           <h1 id='graph-footer-header'>Pending</h1>
                           <h1 id='total-orders'>{pendingOrders}</h1>
                       </div>
                       <img src={clock} alt="logo" style={{height: '40px'}} id='footer-icon'/>
                   </div>
                   <div className='graphh-footer-box'>
                       <div>
                           <h1 id='graph-footer-header'>Completed</h1>
                           <h1 id='total-orders'>{completedOrders}</h1>
                       </div>
                       <img src={checkmark} alt="logo" style={{height: '40px'}} id='footer-icon'/>
                   </div>
               </div>
       </div>
       </>
      
   )
}


export default OverviewAnalytics;

