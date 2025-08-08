import {useState, useEffect} from 'react';
import "../styles/InventorySummary.css";
import InnventoryIcon from '../assets/inventory_icon.png'
import apiClient from "../apiClient/axiosObject.js";
import { useJWT } from "../jwtContextProvider.js";
import { useRefresh } from '../refreshContextProvider.js';

function InventorySummary() {
    const {getAuthHeader} = useJWT();
    const headers = getAuthHeader();
    const [loading, setLoading] = useState(false);
    const {refreshKey} = useRefresh();
    const [data, setData] = useState(null);
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get("api/Statistics/InventorySummary", {headers});
            setData(response.data.data || []);
            console.log("Data fetched:", response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

       useEffect(()=> {
        console.log('CatDist')
           fetchData();
       }, [refreshKey])

       if (!data) return <p>Loading...</p>;
       const {totalItems,changeInPercentage,lastUpdated,inStock,lowStock,outOfStock} = data
       console.log(inStock);

       const inStockNum = Number(data.inStock)
       const totalItemsNum = Number(data.totalItems)

     

   return (
   <div className='Inventory-Summary-Card'>
       <div className='card-header'>
           <h3 id='Heading1'>Inventory Summary</h3>
           <hr id='header-line'></hr>
       </div>
       <div className='card-content'>
           <h3 id='Heading2'>Total Inventory Items</h3>
           <div className='Total-Items'>
               <h3 id='titems'>{totalItems}</h3>
               <p id='icon1'>
                   <img src={InnventoryIcon} alt="Inventory Icon" style={{height: '25px'}}/>
               </p>
           </div>
           <p className="updated-time">Last updated: Today at {lastUpdated}</p>
       </div>
       <div className='progress-bar'>
               <div className="status-row">
                   <span id='stock-label'>In Stock</span>
                   <div id='In-Stock'>
                       <span>{inStockNum}</span>
                   </div>
               </div>
               <div id='bar-cont-green'>
                       <div id='bar-green' style={{ width: `${inStockNum/totalItemsNum * 100}%` }}></div>
               </div>
       </div>
      

       <div className='progress-bar'>
               <div className="status-row">
               <span id='stock-label'>Low Stock</span>
               <div id='low-Stock'>
                   <span>{lowStock}</span>
               </div>
           </div>
           <div id='bar-cont-orange'>
                   <div id='bar-orange' style={{ width: `${lowStock/totalItemsNum * 100}%` }}></div>
           </div>

       </div>

      

       <div className='progress-bar'>
               <div className="status-row">
               <span id='stock-label'>Out of Stock</span>
               <div id='out-Stock'>
                   <span>{outOfStock}</span>
               </div>
           </div>
           <div id='bar-cont-red'>
                   <div id='bar-red' style={{ width: `${outOfStock/totalItemsNum * 100}%` }}></div>
           </div>

       </div>

      
   </div>
)
  
}

export default InventorySummary;

