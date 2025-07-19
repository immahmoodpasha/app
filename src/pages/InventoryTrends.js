import { useEffect, useState } from "react";
import "../styles/InventoryTrends.css";
import arrowup from '../assets/arrow-up.png'
import arrowdown from '../assets/arrow-down.png'

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
                        <p id="most-ordered-item-quantity">{data.mostOrdered.quantity}</p>
                    </div>
                </div>
                <div className="arrowdown">
                    <img src={arrowdown} alt="arrow down" style={{height:'20px'}} />
                </div>
                <div className="below-text-right">
                    <p id="most-ordered-item">Most ordered Item</p>
                    <div className="below-text-item">
                        <p id="most-ordered-item-name">{data.mostOrdered.item}</p> 
                        <p id="most-ordered-item-quantity">{data.mostOrdered.quantity}</p>
                    </div>
                </div>   
            </div>
            
            <div className="header-below-below">
                <div className="arrowup">
                    <img src={arrowup} alt="arrow up" style={{height:'20px'}} />
                </div>
                <div className="below-text">
                    <p id="most-ordered-item">Most ordered Item</p>
                    <div className="below-text-item">
                        <p id="most-ordered-item-name">{data.mostOrdered.item}</p> 
                        <p id="most-ordered-item-quantity">{data.mostOrdered.quantity}</p>
                    </div>
                </div>
                <div className="arrowdown">
                    <img src={arrowdown} alt="arrow down" style={{height:'20px'}} />
                </div>
                <div className="below-text-right">
                    <p id="most-ordered-item">Most ordered Item</p>
                    <div className="below-text-item">
                        <p id="most-ordered-item-name">{data.mostOrdered.item}</p> 
                        <p id="most-ordered-item-quantity">{data.mostOrdered.quantity}</p>
                    </div>
                </div>   
            </div>
    </div>

    )
}

export default InventoryTrends;