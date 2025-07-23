import { useState } from "react";
import '../styles/Dashboard.css';
import Inventory from "./Inventory";
import Header from "./Header";
import InventorySummary from "./InventorySummary";
import InventoryTrends from "./InventoryTrends";
import CategoryDistribution from "./CategoryDistribution";
import CategoryRevenue from "./CategoryRevenue";
import OverviewAnalytics from "./OverviewAnalytics";
const Dashboard = () => {
    const [selectedOption, setSelectedOption] = useState('Inv');


    
    return(
        <div id="dashboard">
            <div id="header">
            <Header />
            </div>
            <div id="navMenu">
                <div id="inventoryOption" onClick={()=>setSelectedOption('Inv')}>Inventory</div>
                <div id="statisticsOption" onClick={()=>setSelectedOption('St')}>Statistics</div>
            </div>
            <div id="content">
                {selectedOption==='Inv' && (
                    <div id="tab-content">
                        <div id="left">
                            <div id="inventory">
                                <Inventory />
                            </div>
                            <div id="inventoryTrends">
                                <InventoryTrends />
                            </div>
                        </div>
                        
                        <div id="right">
                            <div id="inventorySummary">
                                <InventorySummary />
                            </div>
                            <div id="categoryDistribution">
                                <CategoryDistribution />
                            </div>
                        </div>
                       
                        
                    </div>
                    
                )}
                {selectedOption==='St' && (
                    <div id="tab-content">
                        <div id="overviewAnalytics">
                            <OverviewAnalytics />
                        </div>
                    </div>
                    
                )}
                
            </div>
            

        </div>
    );
}

export default Dashboard;