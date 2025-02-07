document.addEventListener('DOMContentLoaded', () => {
    const saleForm = document.getElementById('saleForm');
    const productSelect = document.getElementById('productId');
    const salesTableBody = document.getElementById('salesTableBody');
    const quantityInput = document.getElementById('quantity');
    const unitSelect = document.getElementById('unit');

    // Populate product dropdown and set default unit
    function populateProducts() {
        const data = DataStore.getData();
        productSelect.innerHTML = '<option value="">Select a product</option>';
        
        data.stock.forEach(item => {
            if (item.quantity > 0) {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.name} (${item.quantity} ${item.unit} available)`;
                option.dataset.unit = item.unit;
                productSelect.appendChild(option);
            }
        });
    }

    // Update unit select based on product
    productSelect.addEventListener('change', () => {
        const selectedOption = productSelect.selectedOptions[0];
        if (selectedOption && selectedOption.dataset.unit) {
            const productUnit = selectedOption.dataset.unit;
            unitSelect.value = productUnit;
            
            // Get compatible units and update options
            const compatibleUnits = UnitConversion.getCompatibleUnits(productUnit);
            updateUnitOptions(compatibleUnits, productUnit);
        }
    });

    // Update unit options based on compatible units
    function updateUnitOptions(compatibleUnits, defaultUnit) {
        const currentValue = unitSelect.value;
        unitSelect.innerHTML = '<option value="">Select unit</option>';
        
        const unitLabels = {
            kg: 'Kilogram (kg)',
            g: 'Gram (g)',
            L: 'Liter (L)',
            mL: 'Milliliter (mL)',
            gal: 'Gallon (gal)',
            pc: 'Piece (pc)',
            dz: 'Dozen (dz)',
            box: 'Box (box)',
            crate: 'Crate (crate)',
            bundle: 'Bundle (bundle)',
            bag: 'Bag (bag)',
            m: 'Meter (m)',
            cm: 'Centimeter (cm)',
            ft: 'Foot (ft)'
        };

        compatibleUnits.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unitLabels[unit];
            unitSelect.appendChild(option);
        });

        unitSelect.value = currentValue || defaultUnit;
    }

    // Display recent sales
    function displaySales() {
        const data = DataStore.getData();
        salesTableBody.innerHTML = '';
        
        // Get last 10 sales, sorted by date (newest first)
        const recentSales = [...data.sales]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        recentSales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(sale.date)}</td>
                <td>${sale.productName}</td>
                <td>${sale.quantity} ${UnitConversion.formatUnit(sale.quantity, sale.unit)}</td>
                <td>${formatCurrency(sale.price)}</td>
                <td>${formatCurrency(sale.total)}</td>
            `;
            salesTableBody.appendChild(row);
        });
    }

    // Handle form submission
    saleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productId = productSelect.value;
        const quantity = Number(quantityInput.value);
        const unit = unitSelect.value;
        const price = Number(document.getElementById('price').value);

        try {
            const data = DataStore.getData();
            const product = data.stock.find(item => item.id === productId);
            
            if (!product) {
                throw new Error('Product not found');
            }

            // Convert quantity to product's unit for comparison
            const convertedQuantity = UnitConversion.convert(quantity, unit, product.unit);
            
            if (convertedQuantity > product.quantity) {
                throw new Error(`Insufficient stock. Only ${product.quantity} ${product.unit} available.`);
            }

            // Add sale with original unit
            DataStore.addSale(productId, quantity, price, unit);
            
            // Reset form and update displays
            saleForm.reset();
            populateProducts();
            displaySales();
            updateDashboard();

            // Show success message
            alert('Sale added successfully!');
        } catch (error) {
            alert(error.message);
        }
    });

    // Initialize
    populateProducts();
    displaySales();
});
