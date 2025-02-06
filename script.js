// Initialize local storage if not exists
if (!localStorage.getItem('sales')) {
    localStorage.setItem('sales', JSON.stringify([]));
}
if (!localStorage.getItem('purchases')) {
    localStorage.setItem('purchases', JSON.stringify([]));
}
if (!localStorage.getItem('suppliers')) {
    localStorage.setItem('suppliers', JSON.stringify([]));
}

// Language translations
const translations = {
    en: {
        'title': 'Farmer to Consumer',
        'nav-dashboard': 'Dashboard',
        'nav-sales': 'Sales',
        'nav-purchases': 'Purchases',
        'nav-suppliers': 'Suppliers',
        'nav-reports': 'Reports',
        'dashboard-title': 'Dashboard',
        'today-sales': "Today's Sales",
        'today-purchases': "Today's Purchases",
        'monthly-revenue': 'Monthly Revenue',
        'sales-title': 'Sales Entry',
        'sale-date': 'Date:',
        'product-name': 'Product Name:',
        'quantity': 'Quantity:',
        'price': 'Price per unit:',
        'add-sale': 'Add Sale',
        'sales-history': 'Sales History',
        'sales-start-date': 'From:',
        'sales-end-date': 'To:',
        'view-history': 'View History',
        'purchases-title': 'Purchase Entry',
        'purchase-date': 'Date:',
        'supplier': 'Select Supplier:',
        'choose-supplier': 'Choose a supplier',
        'purchase-product': 'Product Name:',
        'purchase-quantity': 'Quantity:',
        'purchase-price': 'Price per unit:',
        'add-purchase': 'Add Purchase',
        'purchases-history': 'Purchase History',
        'purchase-start-date': 'From:',
        'purchase-end-date': 'To:',
        'suppliers-title': 'Suppliers Management',
        'add-supplier': 'Add New Supplier',
        'supplier-name': 'Supplier Name:',
        'supplier-phone': 'Phone Number:',
        'supplier-address': 'Address:',
        'add-supplier-btn': 'Add Supplier',
        'suppliers-list-title': 'Suppliers List',
        'reports-title': 'Reports',
        'daily-report': 'Daily Report',
        'monthly-report': 'Monthly Report',
        'yearly-report': 'Yearly Report',
        'generate-report': 'Generate Report',
        'export-report': 'Export PDF',
        'export-excel': 'Export Excel',
        'report-summary': 'Report Summary',
        'category': 'Category',
        'total-amount': 'Total Amount',
        'pcs': 'Pieces',
        'kg': 'Kilograms',
        'g': 'Grams',
        'l': 'Liters',
        'ml': 'Milliliters',
        'dz': 'Dozen'
    },
    bn: {
        'title': 'কৃষক থেকে ভোক্তা',
        'nav-dashboard': 'ড্যাশবোর্ড',
        'nav-sales': 'বিক্রয়',
        'nav-purchases': 'ক্রয়',
        'nav-suppliers': 'সরবরাহকারী',
        'nav-reports': 'রিপোর্ট',
        'dashboard-title': 'ড্যাশবোর্ড',
        'today-sales': 'আজকের বিক্রয়',
        'today-purchases': 'আজকের ক্রয়',
        'monthly-revenue': 'মাসিক আয়',
        'sales-title': 'বিক্রয় এন্ট্রি',
        'sale-date': 'তারিখ:',
        'product-name': 'পণ্যের নাম:',
        'quantity': 'পরিমাণ:',
        'price': 'একক মূল্য:',
        'add-sale': 'বিক্রয় যোগ করুন',
        'sales-history': 'বিক্রয় ইতিহাস',
        'sales-start-date': 'থেকে:',
        'sales-end-date': 'পর্যন্ত:',
        'view-history': 'ইতিহাস দেখুন',
        'purchases-title': 'ক্রয় এন্ট্রি',
        'purchase-date': 'তারিখ:',
        'supplier': 'সরবরাহকারী নির্বাচন করুন:',
        'choose-supplier': 'একজন সরবরাহকারী বেছে নিন',
        'purchase-product': 'পণ্যের নাম:',
        'purchase-quantity': 'পরিমাণ:',
        'purchase-price': 'একক মূল্য:',
        'add-purchase': 'ক্রয় যোগ করুন',
        'purchases-history': 'ক্রয় ইতিহাস',
        'purchase-start-date': 'থেকে:',
        'purchase-end-date': 'পর্যন্ত:',
        'suppliers-title': 'সরবরাহকারী ব্যবস্থাপনা',
        'add-supplier': 'নতুন সরবরাহকারী যোগ করুন',
        'supplier-name': 'সরবরাহকারীর নাম:',
        'supplier-phone': 'ফোন নম্বর:',
        'supplier-address': 'ঠিকানা:',
        'add-supplier-btn': 'সরবরাহকারী যোগ করুন',
        'suppliers-list-title': 'সরবরাহকারীদের তালিকা',
        'reports-title': 'রিপোর্ট',
        'daily-report': 'দৈনিক রিপোর্ট',
        'monthly-report': 'মাসিক রিপোর্ট',
        'yearly-report': 'বার্ষিক রিপোর্ট',
        'generate-report': 'রিপোর্ট তৈরি করুন',
        'export-report': 'পিডিএফ এ রপ্তানি করুন',
        'export-excel': 'এক্সেলে রপ্তানি করুন',
        'report-summary': 'রিপোর্ট সংক্ষিপ্ত',
        'category': 'বিভাগ',
        'total-amount': 'মোট পরিমাণ',
        'pcs': 'পিস',
        'kg': 'কিলোগ্রাম',
        'g': 'গ্রাম',
        'l': 'লিটার',
        'ml': 'মিলিলিটার',
        'dz': 'ডজন'
    }
};

// Language switching functionality
function setLanguage(lang) {
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update placeholders for search inputs
    if (document.getElementById('salesSearch')) {
        document.getElementById('salesSearch').placeholder = lang === 'bn' ? 'বিক্রয় খুঁজুন...' : 'Search sales...';
    }
    if (document.getElementById('purchaseSearch')) {
        document.getElementById('purchaseSearch').placeholder = lang === 'bn' ? 'ক্রয় খুঁজুন...' : 'Search purchases...';
    }
    if (document.getElementById('supplierSearch')) {
        document.getElementById('supplierSearch').placeholder = lang === 'bn' ? 'সরবরাহকারী খুঁজুন...' : 'Search suppliers...';
    }
}

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'bn';
    
    languageSelect.value = savedLanguage;
    setLanguage(savedLanguage);
    
    // Add event listener for language change
    languageSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
});

// Show active section and hide others
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Update supplier dropdown when showing purchases section
    if (sectionId === 'purchases') {
        updateSupplierDropdown();
        setDefaultDate('purchaseDate');
        setDefaultHistoryDates();
    }
    
    // Set default date for sales section
    if (sectionId === 'sales') {
        setDefaultDate('saleDate');
        setDefaultHistoryDates();
    }
}

// Set default date for date inputs
function setDefaultDate(inputId) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(inputId).value = today;
}

// Set default dates for history views
function setDefaultHistoryDates() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const startDateStr = thirtyDaysAgo.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];
    
    // Set sales date range
    document.getElementById('salesStartDate').value = startDateStr;
    document.getElementById('salesEndDate').value = endDateStr;
    
    // Set purchase date range
    document.getElementById('purchaseStartDate').value = startDateStr;
    document.getElementById('purchaseEndDate').value = endDateStr;
}

// Update supplier dropdown
function updateSupplierDropdown() {
    const suppliers = JSON.parse(localStorage.getItem('suppliers'));
    const supplierSelect = document.getElementById('supplier');
    
    // Keep only the first option (placeholder)
    supplierSelect.innerHTML = '<option value="">Choose a supplier</option>';
    
    // Add all suppliers to dropdown
    suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.id;
        option.textContent = supplier.name;
        supplierSelect.appendChild(option);
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BDT',
        currencyDisplay: 'narrowSymbol'
    }).format(amount).replace('BDT', '৳');
}

// Add sale
document.getElementById('salesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const sale = {
        productName: document.getElementById('productName').value,
        quantity: parseFloat(document.getElementById('quantity').value),
        unit: document.getElementById('unit').value,
        price: parseFloat(document.getElementById('price').value),
        total: parseFloat(document.getElementById('quantity').value) * parseFloat(document.getElementById('price').value),
        date: new Date(document.getElementById('saleDate').value).toISOString()
    };
    
    const sales = JSON.parse(localStorage.getItem('sales'));
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));
    
    updateDashboard();
    this.reset();
    setDefaultDate('saleDate'); // Reset date to today after form submission
});

// Add purchase
document.getElementById('purchaseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const supplierId = document.getElementById('supplier').value;
    const suppliers = JSON.parse(localStorage.getItem('suppliers'));
    const supplier = suppliers.find(s => s.id === parseInt(supplierId));
    
    if (!supplier) {
        alert('Please select a valid supplier');
        return;
    }
    
    const purchase = {
        supplierId: supplier.id,
        supplierName: supplier.name,
        productName: document.getElementById('purchaseProduct').value,
        quantity: parseFloat(document.getElementById('purchaseQuantity').value),
        unit: document.getElementById('purchaseUnit').value,
        price: parseFloat(document.getElementById('purchasePrice').value),
        total: parseFloat(document.getElementById('purchaseQuantity').value) * parseFloat(document.getElementById('purchasePrice').value),
        date: new Date(document.getElementById('purchaseDate').value).toISOString()
    };
    
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    purchases.push(purchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));
    
    updateDashboard();
    this.reset();
    setDefaultDate('purchaseDate'); // Reset date to today after form submission
    updateSupplierDropdown(); // Refresh supplier dropdown after form reset
});

// Update dashboard
function updateDashboard() {
    const sales = JSON.parse(localStorage.getItem('sales'));
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's sales
    const todaySales = sales
        .filter(sale => sale.date.startsWith(today))
        .reduce((sum, sale) => sum + sale.total, 0);
    
    // Calculate today's purchases
    const todayPurchases = purchases
        .filter(purchase => purchase.date.startsWith(today))
        .reduce((sum, purchase) => sum + purchase.total, 0);
    
    // Calculate monthly revenue
    const currentMonth = today.substring(0, 7);
    const monthlyRevenue = sales
        .filter(sale => sale.date.startsWith(currentMonth))
        .reduce((sum, sale) => sum + sale.total, 0);
    
    document.getElementById('todaySales').textContent = formatCurrency(todaySales);
    document.getElementById('todayPurchases').textContent = formatCurrency(todayPurchases);
    document.getElementById('monthlyRevenue').textContent = formatCurrency(monthlyRevenue);
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportDate = document.getElementById('reportDate').value;
    const sales = JSON.parse(localStorage.getItem('sales'));
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    
    let filteredSales, filteredPurchases;
    let reportTitle = '';
    
    switch(reportType) {
        case 'daily':
            filteredSales = sales.filter(sale => sale.date.startsWith(reportDate));
            filteredPurchases = purchases.filter(purchase => purchase.date.startsWith(reportDate));
            reportTitle = `Daily Report - ${reportDate}`;
            break;
        case 'monthly':
            const monthStart = reportDate.substring(0, 7);
            filteredSales = sales.filter(sale => sale.date.startsWith(monthStart));
            filteredPurchases = purchases.filter(purchase => purchase.date.startsWith(monthStart));
            reportTitle = `Monthly Report - ${monthStart}`;
            break;
        case 'yearly':
            const yearStart = reportDate.substring(0, 4);
            filteredSales = sales.filter(sale => sale.date.startsWith(yearStart));
            filteredPurchases = purchases.filter(purchase => purchase.date.startsWith(yearStart));
            reportTitle = `Yearly Report - ${yearStart}`;
            break;
    }
    
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalPurchases = filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const profit = totalSales - totalPurchases;
    
    // Store report data globally for PDF export
    window.currentReport = {
        title: reportTitle,
        data: [
            ['Total Sales', formatCurrency(totalSales)],
            ['Total Purchases', formatCurrency(totalPurchases)],
            ['Profit', formatCurrency(profit)]
        ],
        sales: filteredSales,
        purchases: filteredPurchases
    };
    
    const reportBody = document.getElementById('reportBody');
    reportBody.innerHTML = `
        <tr>
            <td>Total Sales</td>
            <td>${formatCurrency(totalSales)}</td>
        </tr>
        <tr>
            <td>Total Purchases</td>
            <td>${formatCurrency(totalPurchases)}</td>
        </tr>
        <tr>
            <td>Profit</td>
            <td>${formatCurrency(profit)}</td>
        </tr>
    `;
}

// Export report to PDF
function exportReport() {
    if (!window.currentReport) {
        alert('Please generate a report first!');
        return;
    }

    // Create PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(window.currentReport.title, 14, 20);
    
    // Add summary table
    doc.setFontSize(12);
    doc.autoTable({
        head: [['Category', 'Amount']],
        body: window.currentReport.data,
        startY: 30,
        margin: { top: 30 }
    });
    
    // Add detailed sales table
    const salesData = window.currentReport.sales.map(sale => [
        new Date(sale.date).toLocaleDateString(),
        sale.productName,
        `${sale.quantity} ${sale.unit}`,
        formatCurrency(sale.price),
        formatCurrency(sale.total)
    ]);
    
    if (salesData.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Sales Details', 14, 20);
        doc.autoTable({
            head: [['Date', 'Product', 'Quantity', 'Price', 'Total']],
            body: salesData,
            startY: 30,
            margin: { top: 30 }
        });
    }
    
    // Add detailed purchases table
    const purchasesData = window.currentReport.purchases.map(purchase => [
        new Date(purchase.date).toLocaleDateString(),
        purchase.supplierName,
        purchase.productName,
        `${purchase.quantity} ${purchase.unit}`,
        formatCurrency(purchase.price),
        formatCurrency(purchase.total)
    ]);
    
    if (purchasesData.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Purchase Details', 14, 20);
        doc.autoTable({
            head: [['Date', 'Supplier', 'Product', 'Quantity', 'Price', 'Total']],
            body: purchasesData,
            startY: 30,
            margin: { top: 30 }
        });
    }
    
    // Save the PDF
    const fileName = window.currentReport.title.toLowerCase().replace(/\s+/g, '_') + '.pdf';
    doc.save(fileName);
}

// Export to Excel
function exportToExcel() {
    if (!window.currentReport) {
        alert('Please generate a report first!');
        return;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add Summary worksheet
    const summaryData = [
        ['Category', 'Amount'],
        ...window.currentReport.data
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Add Sales worksheet if there are sales
    if (window.currentReport.sales.length > 0) {
        const salesData = [
            ['Date', 'Product', 'Quantity', 'Price', 'Total'],
            ...window.currentReport.sales.map(sale => [
                new Date(sale.date).toLocaleDateString(),
                sale.productName,
                `${sale.quantity} ${sale.unit}`,
                formatCurrency(sale.price).replace('৳', ''),
                formatCurrency(sale.total).replace('৳', '')
            ])
        ];
        const salesWs = XLSX.utils.aoa_to_sheet(salesData);
        XLSX.utils.book_append_sheet(wb, salesWs, 'Sales Details');
    }

    // Add Purchases worksheet if there are purchases
    if (window.currentReport.purchases.length > 0) {
        const purchasesData = [
            ['Date', 'Supplier', 'Product', 'Quantity', 'Price', 'Total'],
            ...window.currentReport.purchases.map(purchase => [
                new Date(purchase.date).toLocaleDateString(),
                purchase.supplierName,
                purchase.productName,
                `${purchase.quantity} ${purchase.unit}`,
                formatCurrency(purchase.price).replace('৳', ''),
                formatCurrency(purchase.total).replace('৳', '')
            ])
        ];
        const purchasesWs = XLSX.utils.aoa_to_sheet(purchasesData);
        XLSX.utils.book_append_sheet(wb, purchasesWs, 'Purchase Details');
    }

    // Set column widths for better readability
    const setColumnWidths = (ws) => {
        const cols = ws['!cols'] = [];
        cols[0] = { wch: 12 }; // Date
        cols[1] = { wch: 20 }; // Supplier
        cols[2] = { wch: 20 }; // Product
        cols[3] = { wch: 12 }; // Quantity
        cols[4] = { wch: 12 }; // Price
        cols[5] = { wch: 12 }; // Total
    };

    // Apply column widths to all worksheets
    wb.SheetNames.forEach(name => {
        setColumnWidths(wb.Sheets[name]);
    });

    // Generate Excel file name
    const fileName = window.currentReport.title.toLowerCase().replace(/\s+/g, '_') + '.xlsx';

    // Save the Excel file
    XLSX.writeFile(wb, fileName);
}

// Suppliers Management
document.getElementById('supplierForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const supplier = {
        id: Date.now(), // Unique ID for the supplier
        name: document.getElementById('supplierName').value,
        phone: document.getElementById('supplierPhone').value,
        address: document.getElementById('supplierAddress').value,
        dateAdded: new Date().toISOString()
    };
    
    const suppliers = JSON.parse(localStorage.getItem('suppliers'));
    suppliers.push(supplier);
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    
    this.reset();
    displaySuppliers();
});

// Display suppliers
function displaySuppliers(searchTerm = '') {
    const suppliers = JSON.parse(localStorage.getItem('suppliers'));
    const suppliersList = document.getElementById('suppliersList');
    
    // Filter suppliers based on search term
    const filteredSuppliers = suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    suppliersList.innerHTML = filteredSuppliers.map(supplier => `
        <div class="supplier-card">
            <div class="supplier-actions">
                <button class="edit" onclick="editSupplier(${supplier.id})">Edit</button>
                <button class="delete" onclick="deleteSupplier(${supplier.id})">Delete</button>
            </div>
            <h4>${supplier.name}</h4>
            <div class="supplier-info">Phone: ${supplier.phone}</div>
            <div class="supplier-info">Address: ${supplier.address}</div>
        </div>
    `).join('');
}

// Search suppliers
document.getElementById('supplierSearch').addEventListener('input', function(e) {
    displaySuppliers(e.target.value);
});

// Edit supplier
function editSupplier(id) {
    const suppliers = JSON.parse(localStorage.getItem('suppliers'));
    const supplier = suppliers.find(s => s.id === id);
    
    if (supplier) {
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('supplierPhone').value = supplier.phone;
        document.getElementById('supplierAddress').value = supplier.address;
        
        // Change form submit behavior temporarily
        const form = document.getElementById('supplierForm');
        form.onsubmit = function(e) {
            e.preventDefault();
            supplier.name = document.getElementById('supplierName').value;
            supplier.phone = document.getElementById('supplierPhone').value;
            supplier.address = document.getElementById('supplierAddress').value;
            
            localStorage.setItem('suppliers', JSON.stringify(suppliers));
            displaySuppliers();
            
            // Reset form and its submit behavior
            form.reset();
            form.onsubmit = null;
            document.getElementById('supplierForm').addEventListener('submit', function(e) {
                e.preventDefault();
                addSupplier();
            });
        };
    }
}

// Delete supplier
function deleteSupplier(id) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        const suppliers = JSON.parse(localStorage.getItem('suppliers'));
        const updatedSuppliers = suppliers.filter(s => s.id !== id);
        localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
        displaySuppliers();
    }
}

// Display sales history
function displaySalesHistory(searchTerm = '', startDate = null, endDate = null) {
    const sales = JSON.parse(localStorage.getItem('sales'));
    const historyList = document.getElementById('salesHistory');
    
    if (!startDate || !endDate) {
        historyList.innerHTML = '<div class="no-data">Please select a date range and click "View History"</div>';
        return;
    }
    
    // Filter sales based on date range and search term
    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        const matchesDate = saleDate >= startDate && saleDate <= endDate;
        const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDate && matchesSearch;
    });
    
    // Sort by date, newest first
    filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredSales.length === 0) {
        historyList.innerHTML = '<div class="no-data">No sales found for the selected date range</div>';
        return;
    }
    
    historyList.innerHTML = filteredSales.map(sale => `
        <div class="history-item" data-id="${sale.date}">
            <div class="actions">
                <button class="edit-btn" onclick="editSale('${sale.date}')">Edit</button>
                <button class="delete-btn" onclick="deleteSale('${sale.date}')">Delete</button>
            </div>
            <div class="item-details">
                <div>
                    <div class="detail-label">Date</div>
                    <div>${new Date(sale.date).toLocaleDateString()}</div>
                </div>
                <div>
                    <div class="detail-label">Product</div>
                    <div>${sale.productName}</div>
                </div>
                <div>
                    <div class="detail-label">Quantity</div>
                    <div>${sale.quantity} ${sale.unit}</div>
                </div>
                <div>
                    <div class="detail-label">Price</div>
                    <div>${formatCurrency(sale.price)}</div>
                </div>
                <div>
                    <div class="detail-label">Total</div>
                    <div>${formatCurrency(sale.total)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Display purchase history
function displayPurchaseHistory(searchTerm = '', startDate = null, endDate = null) {
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    const historyList = document.getElementById('purchaseHistory');
    
    if (!startDate || !endDate) {
        historyList.innerHTML = '<div class="no-data">Please select a date range and click "View History"</div>';
        return;
    }
    
    // Filter purchases based on date range and search term
    const filteredPurchases = purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        const matchesDate = purchaseDate >= startDate && purchaseDate <= endDate;
        const matchesSearch = 
            purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDate && matchesSearch;
    });
    
    // Sort by date, newest first
    filteredPurchases.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredPurchases.length === 0) {
        historyList.innerHTML = '<div class="no-data">No purchases found for the selected date range</div>';
        return;
    }
    
    historyList.innerHTML = filteredPurchases.map(purchase => `
        <div class="history-item" data-id="${purchase.date}">
            <div class="actions">
                <button class="edit-btn" onclick="editPurchase('${purchase.date}')">Edit</button>
                <button class="delete-btn" onclick="deletePurchase('${purchase.date}')">Delete</button>
            </div>
            <div class="item-details">
                <div>
                    <div class="detail-label">Date</div>
                    <div>${new Date(purchase.date).toLocaleDateString()}</div>
                </div>
                <div>
                    <div class="detail-label">Supplier</div>
                    <div>${purchase.supplierName}</div>
                </div>
                <div>
                    <div class="detail-label">Product</div>
                    <div>${purchase.productName}</div>
                </div>
                <div>
                    <div class="detail-label">Quantity</div>
                    <div>${purchase.quantity} ${purchase.unit}</div>
                </div>
                <div>
                    <div class="detail-label">Price</div>
                    <div>${formatCurrency(purchase.price)}</div>
                </div>
                <div>
                    <div class="detail-label">Total</div>
                    <div>${formatCurrency(purchase.total)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// View sales history
function viewSalesHistory() {
    const startDate = new Date(document.getElementById('salesStartDate').value);
    const endDate = new Date(document.getElementById('salesEndDate').value);
    endDate.setHours(23, 59, 59, 999); // Include the entire end date
    
    if (startDate > endDate) {
        alert('Start date must be before or equal to end date');
        return;
    }
    
    displaySalesHistory(document.getElementById('salesSearch').value, startDate, endDate);
}

// View purchase history
function viewPurchaseHistory() {
    const startDate = new Date(document.getElementById('purchaseStartDate').value);
    const endDate = new Date(document.getElementById('purchaseEndDate').value);
    endDate.setHours(23, 59, 59, 999); // Include the entire end date
    
    if (startDate > endDate) {
        alert('Start date must be before or equal to end date');
        return;
    }
    
    displayPurchaseHistory(document.getElementById('purchaseSearch').value, startDate, endDate);
}

// Search event listeners
document.getElementById('salesSearch').addEventListener('input', function(e) {
    const startDate = new Date(document.getElementById('salesStartDate').value);
    const endDate = new Date(document.getElementById('salesEndDate').value);
    endDate.setHours(23, 59, 59, 999);
    displaySalesHistory(e.target.value, startDate, endDate);
});

document.getElementById('purchaseSearch').addEventListener('input', function(e) {
    const startDate = new Date(document.getElementById('purchaseStartDate').value);
    const endDate = new Date(document.getElementById('purchaseEndDate').value);
    endDate.setHours(23, 59, 59, 999);
    displayPurchaseHistory(e.target.value, startDate, endDate);
});

// Edit sale
function editSale(date) {
    const sales = JSON.parse(localStorage.getItem('sales'));
    const sale = sales.find(s => s.date === date);
    
    if (sale) {
        document.getElementById('saleDate').value = sale.date.split('T')[0];
        document.getElementById('productName').value = sale.productName;
        document.getElementById('quantity').value = sale.quantity;
        document.getElementById('unit').value = sale.unit;
        document.getElementById('price').value = sale.price;
        
        // Change form submit behavior temporarily
        const form = document.getElementById('salesForm');
        form.onsubmit = function(e) {
            e.preventDefault();
            
            // Remove old sale
            const index = sales.findIndex(s => s.date === date);
            sales.splice(index, 1);
            
            // Add updated sale
            const updatedSale = {
                productName: document.getElementById('productName').value,
                quantity: parseFloat(document.getElementById('quantity').value),
                unit: document.getElementById('unit').value,
                price: parseFloat(document.getElementById('price').value),
                total: parseFloat(document.getElementById('quantity').value) * parseFloat(document.getElementById('price').value),
                date: new Date(document.getElementById('saleDate').value).toISOString()
            };
            
            sales.push(updatedSale);
            localStorage.setItem('sales', JSON.stringify(sales));
            
            // Reset form and its submit behavior
            form.reset();
            setDefaultDate('saleDate');
            form.onsubmit = null;
            
            // Re-add the original submit event listener
            document.getElementById('salesForm').addEventListener('submit', function(e) {
                e.preventDefault();
                addSale();
            });
            
            displaySalesHistory();
            updateDashboard();
        };
    }
}

// Edit purchase
function editPurchase(date) {
    const purchases = JSON.parse(localStorage.getItem('purchases'));
    const purchase = purchases.find(p => p.date === date);
    
    if (purchase) {
        document.getElementById('purchaseDate').value = purchase.date.split('T')[0];
        document.getElementById('supplier').value = purchase.supplierId;
        document.getElementById('purchaseProduct').value = purchase.productName;
        document.getElementById('purchaseQuantity').value = purchase.quantity;
        document.getElementById('purchaseUnit').value = purchase.unit;
        document.getElementById('purchasePrice').value = purchase.price;
        
        // Change form submit behavior temporarily
        const form = document.getElementById('purchaseForm');
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const supplierId = document.getElementById('supplier').value;
            const suppliers = JSON.parse(localStorage.getItem('suppliers'));
            const supplier = suppliers.find(s => s.id === parseInt(supplierId));
            
            if (!supplier) {
                alert('Please select a valid supplier');
                return;
            }
            
            // Remove old purchase
            const index = purchases.findIndex(p => p.date === date);
            purchases.splice(index, 1);
            
            // Add updated purchase
            const updatedPurchase = {
                supplierId: supplier.id,
                supplierName: supplier.name,
                productName: document.getElementById('purchaseProduct').value,
                quantity: parseFloat(document.getElementById('purchaseQuantity').value),
                unit: document.getElementById('purchaseUnit').value,
                price: parseFloat(document.getElementById('purchasePrice').value),
                total: parseFloat(document.getElementById('purchaseQuantity').value) * parseFloat(document.getElementById('purchasePrice').value),
                date: new Date(document.getElementById('purchaseDate').value).toISOString()
            };
            
            purchases.push(updatedPurchase);
            localStorage.setItem('purchases', JSON.stringify(purchases));
            
            // Reset form and its submit behavior
            form.reset();
            setDefaultDate('purchaseDate');
            form.onsubmit = null;
            
            // Re-add the original submit event listener
            document.getElementById('purchaseForm').addEventListener('submit', function(e) {
                e.preventDefault();
                addPurchase();
            });
            
            displayPurchaseHistory();
            updateDashboard();
        };
    }
}

// Delete sale
function deleteSale(date) {
    if (confirm('Are you sure you want to delete this sale?')) {
        const sales = JSON.parse(localStorage.getItem('sales'));
        const updatedSales = sales.filter(s => s.date !== date);
        localStorage.setItem('sales', JSON.stringify(updatedSales));
        displaySalesHistory();
        updateDashboard();
    }
}

// Delete purchase
function deletePurchase(date) {
    if (confirm('Are you sure you want to delete this purchase?')) {
        const purchases = JSON.parse(localStorage.getItem('purchases'));
        const updatedPurchases = purchases.filter(p => p.date !== date);
        localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
        displayPurchaseHistory();
        updateDashboard();
    }
}

// Dark mode functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme and checkbox state
    document.documentElement.setAttribute('data-theme', currentTheme);
    darkModeToggle.checked = currentTheme === 'dark';
    
    // Toggle theme
    darkModeToggle.addEventListener('change', () => {
        const newTheme = darkModeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            darkModeToggle.checked = e.matches;
        }
    });
}

// Initialize dark mode when DOM is loaded
document.addEventListener('DOMContentLoaded', initDarkMode);

// Initialize suppliers display
displaySuppliers();

// Initialize dashboard on load
updateDashboard();
