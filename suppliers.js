document.addEventListener('DOMContentLoaded', () => {
    const supplierForm = document.getElementById('supplierForm');
    const suppliersTableBody = document.getElementById('suppliersTableBody');
    const searchInput = document.getElementById('searchSupplier');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const editSupplierId = document.getElementById('editSupplierId');
    const modal = document.getElementById('supplierModal');
    const modalClose = modal.querySelector('.close');

    // Add supplier management methods to DataStore
    Object.assign(DataStore, {
        addSupplier(supplierData) {
            const data = this.getData();
            const existingSupplier = data.suppliers.find(
                s => s.phone === supplierData.phone || 
                    (supplierData.email && s.email === supplierData.email)
            );

            if (existingSupplier) {
                throw new Error('A supplier with this phone number or email already exists');
            }

            const supplier = {
                id: 'SUP' + Date.now(),
                ...supplierData,
                createdAt: new Date().toISOString()
            };

            data.suppliers.push(supplier);
            this.saveData(data);
            return supplier;
        },

        updateSupplier(id, supplierData) {
            const data = this.getData();
            const index = data.suppliers.findIndex(s => s.id === id);
            
            if (index === -1) {
                throw new Error('Supplier not found');
            }

            // Check for duplicate phone/email with other suppliers
            const existingSupplier = data.suppliers.find(
                s => s.id !== id && (
                    s.phone === supplierData.phone || 
                    (supplierData.email && s.email === supplierData.email)
                )
            );

            if (existingSupplier) {
                throw new Error('Another supplier with this phone number or email already exists');
            }

            data.suppliers[index] = {
                ...data.suppliers[index],
                ...supplierData,
                updatedAt: new Date().toISOString()
            };

            this.saveData(data);
            return data.suppliers[index];
        },

        deleteSupplier(id) {
            const data = this.getData();
            const index = data.suppliers.findIndex(s => s.id === id);
            
            if (index === -1) {
                throw new Error('Supplier not found');
            }

            // Check if supplier has any purchases
            const hasPurchases = data.purchases.some(p => p.supplierId === id);
            if (hasPurchases) {
                throw new Error('Cannot delete supplier with existing purchases');
            }

            data.suppliers.splice(index, 1);
            this.saveData(data);
        },

        getSupplierDetails(id) {
            const data = this.getData();
            const supplier = data.suppliers.find(s => s.id === id);
            
            if (!supplier) return null;

            const purchases = data.purchases.filter(p => p.supplierId === id);
            const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0);
            const purchaseCount = purchases.length;

            return {
                ...supplier,
                statistics: {
                    totalPurchases,
                    purchaseCount,
                    averagePurchase: purchaseCount ? totalPurchases / purchaseCount : 0,
                    lastPurchase: purchases.length ? 
                        purchases.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null
                },
                recentPurchases: purchases
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
            };
        }
    });

    // Display suppliers
    function displaySuppliers(searchTerm = '') {
        const data = DataStore.getData();
        suppliersTableBody.innerHTML = '';
        
        const filteredSuppliers = data.suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.phone.includes(searchTerm)
        );

        filteredSuppliers.forEach(supplier => {
            const purchases = data.purchases.filter(p => p.supplierId === supplier.id);
            const totalPurchases = purchases.reduce((sum, p) => sum + p.total, 0);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <a href="#" onclick="showSupplierDetails('${supplier.id}'); return false;">
                        ${supplier.name}
                    </a>
                </td>
                <td>${supplier.contactPerson}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.email || '-'}</td>
                <td>${formatCurrency(totalPurchases)}</td>
                <td>
                    <button class="btn" onclick="editSupplier('${supplier.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteSupplier('${supplier.id}')">Delete</button>
                </td>
            `;
            suppliersTableBody.appendChild(row);
        });
    }

    // Handle form submission
    supplierForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const supplierData = {
            name: document.getElementById('supplierName').value,
            contactPerson: document.getElementById('contactPerson').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value || null,
            address: document.getElementById('address').value,
            notes: document.getElementById('notes').value || null
        };

        try {
            if (editSupplierId.value) {
                // Update existing supplier
                DataStore.updateSupplier(editSupplierId.value, supplierData);
                editSupplierId.value = '';
                submitBtn.textContent = 'Add Supplier';
                cancelBtn.style.display = 'none';
            } else {
                // Add new supplier
                DataStore.addSupplier(supplierData);
            }
            
            supplierForm.reset();
            displaySuppliers();
        } catch (error) {
            alert(error.message);
        }
    });

    // Handle search
    searchInput.addEventListener('input', (e) => {
        displaySuppliers(e.target.value);
    });

    // Handle cancel edit
    cancelBtn.addEventListener('click', () => {
        editSupplierId.value = '';
        supplierForm.reset();
        submitBtn.textContent = 'Add Supplier';
        cancelBtn.style.display = 'none';
    });

    // Handle modal close
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initialize
    displaySuppliers();
});

// Edit supplier (called from table)
function editSupplier(id) {
    const data = DataStore.getData();
    const supplier = data.suppliers.find(s => s.id === id);
    
    if (!supplier) return;

    document.getElementById('editSupplierId').value = id;
    document.getElementById('supplierName').value = supplier.name;
    document.getElementById('contactPerson').value = supplier.contactPerson;
    document.getElementById('phone').value = supplier.phone;
    document.getElementById('email').value = supplier.email || '';
    document.getElementById('address').value = supplier.address;
    document.getElementById('notes').value = supplier.notes || '';
    
    document.getElementById('submitBtn').textContent = 'Update Supplier';
    document.getElementById('cancelBtn').style.display = 'inline-block';
}

// Delete supplier (called from table)
function deleteSupplier(id) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
        DataStore.deleteSupplier(id);
        displaySuppliers();
    } catch (error) {
        alert(error.message);
    }
}

// Show supplier details (called from table)
function showSupplierDetails(id) {
    const supplier = DataStore.getSupplierDetails(id);
    if (!supplier) return;

    const detailsHtml = `
        <div class="supplier-details">
            <h4>${supplier.name}</h4>
            <p><strong>Contact Person:</strong> ${supplier.contactPerson}</p>
            <p><strong>Phone:</strong> ${supplier.phone}</p>
            <p><strong>Email:</strong> ${supplier.email || '-'}</p>
            <p><strong>Address:</strong> ${supplier.address}</p>
            ${supplier.notes ? `<p><strong>Notes:</strong> ${supplier.notes}</p>` : ''}
            
            <h4>Statistics</h4>
            <p><strong>Total Purchases:</strong> ${formatCurrency(supplier.statistics.totalPurchases)}</p>
            <p><strong>Number of Purchases:</strong> ${supplier.statistics.purchaseCount}</p>
            <p><strong>Average Purchase:</strong> ${formatCurrency(supplier.statistics.averagePurchase)}</p>
            ${supplier.statistics.lastPurchase ? 
                `<p><strong>Last Purchase:</strong> ${formatDate(supplier.statistics.lastPurchase.date)}</p>` : 
                ''
            }
            
            ${supplier.recentPurchases.length ? `
                <h4>Recent Purchases</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${supplier.recentPurchases.map(purchase => `
                            <tr>
                                <td>${formatDate(purchase.date)}</td>
                                <td>${purchase.productName}</td>
                                <td>${purchase.quantity} ${purchase.unit}</td>
                                <td>${formatCurrency(purchase.total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : ''}
        </div>
    `;

    document.getElementById('supplierDetails').innerHTML = detailsHtml;
    document.getElementById('supplierModal').style.display = 'block';
}
