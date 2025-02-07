const translations = {
    en: {
        // App Title
        appTitle: "Farmer to Consumer",
        
        // Navigation
        dashboard: "Dashboard",
        sales: "Sales",
        purchases: "Purchases",
        stock: "Stock",
        suppliers: "Suppliers",
        reports: "Reports",
        
        // Dashboard
        dashboardOverview: "Dashboard Overview",
        todaySales: "Today's Sales",
        todayPurchases: "Today's Purchases",
        monthlyRevenue: "Monthly Revenue",
        stockValue: "Stock Value",
        itemsInStock: "items in stock",
        fromYesterday: "from yesterday",
        fromLastMonth: "from last month",
        
        // Quick Actions
        quickActions: "Quick Actions",
        newSale: "New Sale",
        newPurchase: "New Purchase",
        manageStock: "Manage Stock",
        addSupplier: "Add Supplier",
        
        // Alerts
        lowStockAlerts: "Low Stock Alerts",
        noAlerts: "No items are running low",
        remaining: "remaining",
        manage: "Manage",
        
        // Recent Activity
        recentSales: "Recent Sales",
        recentPurchases: "Recent Purchases",
        viewAll: "View All",
        date: "Date",
        product: "Product",
        amount: "Amount",
        supplier: "Supplier",
        
        // Form Labels
        quantity: "Quantity",
        price: "Price per Unit",
        unit: "Unit",
        selectProduct: "Select a product",
        selectUnit: "Select unit",
        
        // Messages
        noRecentSales: "No recent sales",
        noRecentPurchases: "No recent purchases"
    },
    bn: {
        // App Title
        appTitle: "কৃষক থেকে ভোক্তা",
        
        // Navigation
        dashboard: "ড্যাশবোর্ড",
        sales: "বিক্রয়",
        purchases: "ক্রয়",
        stock: "স্টক",
        suppliers: "সরবরাহকারী",
        reports: "রিপোর্ট",
        
        // Dashboard
        dashboardOverview: "ড্যাশবোর্ড ওভারভিউ",
        todaySales: "আজকের বিক্রয়",
        todayPurchases: "আজকের ক্রয়",
        monthlyRevenue: "মাসিক আয়",
        stockValue: "স্টক মূল্য",
        itemsInStock: "আইটেম স্টকে আছে",
        fromYesterday: "গতকাল থেকে",
        fromLastMonth: "গত মাস থেকে",
        
        // Quick Actions
        quickActions: "দ্রুত কার্যক্রম",
        newSale: "নতুন বিক্রয়",
        newPurchase: "নতুন ক্রয়",
        manageStock: "স্টক ব্যবস্থাপনা",
        addSupplier: "সরবরাহকারী যোগ করুন",
        
        // Alerts
        lowStockAlerts: "কম স্টক সতর্কতা",
        noAlerts: "কোন আইটেম কম নেই",
        remaining: "বাকি আছে",
        manage: "ব্যবস্থাপনা",
        
        // Recent Activity
        recentSales: "সাম্প্রতিক বিক্রয়",
        recentPurchases: "সাম্প্রতিক ক্রয়",
        viewAll: "সব দেখুন",
        date: "তারিখ",
        product: "পণ্য",
        amount: "পরিমাণ",
        supplier: "সরবরাহকারী",
        
        // Form Labels
        quantity: "পরিমাণ",
        price: "প্রতি ইউনিট মূল্য",
        unit: "ইউনিট",
        selectProduct: "পণ্য নির্বাচন করুন",
        selectUnit: "ইউনিট নির্বাচন করুন",
        
        // Messages
        noRecentSales: "কোন সাম্প্রতিক বিক্রয় নেই",
        noRecentPurchases: "কোন সাম্প্রতিক ক্রয় নেই"
    }
};

// Language switcher function
function switchLanguage(lang) {
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Update document title
    document.title = translations[lang].appTitle + " - Farmer to Consumer";
}

// Initialize with preferred language or default to English
document.addEventListener('DOMContentLoaded', () => {
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(preferredLanguage);
    
    // Set the language selector to the current language
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = preferredLanguage;
    }
});
