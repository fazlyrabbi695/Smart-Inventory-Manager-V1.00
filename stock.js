document.addEventListener('DOMContentLoaded', () => {
    const stockForm = document.getElementById('stockForm');
    const stockTableBody = document.getElementById('stockTableBody');
    const searchInput = document.getElementById('searchStock');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const editItemId = document.getElementById('editItemId');

    // Add stock management methods to DataStore
    Object.assign(DataStore, {
        addStockItem(name, quantity, unit, minStock) {
            const data = this.getData();
            const existingItem = data.stock.find(
                item => item.name.toLowerCase() === name.toLowerCase() && item.unit === unit
            );

            if (existingItem) {
                throw new Error('A product with this name and unit already exists');
            }

            const stockItem = {
                id: 'PROD' + Date.now(),
                name,
                quantity: Number(quantity),
                unit,
                minStock: Number(minStock)
            };

            data.stock.push(stockItem);
            this.saveData(data);
            return stockItem;
        },

        updateStockItem(id, name, quantity, unit, minStock) {
            const data = this.getData();
            const item = data.stock.find(item => item.id === id);
            
            if (!item) {
                throw new Error('Stock item not found');
            }

            // Check if name and unit combination already exists for other items
            const existingItem = data.stock.find(
                item => item.id !== id && 
                item.name.toLowerCase() === name.toLowerCase() && 
                item.unit === unit
            );

            if (existingItem) {
                throw new Error('Another product with this name and unit already exists');
            }

            item.name = name;
            item.quantity = Number(quantity);
            item.unit = unit;
            item.minStock = Number(minStock);

            this.saveData(data);
            return item;
        },

        deleteStockItem(id) {
            const data = this.getData();
            const index = data.stock.findIndex(item => item.id === id);
            
            if (index === -1) {
                throw new Error('Stock item not found');
            }

            // Check if item has been used in sales or purchases
            const usedInSales = data.sales.some(sale => sale.productId === id);
            const usedInPurchases = data.purchases.some(purchase => 
                purchase.productName.toLowerCase() === data.stock[index].name.toLowerCase()
            );

            if (usedInSales || usedInPurchases) {
                throw new Error('Cannot delete item that has been used in transactions');
            }

            data.stock.splice(index, 1);
            this.saveData(data);
        }
    });

    // Display stock items
    function displayStock(searchTerm = '') {
        const data = DataStore.getData();
        stockTableBody.innerHTML = '';
        
        const filteredStock = data.stock.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredStock.forEach(item => {
            const row = document.createElement('tr');
            const status = item.quantity <= item.minStock ? 'status-low' : 'status-ok';
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity} ${item.unit}</td>
                <td>${item.unit}</td>
                <td>
                    <span class="status ${status}">
                        ${item.quantity <= item.minStock ? 'Low Stock' : 'In Stock'}
                    </span>
                </td>
                <td>
                    <button class="btn" onclick="editStock('${item.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteStock('${item.id}')">Delete</button>
                </td>
            `;
            stockTableBody.appendChild(row);
        });
    }

    // Handle form submission
    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('productName').value;
        const quantity = document.getElementById('quantity').value;
        const unit = document.getElementById('unit').value;
        const minStock = document.getElementById('minStock').value;

        try {
            if (editItemId.value) {
                // Update existing item
                DataStore.updateStockItem(editItemId.value, name, quantity, unit, minStock);
                editItemId.value = '';
                submitBtn.textContent = 'Add Stock Item';
                cancelBtn.style.display = 'none';
            } else {
                // Add new item
                DataStore.addStockItem(name, quantity, unit, minStock);
            }
            
            stockForm.reset();
            displayStock();
            updateDashboard();
        } catch (error) {
            alert(error.message);
        }
    });

    // Handle search
    searchInput.addEventListener('input', (e) => {
        displayStock(e.target.value);
    });

    // Handle cancel edit
    cancelBtn.addEventListener('click', () => {
        editItemId.value = '';
        stockForm.reset();
        submitBtn.textContent = 'Add Stock Item';
        cancelBtn.style.display = 'none';
    });

    // Initialize
    displayStock();
});

// Edit stock item (called from table)
function editStock(id) {
    const data = DataStore.getData();
    const item = data.stock.find(item => item.id === id);
    
    if (!item) return;

    document.getElementById('editItemId').value = id;
    document.getElementById('productName').value = item.name;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('unit').value = item.unit;
    document.getElementById('minStock').value = item.minStock || 0;
    
    document.getElementById('submitBtn').textContent = 'Update Stock Item';
    document.getElementById('cancelBtn').style.display = 'inline-block';
}

// Delete stock item (called from table)
function deleteStock(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        DataStore.deleteStockItem(id);
        displayStock();
        updateDashboard();
    } catch (error) {
        alert(error.message);
    }
}
