import { useState, useEffect } from "react";
import "../styles/CategoryDistribution.css";
import piecharticon from '../assets/pie-chart-icon.png'



function CategoryDistribution() {
    const url = "http://localhost:3113/CategoryDistribution"
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then((data)=>setData(data))
    },[])
    if (!data) return <p>Loading...</p>;

    const { totalCategories, totalItemsinCategories, lastUpdatedTime, categories, RecentlyAddedCategories, totalQuantityinCategories } = data;

    return(
        <div className='Inventory-Summary-Card'>
        <div className='card-header'>
            <h3 id='Heading1'>Category Distribution</h3>
            <hr id='header-line'></hr>
        </div>
        <div className='card-content'>
            <h3 id='Heading2'>Inventory Categories</h3>
            <div className='total-Items-in-Categories'>
                <h3 id='titems'>{totalItemsinCategories}</h3>
                <span><p id='New-Categories-added'>↑ {RecentlyAddedCategories} new</p></span>
                <p id='iconcategory'>
                    <img src={piecharticon} alt="piechart Icon " id="iconimg"/>
                </p>
            </div>
            <p className="updated-time">Last updated: Today</p>
        </div>
        
        
        {categories.map((categories, index)=>{
            const percentage = (categories.items/totalQuantityinCategories)*100;
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
    )
 
}


export default CategoryDistribution;