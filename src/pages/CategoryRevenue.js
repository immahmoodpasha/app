import {useState, useEffect} from 'react';
import "../styles/CategoryRevenue.css";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, DoughnutController } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, DoughnutController);

function CategoryRevenue() {

    const [data, setData] = useState(null)
    const url = "http://localhost:3113/CategoryRevenue"

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            setData(data);
        })
        .catch(err => {
            console.error("Error fetching category revenue data:", err);
        })
    },[])
      if (!data) return <p>Loading...</p>;

      const chartData = {
        labels: data.map(item=> item.name),
        datasets: [
            {
                data: data.map(item => item.value),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF4370', '#2E96D5', '#FFB700', '#34B8B8', '#8A5BFF'],
            }
        ]
    };  

    return (
        <div className="category-revenue-container">
            <Pie data={chartData} />
        </div>


    )

}


export default CategoryRevenue;