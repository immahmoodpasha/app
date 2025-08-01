import { useState } from "react";
import '../styles/Dashboard.css';
import Inventory from "./Inventory";
import InventorySummary from "./InventorySummary";
import InventoryTrends from "./InventoryTrends";
import CategoryDistribution from "./CategoryDistribution";
import CategoryRevenue from "./CategoryRevenue";
import OverviewAnalytics from "./OverviewAnalytics";
import { FiSearch, FiMessageCircle, FiLink, FiLogOut } from 'react-icons/fi';
import exit from "../assets/exit.png"
import logo from "../assets/RapiddLogo.png"

const Dashboard = () => {
    const [selectedOption, setSelectedOption] = useState('Inv');
    
    return(
        <div id="dashboard">
            <div id="header">
                <div id="head-cont">
                    <img id="logo" src={logo} alt="Logo" width={'12%'} height={'3%'}/>
                    <div id="profileIcon-cont">
                        <div id="btn-header">
                            <div id='navMenu'>
                                <div id="inventoryOption" onClick={()=>setSelectedOption('Inv')}>Inventory</div>
                                <div id="statisticsOption" onClick={()=>setSelectedOption('St')}>Statistics</div>
                            </div>
                            <button id="logout-manager"><FiLogOut size={24} /></button>
                        </div>
                    </div>
                </div>
            </div>
            <hr></hr>
            <div id="content">
                {selectedOption==='Inv' && (
                    <div id="tab-content">
                        <div id="left-dash">
                            <div id="inventory">
                                <Inventory />
                            </div>
                            <div id="inventoryTrends">
                                <InventoryTrends />
                            </div>
                        </div>
                        
                        <div id="right-dash">
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