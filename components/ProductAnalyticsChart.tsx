import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Product } from '../types';

interface ProductAnalyticsChartProps {
    products: Product[];
}

const ProductAnalyticsChart: React.FC<ProductAnalyticsChartProps> = ({ products }) => {
    // In a real application, this data would come from sales records.
    // Here, we generate mock data based on product categories.
    const processData = () => {
        const categorySales: { [key: string]: number } = {};
        
        products.forEach(p => {
            if (!categorySales[p.category]) {
                categorySales[p.category] = 0;
            }
            // Generate a random-ish sales figure for demonstration
            categorySales[p.category] += p.price * (Math.floor(Math.random() * 15) + 5);
        });

        return Object.keys(categorySales).map(category => ({
            name: category,
            Sales: parseFloat(categorySales[category].toFixed(2)),
        })).sort((a, b) => b.Sales - a.Sales);
    };
    
    const data = processData();

    return (
        <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `₱${value}`} tick={{ fontSize: 12 }} />
                    <Tooltip 
                        cursor={{fill: 'rgba(236, 252, 241, 0.5)'}}
                        formatter={(value: number) => [`₱${value.toFixed(2)}`, 'Sales']} 
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}} />
                    <Bar dataKey="Sales" fill="#10B981" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProductAnalyticsChart;