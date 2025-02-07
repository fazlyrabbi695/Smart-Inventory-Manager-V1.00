document.addEventListener('DOMContentLoaded', () => {
    const purchaseForm = document.getElementById('purchaseForm');
    const supplierSelect = document.getElementById('supplierId');
    const purchasesTableBody = document.getElementById('purchasesTableBody');

    // Populate supplier dropdown
    function populateSuppliers() {
        const data = DataStore.getData();
        supplierSelect.innerHTML = '<option value="">Select a supplier</option>';
        
        data.suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    }

    // Display recent purchases
    function displayPurchases() {
        const data = DataStore.getData();
        purchasesTableBody.innerHTML = '';
        
        // Get last 10 purchases, sorted by date (newest first)
        const recentPurchases = [...data.purchases]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        recentPurchases.forEach(purchase => {
            const supplier = data.suppliers.find(s => s.id === purchase.supplierId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(purchase.date)}</td>
                <td>${supplier ? supplier.name : 'Unknown Supplier'}</td>
                <td>${purchase.productName}</td>
                <td>${purchase.quantity} ${purchase.unit}</td>
                <td>${formatCurrency(purchase.price)}</td>
                <td>${formatCurrency(purchase.total)}</td>
            `;
            purchasesTableBody.appendChild(row);
        });
    }

    // Handle form submission
    purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const supplierId = supplierSelect.value;
        const productName = document.getElementById('productName').value;
        const quantity = Number(document.getElementById('quantity').value);
        const price = Number(document.getElementById('price').value);
        const unit = document.getElementById('unit').value;

        try {
            // Add purchase
            DataStore.addPurchase(supplierId, productName, quantity, price, unit);
            
            // Reset form and update displays
            purchaseForm.reset();
            displayPurchases();
            updateDashboard();

            // Show success message
            alert('Purchase added successfully!');
        } catch (error) {
            alert(error.message);
        }
    });

    // Initialize
    populateSuppliers();
    displayPurchases();
});
