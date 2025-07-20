import { useEffect, useState } from "react";
import "../styles/InventoryTrends.css";
import arrowup from '../assets/arrow-up.png'
import arrowdown from '../assets/arrow-down.png'
import stopwatch from '../assets/stop-watch.png'
import pin from '../assets/pin.png'
import {
  Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,ComposedChart, Legend,
} from "recharts";

function InventoryTrends() {

    const url = "http://localhost:3113/inventoryTrends"
    const[data, setData] = useState(null);
    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            setData(data);
        })
        .catch(err => {
            console.error("Error fetching inventory trends data:", err);
        })
    },[])
    if(!data) return <p>Loading...</p>
    return (
        <div className="inventory-trends-container">
            <div className="inventory-trends-header">
               <h2 id="main-heading">Inventory Trends</h2>
               <p id="subheading">Last 1Y Data</p>
            </div>
               <hr id="header-line"></hr>
            
            <div className="header-below">
                
                <div className="arrowup">
                    <img src={arrowup} alt="arrow up" style={{height:'20px'}} />
                </div>
                <div className="below-text">
                    <p id="most-ordered-item">Most ordered Item</p>
                    <div className="below-text-item">
                        <p id="most-ordered-item-name">{data.mostOrdered.item}</p> 
                        <p id="most-ordered-item-quantity">({data.mostOrdered.quantity})</p>
                    </div>
                </div>
                <div className="stopwatch">
                    <img src={stopwatch} alt="arrow down" style={{height:'20px'}} />
                </div>
                <div className="below-text-right">
                    <p id="most-ordered-item">Fast Moving Item</p>
                    <div className="below-text-item">
                        <p id="most-ordered-item-name">{data.fastestMoving.item}</p> 
                        <p id="most-ordered-item-quantity">({data.fastestMoving.days} days)</p>
                    </div>
                </div>   
            </div>
            
            <div className="header-below-below">
                <div className="arrowdown">
                    <img src={arrowdown} alt="arrow down" style={{height:'20px'}} />
                </div>
                <div className="below-text">
                    <p id="most-ordered-item">Least Order Item</p>
                    <div className="below-text-item">
                        <p id="most-ordered-item-name">{data.leastOrdered.item}</p> 
                        <p id="most-ordered-item-quantity">({data.leastOrdered.quantity})</p>
                    </div>
                </div>
                <div className="pin">
                    <img src={pin} alt="pin" style={{height:'20px'}} />
                </div>
                <div className="below-text-right">
                    <p id="most-ordered-item">Highest Profit Margin</p>
                    <div className="below-text-item">
                        <p id="most-ordered-item-name">{data.highestProfit.item}</p> 
                        <p id="most-ordered-item-quantity">({data.highestProfit.margin})</p>
                    </div>
                </div>   
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                 <Line type="monotone" dataKey="quantity" stroke="#6c5ce7" strokeWidth={2} fill="#a29bfe" />
                </LineChart>
            </ResponsiveContainer>
              <hr id="header-line"></hr>
            </div>
            <diV className="footer">
                <h2 id="footer-heading">Updated   {data.lastUpdated}</h2>
                <button id="footer-button">
                    View Full Report
                </button>

            </diV>
          
        </div>

    )
}

export default InventoryTrends;