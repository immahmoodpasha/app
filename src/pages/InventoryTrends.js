import { useEffect, useState } from "react";
import "../styles/InventoryTrends.css";

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
                <hr id="header-line"></hr>
                
            </div>

        </div>

    )
}

export default InventoryTrends;