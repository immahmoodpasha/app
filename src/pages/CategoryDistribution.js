import { useState, useEffect } from "react";
import "../styles/CategoryDistribution.css";
import piecharticon from '../assets/pie-chart-icon.png'
import { useJWT } from "../jwtContextProvider.js";
import apiClient from "../apiClient/axiosObject.js";


function CategoryDistribution() {
   const {getAuthHeader} = useJWT();

   const headers = getAuthHeader();
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get("api/Statistics/CategoryDistribution", {headers});
            setData(response.data.data || []);
            console.log(response);
            console.log("Data fetched:", response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
        
    console.log('This is CAT DIST');


   useEffect(()=> {
    console.log('CatDist')
       fetchData();
   }, [])
   if (!data) return <p>Loading...</p>;
   const { totalCategories, totalItemsInCategories, lastUpdated, categories, recentlyAddedCategories, totalQuantityInCategories } = data;

   return(
       <div className='Inventory-Summary-Card'>
           <div className='card-info'>
       <div className='card-header'>
           <h3 id='Heading1'>Category Distribution</h3>
           <hr id='header-line'></hr>
       </div>
       <div className='card-content'>
           <h3 id='Heading2'>Inventory Categories</h3>
           <div className='total-Items-in-Categories'>
               <h3 id='titems'>{totalItemsInCategories}</h3>
               <span><p id='New-Categories-added'>↑ {recentlyAddedCategories} new</p></span>
               <p id='iconcategory'>
                   <img src={piecharticon} alt="piechart Icon " id="iconimg"/>
               </p>
           </div>
           <p className="updated-time">Last updated: Today {lastUpdated}</p>
       </div>
      
      
       {categories.map((categories, index)=>{
           const percentage = (categories.items/totalItemsInCategories)*100;
           console.log(categories.items, "and", totalItemsInCategories)
           console.log(percentage);
           return(
               <>
               <div className='progress-bar' >
                   <div className="status-row">
                       <span id='category-label'key={index}>{categories.name}</span>
                       <div id='veggies-and-fruits'>
                           <span key={index}>{categories.items}</span>
                       </div>
                   </div>
                   {percentage > 80 ? (
                           <div id='bar-cont-green'>
                               <div id='bar-green' style={{ width: `${percentage}%` }}></div>
                           </div>
                           ) : percentage > 40 ? (
                           <div id='bar-cont-orange'>
                               <div id='bar-orange' style={{ width: `${percentage}%` }}></div>
                           </div>
                           ) : (
                           <div id='bar-cont-red'>
                               <div id='bar-red' style={{ width: `${percentage}%` }}></div>
                           </div>
                           )
                   }

                   
               </div>
               </>
              
           )
       })}
       </div>
      
   </div>
   )
}


export default CategoryDistribution;

