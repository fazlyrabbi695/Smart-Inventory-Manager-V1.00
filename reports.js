document.addEventListener('DOMContentLoaded', () => {
    const dateRangeSelect = document.getElementById('dateRange');
    const dateRangeInputs = document.querySelectorAll('.date-range');
    const searchInput = document.getElementById('searchReport');
    
    // Add reporting methods to DataStore
    Object.assign(DataStore, {
        getDateRange(range) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            
            switch (range) {
                case 'today':
                    return { start: today, end: now };
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                    return { start: yesterday, end: today };
                case 'thisWeek':
                    return { start: startOfWeek, end: now };
                case 'lastWeek':
                    const lastWeekStart = new Date(startOfWeek);
                    lastWeekStart.setDate(startOfWeek.getDate() - 7);
                    return { start: lastWeekStart, end: startOfWeek };
                case 'thisMonth':
                    return { start: startOfMonth, end: now };
                case 'lastMonth':
                    const lastMonthStart = new Date(startOfMonth);
                    lastMonthStart.setMonth(startOfMonth.getMonth() - 1);
                    return { start: lastMonthStart, end: startOfMonth };
                case 'custom':
                    const startDate = document.getElementById('startDate').value;
                    const endDate = document.getElementById('endDate').value;
                    return {
                        start: startDate ? new Date(startDate) : null,
                        end: endDate ? new Date(endDate) : null
                    };
                default:
                    return { start: null, end: null };
            }
        },

        filterByDateRange(items, range) {
            const { start, end } = this.getDateRange(range);
            if (!start || !end) return items;

            return items.filter(item => {
                const date = new Date(item.date);
                return date >= start && date <= end;
            });
        },

        generateReport(type, dateRange) {
            const data = this.getData();
            let reportData = {
                summary: {},
                details: [],
                chartData: {}
            };

            switch (type) {
                case 'sales':
                    const filteredSales = this.filterByDateRange(data.sales, dateRange);
                    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
                    const uniqueCustomers = new Set(filteredSales.map(sale => sale.customerId)).size;
                    
                    reportData.summary = {
                        totalSales: formatCurrency(totalSales),
                        numberOfSales: filteredSales.length,
                        averageSale: formatCurrency(filteredSales.length ? totalSales / filteredSales.length : 0),
                        uniqueCustomers
                    };

                    reportData.details = filteredSales.map(sale => ({
                        date: formatDate(sale.date),
                        product: sale.productName,
                        quantity: `${sale.quantity} ${sale.unit}`,
                        price: formatCurrency(sale.price),
                        total: formatCurrency(sale.total)
                    }));

                    // Chart data: Sales by day
                    reportData.chartData = this.aggregateByDate(filteredSales);
                    break;

                case 'purchases':
                    const filteredPurchases = this.filterByDateRange(data.purchases, dateRange);
                    const totalPurchases = filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
                    
                    reportData.summary = {
                        totalPurchases: formatCurrency(totalPurchases),
                        numberOfPurchases: filteredPurchases.length,
                        averagePurchase: formatCurrency(filteredPurchases.length ? totalPurchases / filteredPurchases.length : 0),
                        uniqueSuppliers: new Set(filteredPurchases.map(p => p.supplierId)).size
                    };

                    reportData.details = filteredPurchases.map(purchase => {
                        const supplier = data.suppliers.find(s => s.id === purchase.supplierId);
                        return {
                            date: formatDate(purchase.date),
                            supplier: supplier ? supplier.name : 'Unknown',
                            product: purchase.productName,
                            quantity: `${purchase.quantity} ${purchase.unit}`,
                            price: formatCurrency(purchase.price),
                            total: formatCurrency(purchase.total)
                        };
                    });

                    // Chart data: Purchases by supplier
                    reportData.chartData = this.aggregateBySupplier(filteredPurchases, data.suppliers);
                    break;

                case 'inventory':
                    reportData.summary = {
                        totalItems: data.stock.length,
                        totalValue: formatCurrency(this.getStockValue()),
                        lowStockItems: data.stock.filter(item => item.quantity <= item.minStock).length,
                        outOfStock: data.stock.filter(item => item.quantity === 0).length
                    };

                    reportData.details = data.stock.map(item => {
                        const status = item.quantity <= item.minStock ? 'Low Stock' : 'In Stock';
                        return {
                            product: item.name,
                            quantity: `${item.quantity} ${item.unit}`,
                            minStock: item.minStock,
                            status,
                            value: formatCurrency(item.quantity * this.getLatestPrice(item.name))
                        };
                    });

                    // Chart data: Stock levels
                    reportData.chartData = this.aggregateStockLevels(data.stock);
                    break;

                case 'suppliers':
                    reportData.summary = {
                        totalSuppliers: data.suppliers.length,
                        activeSuppliers: data.suppliers.filter(s => 
                            data.purchases.some(p => p.supplierId === s.id)
                        ).length,
                        totalPurchases: formatCurrency(data.purchases.reduce((sum, p) => sum + p.total, 0))
                    };

                    reportData.details = data.suppliers.map(supplier => {
                        const supplierPurchases = data.purchases.filter(p => p.supplierId === supplier.id);
                        return {
                            name: supplier.name,
                            contact: supplier.contactPerson,
                            phone: supplier.phone,
                            totalPurchases: formatCurrency(supplierPurchases.reduce((sum, p) => sum + p.total, 0)),
                            lastPurchase: supplierPurchases.length ? 
                                formatDate(supplierPurchases.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date) : 
                                'Never'
                        };
                    });

                    // Chart data: Purchases by supplier
                    reportData.chartData = this.aggregateBySupplier(data.purchases, data.suppliers);
                    break;

                case 'profitLoss':
                    const salesInRange = this.filterByDateRange(data.sales, dateRange);
                    const purchasesInRange = this.filterByDateRange(data.purchases, dateRange);
                    const totalSalesAmount = salesInRange.reduce((sum, sale) => sum + sale.total, 0);
                    const totalPurchasesAmount = purchasesInRange.reduce((sum, purchase) => sum + purchase.total, 0);
                    const profit = totalSalesAmount - totalPurchasesAmount;

                    reportData.summary = {
                        totalSales: formatCurrency(totalSalesAmount),
                        totalPurchases: formatCurrency(totalPurchasesAmount),
                        profit: formatCurrency(profit),
                        profitMargin: ((profit / totalSalesAmount) * 100).toFixed(2) + '%'
                    };

                    // Aggregate by date for both sales and purchases
                    reportData.details = this.aggregateProfitLoss(salesInRange, purchasesInRange);
                    reportData.chartData = {
                        sales: this.aggregateByDate(salesInRange),
                        purchases: this.aggregateByDate(purchasesInRange)
                    };
                    break;
            }

            return reportData;
        },

        aggregateByDate(transactions) {
            const aggregated = {};
            transactions.forEach(t => {
                const date = formatDate(t.date);
                aggregated[date] = (aggregated[date] || 0) + t.total;
            });
            return aggregated;
        },

        aggregateBySupplier(purchases, suppliers) {
            const aggregated = {};
            purchases.forEach(p => {
                const supplier = suppliers.find(s => s.id === p.supplierId);
                const name = supplier ? supplier.name : 'Unknown';
                aggregated[name] = (aggregated[name] || 0) + p.total;
            });
            return aggregated;
        },

        aggregateStockLevels(stock) {
            const aggregated = {};
            stock.forEach(item => {
                const status = item.quantity <= item.minStock ? 'Low Stock' : 'In Stock';
                aggregated[status] = (aggregated[status] || 0) + 1;
            });
            return aggregated;
        },

        aggregateProfitLoss(sales, purchases) {
            const dailyData = {};
            
            // Aggregate sales
            sales.forEach(sale => {
                const date = formatDate(sale.date);
                if (!dailyData[date]) {
                    dailyData[date] = { date, sales: 0, purchases: 0, profit: 0 };
                }
                dailyData[date].sales += sale.total;
            });

            // Aggregate purchases
            purchases.forEach(purchase => {
                const date = formatDate(purchase.date);
                if (!dailyData[date]) {
                    dailyData[date] = { date, sales: 0, purchases: 0, profit: 0 };
                }
                dailyData[date].purchases += purchase.total;
            });

            // Calculate profit and format
            return Object.values(dailyData)
                .map(day => ({
                    date: day.date,
                    sales: formatCurrency(day.sales),
                    purchases: formatCurrency(day.purchases),
                    profit: formatCurrency(day.sales - day.purchases)
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        getLatestPrice(productName) {
            const data = this.getData();
            const latestPurchase = [...data.purchases]
                .filter(p => p.productName.toLowerCase() === productName.toLowerCase())
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            return latestPurchase ? latestPurchase.price : 0;
        }
    });

    // Download specific report
    function downloadReport(reportId) {
        const data = DataStore.getData();
        const report = data.reports.find(r => r.id === reportId);
        
        if (!report) {
            alert('Report not found');
            return;
        }

        // Generate report data
        const reportData = DataStore.generateReport(report.type, 'custom');
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Add title worksheet
        const titleData = [
            ['Report Type', capitalizeFirstLetter(report.type)],
            ['Generated Date', formatDate(report.generatedDate)],
            ['Period', capitalizeFirstLetter(report.period)],
            ['Date Range', formatDateRange(report.startDate, report.endDate)],
            ['', ''], // Empty row for spacing
        ];
        const titleWs = XLSX.utils.aoa_to_sheet(titleData);
        
        // Style the title worksheet
        titleWs['!cols'] = [{ wch: 20 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, titleWs, 'Report Info');

        // Add summary worksheet
        const summaryData = [['Metric', 'Value']];
        Object.entries(reportData.summary).forEach(([key, value]) => {
            summaryData.push([
                key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                value
            ]);
        });
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        
        // Style the summary worksheet
        summaryWs['!cols'] = [{ wch: 20 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

        // Add details worksheet with proper formatting
        if (reportData.details.length) {
            // Convert details to array format for better control over formatting
            const headers = Object.keys(reportData.details[0]);
            const detailsData = [
                headers.map(h => h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())),
                ...reportData.details.map(row => headers.map(h => row[h]))
            ];
            
            const detailsWs = XLSX.utils.aoa_to_sheet(detailsData);
            
            // Set column widths
            detailsWs['!cols'] = headers.map(() => ({ wch: 15 }));
            
            // Style headers
            const range = XLSX.utils.decode_range(detailsWs['!ref']);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const address = XLSX.utils.encode_cell({ r: 0, c: C });
                detailsWs[address].s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: "CCCCCC" } },
                    alignment: { horizontal: "center" }
                };
            }
            
            XLSX.utils.book_append_sheet(wb, detailsWs, 'Details');
        }

        // Generate filename
        const filename = `${report.type}_report_${formatDate(report.generatedDate).replace(/[\/\s]/g, '_')}.xlsx`;

        // Save file
        XLSX.writeFile(wb, filename);
    }

    // Handle date range selection
    dateRangeSelect.addEventListener('change', () => {
        dateRangeInputs.forEach(input => {
            input.style.display = dateRangeSelect.value === 'custom' ? 'block' : 'none';
        });
        if (dateRangeSelect.value !== 'custom') {
            generateReport();
        }
    });

    // Handle search
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#reportContent table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Initialize with default report
    generateReport();
});

// Generate report based on selected options
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    const reportData = DataStore.generateReport(reportType, dateRange);

    // Display summary
    displaySummary(reportData.summary);

    // Display details
    displayDetails(reportType, reportData.details);

    // Update report title
    document.getElementById('reportTitle').textContent = 
        `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Details`;
}

// Display summary cards
function displaySummary(summary) {
    const summaryContainer = document.getElementById('reportSummary');
    summaryContainer.innerHTML = '';

    Object.entries(summary).forEach(([key, value]) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
            <p class="amount">${value}</p>
        `;
        summaryContainer.appendChild(card);
    });
}

// Display details table
function displayDetails(type, details) {
    if (!details.length) {
        document.getElementById('reportContent').innerHTML = '<p>No data available for the selected period.</p>';
        return;
    }

    const headers = Object.keys(details[0]);
    const table = document.createElement('table');
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            ${headers.map(header => 
                `<th>${header.charAt(0).toUpperCase() + header.slice(1)}</th>`
            ).join('')}
        </tr>
    `;
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    details.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = headers.map(header => `<td>${row[header]}</td>`).join('');
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    document.getElementById('reportContent').innerHTML = '';
    document.getElementById('reportContent').appendChild(table);
}

// Export to Excel
function exportToExcel() {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    const reportData = DataStore.generateReport(reportType, dateRange);

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add summary worksheet
    const summaryData = [['Metric', 'Value']];
    Object.entries(reportData.summary).forEach(([key, value]) => {
        summaryData.push([
            key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            value
        ]);
    });
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Add details worksheet
    if (reportData.details.length) {
        const detailsWs = XLSX.utils.json_to_sheet(reportData.details);
        XLSX.utils.book_append_sheet(wb, detailsWs, 'Details');
    }

    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `${reportType}_report_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
}
