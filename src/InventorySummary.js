import {useState, useEffect} from 'react';
import "./InventorySummary.css";
function InventorySummary() {
        const url = "http://localhost:3113/InventorySummary"

        const [data, setData] = useState(null)

        useEffect(()=> {
            fetch(url)
            .then((res)=>res.json())
            .then((data)=>setData(data))
        }, [])

        if (!data) return <p>Loading...</p>;
        const {totalItems,changePercentage,lastUpdated,inStock,lowStock,outOfStock} = data

    return (
    <div class='Inventory-Summary-Card'>
        <div className='card-header'>
            <h3 id='Heading1'>Inventory Summary</h3>
            <hr id='header-line'></hr>
        </div>
        <div className='card-content'>
            <h3 id='Heading2'>Total Inventory Items</h3>
            <div className='Total-Items'>
                <h3 id='titems'>{totalItems}</h3>
                <span><p id='perchange'>↑ {changePercentage}% from last month</p></span>
                <div id='Inventory-summary-icon1'>
                    <p>jerkin</p>
                </div>
            </div>
        </div>
    </div>
)
    
}

export default InventorySummary;