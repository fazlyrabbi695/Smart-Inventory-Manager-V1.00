// Data Management System
const DataStore = {
    // Initialize data structure
    init() {
        if (!localStorage.getItem('ftc_data')) {
            const initialData = {
                sales: [],
                purchases: [],
                stock: [],
                suppliers: [],
                lastUpdate: new Date().toISOString()
            };
            localStorage.setItem('ftc_data', JSON.stringify(initialData));
        }
    },

    // Get all data
    getData() {
        return JSON.parse(localStorage.getItem('ftc_data'));
    },

    // Save data
    saveData(data) {
        data.lastUpdate = new Date().toISOString();
        localStorage.setItem('ftc_data', JSON.stringify(data));
    },

    // Sales Management
    addSale(productId, quantity, price, unit) {
        const data = this.getData();
        const product = data.stock.find(item => item.id === productId);
        
        if (!product) {
            throw new Error('Product not found');
        }

        // Validate inputs
        if (!quantity || !price || !unit) {
            throw new Error('All fields are required');
        }

        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        if (price <= 0) {
            throw new Error('Price must be greater than 0');
        }

        // Check if units are compatible
        const compatibleUnits = UnitConversion.getCompatibleUnits(product.unit);
        if (!compatibleUnits.includes(unit)) {
            throw new Error(`Invalid unit. Please use one of: ${compatibleUnits.join(', ')}`);
        }

        // Convert quantity to product's unit for stock update
        const convertedQuantity = UnitConversion.convert(quantity, unit, product.unit);
        
        if (convertedQuantity > product.quantity) {
            throw new Error(`Insufficient stock. Only ${product.quantity} ${product.unit} available.`);
        }

        const sale = {
            id: 'SALE' + Date.now(),
            productId,
            productName: product.name,
            quantity,
            unit,
            price,
            total: quantity * price,
            date: new Date().toISOString()
        };

        // Update stock with converted quantity
        product.quantity = parseFloat((product.quantity - convertedQuantity).toFixed(3));
        product.lastUpdated = new Date().toISOString();

        data.sales.push(sale);
        this.saveData(data);
        return sale;
    },

    // Purchase Management
    addPurchase(supplierId, productName, quantity, price, unit) {
        const data = this.getData();
        
        // Validate supplier
        const supplier = this.getSupplier(supplierId);
        if (!supplier) {
            throw new Error('Invalid supplier selected');
        }

        // Validate inputs
        if (!productName || !quantity || !price || !unit) {
            throw new Error('All fields are required');
        }

        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        if (price <= 0) {
            throw new Error('Price must be greater than 0');
        }

        const purchase = {
            id: 'PUR' + Date.now(),
            supplierId,
            supplierName: supplier.name,
            productName: productName.trim(),
            quantity,
            price,
            total: quantity * price,
            unit,
            date: new Date().toISOString()
        };

        // Update or create stock
        let stockItem = data.stock.find(item => 
            item.name.toLowerCase() === productName.toLowerCase() && 
            item.unit === unit
        );

        if (stockItem) {
            stockItem.quantity = parseFloat(stockItem.quantity) + parseFloat(quantity);
            stockItem.lastUpdated = new Date().toISOString();
        } else {
            stockItem = {
                id: 'PROD' + Date.now(),
                name: productName.trim(),
                quantity: parseFloat(quantity),
                unit,
                dateAdded: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            data.stock.push(stockItem);
        }

        data.purchases.push(purchase);
        this.saveData(data);
        return purchase;
    },

    // Get purchase history
    getPurchases(startDate = null, endDate = null) {
        const data = this.getData();
        let purchases = data.purchases;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59);

            purchases = purchases.filter(purchase => {
                const purchaseDate = new Date(purchase.date);
                return purchaseDate >= start && purchaseDate <= end;
            });
        } else {
            // Show only last 10 purchases if no date filter
            purchases = purchases.slice(-10);
        }

        // Sort by date, newest first
        return purchases.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // Supplier Management
    addSupplier(supplierData) {
        const data = this.getData();
        const newSupplier = {
            id: 'SUP' + Date.now(),
            name: supplierData.name,
            phone: supplierData.phone,
            address: supplierData.address,
            dateAdded: new Date().toISOString()
        };
        
        data.suppliers.push(newSupplier);
        this.saveData(data);
        return newSupplier;
    },

    updateSupplier(supplierId, supplierData) {
        const data = this.getData();
        const index = data.suppliers.findIndex(s => s.id === supplierId);
        
        if (index === -1) {
            throw new Error('Supplier not found');
        }

        data.suppliers[index] = {
            ...data.suppliers[index],
            name: supplierData.name,
            phone: supplierData.phone,
            address: supplierData.address,
            lastUpdated: new Date().toISOString()
        };
        
        this.saveData(data);
        return data.suppliers[index];
    },

    deleteSupplier(supplierId) {
        const data = this.getData();
        const supplierExists = data.suppliers.some(s => s.id === supplierId);
        
        if (!supplierExists) {
            throw new Error('Supplier not found');
        }

        // Check if supplier has any associated purchases
        const hasAssociatedPurchases = data.purchases.some(p => p.supplierId === supplierId);
        if (hasAssociatedPurchases) {
            throw new Error('Cannot delete supplier with associated purchases');
        }

        data.suppliers = data.suppliers.filter(s => s.id !== supplierId);
        this.saveData(data);
    },

    getSupplier(supplierId) {
        const supplier = this.getData().suppliers.find(s => s.id === supplierId);
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return supplier;
    },

    // Reports
    getReports() {
        const data = this.getData();
        
        // Get today's date in local timezone
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Calculate today's sales
        const todaySales = data.sales
            .filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate >= today && saleDate < tomorrow;
            })
            .reduce((sum, sale) => sum + sale.total, 0);

        // Calculate today's purchases
        const todayPurchases = data.purchases
            .filter(purchase => {
                const purchaseDate = new Date(purchase.date);
                return purchaseDate >= today && purchaseDate < tomorrow;
            })
            .reduce((sum, purchase) => sum + purchase.total, 0);

        // Calculate monthly totals
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        // Get all monthly sales
        const monthlySales = data.sales
            .filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate >= firstDayOfMonth && saleDate <= lastDayOfMonth;
            });

        // Calculate total monthly sales amount
        const monthlySalesTotal = monthlySales.reduce((sum, sale) => sum + sale.total, 0);

        // Get all monthly purchases
        const monthlyPurchases = data.purchases
            .filter(purchase => {
                const purchaseDate = new Date(purchase.date);
                return purchaseDate >= firstDayOfMonth && purchaseDate <= lastDayOfMonth;
            });

        // Calculate total monthly purchases amount
        const monthlyPurchasesTotal = monthlyPurchases.reduce((sum, purchase) => sum + purchase.total, 0);

        // Calculate monthly revenue (profit)
        const monthlyRevenue = monthlySalesTotal - monthlyPurchasesTotal;

        // Calculate daily profit
        const todayProfit = todaySales - todayPurchases;

        // Calculate inventory status
        const activeProducts = data.stock.filter(item => item.quantity > 0);
        const lowStockItems = data.stock.filter(item => {
            // If minStock is set, use it as threshold
            if (item.minStock !== undefined && item.minStock !== null) {
                return item.quantity <= item.minStock;
            }
            // Otherwise use default threshold based on unit type
            const unit = item.unit.toLowerCase();
            let threshold;
            if (unit === 'kg' || unit === 'kilogram') {
                threshold = 5; // 5 kg
            } else if (unit === 'g' || unit === 'gram') {
                threshold = 500; // 500 grams
            } else if (unit === 'l' || unit === 'liter') {
                threshold = 5; // 5 liters
            } else if (unit === 'ml' || unit === 'milliliter') {
                threshold = 500; // 500 ml
            } else if (unit === 'pcs' || unit === 'piece') {
                threshold = 10; // 10 pieces
            } else {
                threshold = 10; // default threshold
            }
            return item.quantity <= threshold;
        });

        // Get out of stock items
        const outOfStockItems = data.stock.filter(item => item.quantity <= 0);

        return {
            todaySales,
            todayPurchases,
            todayProfit,
            monthlyRevenue,
            totalProducts: activeProducts.length,
            totalItems: data.stock.length,
            activeProducts: activeProducts.length,
            outOfStock: outOfStockItems.length,
            lowStock: lowStockItems,
            totalSuppliers: data.suppliers.length
        };
    }
};

// Add stock helper methods to DataStore
Object.assign(DataStore, {
    // Get stock status
    getStockStatus(id) {
        const data = this.getData();
        const item = data.stock.find(item => item.id === id);
        
        if (!item) return null;
        
        return {
            ...item,
            isLow: item.quantity <= (item.minStock || 0),
            transactions: {
                sales: data.sales.filter(sale => sale.productId === id),
                purchases: data.purchases.filter(purchase => 
                    purchase.productName.toLowerCase() === item.name.toLowerCase()
                )
            }
        };
    },

    // Get low stock items
    getLowStockItems() {
        const data = this.getData();
        return data.stock.filter(item => item.quantity <= (item.minStock || 0));
    }
});

// Unit conversion helpers
const UnitConversion = {
    // Mass conversions
    massConversions: {
        kg: 1000,    // base unit: grams
        g: 1,
        lb: 453.592,
        oz: 28.3495
    },

    // Volume conversions
    volumeConversions: {
        L: 1000,     // base unit: milliliters
        mL: 1,
        gal: 3785.41,
        qt: 946.353,
        pt: 473.176,
        cup: 236.588
    },

    // Length conversions
    lengthConversions: {
        m: 100,      // base unit: centimeters
        cm: 1,
        ft: 30.48,
        in: 2.54
    },

    // Quantity conversions (direct conversion factors to pieces)
    quantityConversions: {
        pc: 1,       // base unit: pieces
        dz: 12,      // 1 dozen = 12 pieces
        box: 1,      // variable, treat as 1:1
        crate: 1,    // variable, treat as 1:1
        bundle: 1,   // variable, treat as 1:1
        bag: 1       // variable, treat as 1:1
    },

    // Convert between units of the same type
    convert(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;

        // First, determine the type of units
        const unitTypes = {
            mass: Object.keys(this.massConversions),
            volume: Object.keys(this.volumeConversions),
            length: Object.keys(this.lengthConversions),
            quantity: Object.keys(this.quantityConversions)
        };

        let unitType = null;
        for (const [type, units] of Object.entries(unitTypes)) {
            if (units.includes(fromUnit) && units.includes(toUnit)) {
                unitType = type;
                break;
            }
        }

        if (!unitType) {
            throw new Error(`Cannot convert between ${fromUnit} and ${toUnit}. They are different types of units.`);
        }

        const conversions = this[unitType + 'Conversions'];
        if (!conversions[fromUnit] || !conversions[toUnit]) {
            throw new Error(`Unknown unit conversion between ${fromUnit} and ${toUnit}`);
        }

        // Convert to base unit, then to target unit
        const baseValue = value * conversions[fromUnit];
        return parseFloat((baseValue / conversions[toUnit]).toFixed(3));
    },

    // Format the unit for display
    formatUnit(value, unit) {
        if (unit === 'pc' && value !== 1) return 'pcs';
        return unit;
    },

    // Get compatible units for a given unit
    getCompatibleUnits(unit) {
        for (const [type, units] of Object.entries({
            mass: Object.keys(this.massConversions),
            volume: Object.keys(this.volumeConversions),
            length: Object.keys(this.lengthConversions),
            quantity: Object.keys(this.quantityConversions)
        })) {
            if (units.includes(unit)) {
                return units;
            }
        }
        return [];
    }
};

// Add unit conversion to DataStore
Object.assign(DataStore, {
    // Convert quantity between units when adding to stock
    addToStock(productId, quantity, fromUnit, toUnit) {
        const data = this.getData();
        const product = data.stock.find(item => item.id === productId);
        
        if (!product) {
            throw new Error('Product not found');
        }

        try {
            const convertedQuantity = UnitConversion.convert(quantity, fromUnit, toUnit);
            product.quantity += convertedQuantity;
            this.saveData(data);
        } catch (error) {
            throw new Error(`Unit conversion error: ${error.message}`);
        }
    }
});

// Format currency function
function formatCurrency(amount) {
    return new Intl.NumberFormat('bn-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format date function
function formatDate(dateString) {
    return new Date(dateString).toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update dashboard values
function updateDashboard() {
    const reports = DataStore.getReports();
    
    // Update summary values
    document.getElementById('todaySales').textContent = formatCurrency(reports.todaySales);
    document.getElementById('todayPurchases').textContent = formatCurrency(reports.todayPurchases);
    document.getElementById('todayProfit').textContent = formatCurrency(reports.todayProfit);
    document.getElementById('monthlyRevenue').textContent = formatCurrency(reports.monthlyRevenue);
    
    // Update inventory status
    document.getElementById('activeProducts').textContent = reports.activeProducts;
    document.getElementById('lowStockItems').textContent = reports.lowStock.length;
    document.getElementById('outOfStock').textContent = reports.outOfStock;
    document.getElementById('totalSuppliers').textContent = reports.totalSuppliers;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    DataStore.init();
    updateDashboard();
});

// Supplier form handling
document.getElementById('supplierForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const supplierData = {
        name: document.getElementById('supplierName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    const editId = document.getElementById('editSupplierId').value;

    if (editId) {
        // Update existing supplier
        DataStore.updateSupplier(editId, supplierData);
    } else {
        // Add new supplier
        DataStore.addSupplier(supplierData);
    }

    // Reset form
    this.reset();
    document.getElementById('editSupplierId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Supplier';
    document.getElementById('cancelBtn').style.display = 'none';

    // Refresh suppliers list
    displaySuppliers();
});

// Cancel edit button
document.getElementById('cancelBtn')?.addEventListener('click', function() {
    const form = document.getElementById('supplierForm');
    form.reset();
    document.getElementById('editSupplierId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Supplier';
    this.style.display = 'none';
});

// Display suppliers
function displaySuppliers(startDate = null, endDate = null) {
    const tableBody = document.getElementById('suppliersTableBody');
    if (!tableBody) return; // Only run on suppliers page
    
    let suppliers = DataStore.getData().suppliers;
    const purchases = DataStore.getData().purchases;
    
    // Apply date filter if provided
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        
        suppliers = suppliers.filter(supplier => {
            const addedDate = new Date(supplier.dateAdded);
            return addedDate >= start && addedDate <= end;
        });
    } else {
        // Show only last 10 suppliers if no date filter
        suppliers = suppliers.slice(-10);
    }
    
    // Sort by added date, newest first
    suppliers.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    if (suppliers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No suppliers found</td></tr>';
        return;
    }

    tableBody.innerHTML = suppliers.map(supplier => {
        // Find the last purchase for this supplier
        const supplierPurchases = purchases.filter(p => p.supplierId === supplier.id);
        const lastPurchase = supplierPurchases.length > 0 
            ? formatDate(Math.max(...supplierPurchases.map(p => new Date(p.date))))
            : 'No purchases';
        
        return `
            <tr>
                <td>${supplier.name}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.address}</td>
                <td>${formatDate(supplier.dateAdded)}</td>
                <td>${lastPurchase}</td>
                <td>
                    <button onclick="editSupplier('${supplier.id}')" class="btn btn-small">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteSupplier('${supplier.id}')" class="btn btn-small btn-danger">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Edit supplier
function editSupplier(supplierId) {
    try {
        const supplier = DataStore.getSupplier(supplierId);
        
        document.getElementById('editSupplierId').value = supplier.id;
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('phone').value = supplier.phone;
        document.getElementById('address').value = supplier.address;
        
        document.getElementById('submitBtn').textContent = 'Update Supplier';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    } catch (error) {
        alert(error.message);
    }
}

// Delete supplier
function deleteSupplier(supplierId) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        try {
            DataStore.deleteSupplier(supplierId);
            displaySuppliers();
        } catch (error) {
            alert(error.message);
        }
    }
}
