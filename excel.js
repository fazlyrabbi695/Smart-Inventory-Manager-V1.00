// Excel Export Functions
const ExcelExport = {
    generateExcel(reportType, data, dateRange) {
        try {
            // Create workbook
            const wb = XLSX.utils.book_new();
            
            // Add report info sheet
            const reportInfo = [
                ['Report Information', ''],
                ['Type', this.capitalizeFirstLetter(reportType)],
                ['Generated Date', this.formatDate(new Date())],
                ['Date Range', `${this.formatDate(dateRange.start)} to ${this.formatDate(dateRange.end)}`]
            ];
            const infoSheet = XLSX.utils.aoa_to_sheet(reportInfo);
            XLSX.utils.book_append_sheet(wb, infoSheet, 'Report Info');

            // Add data sheet
            if (data.length > 0) {
                const dataSheet = XLSX.utils.json_to_sheet(data);
                
                // Set column widths
                const cols = Object.keys(data[0]).map(() => ({ wch: 15 }));
                dataSheet['!cols'] = cols;
                
                XLSX.utils.book_append_sheet(wb, dataSheet, 'Data');
            }

            // Generate filename and save
            const filename = `${reportType}_report_${this.formatDate(new Date()).replace(/[\/\s]/g, '_')}.xlsx`;
            XLSX.writeFile(wb, filename);
            
            return true;
        } catch (error) {
            console.error('Error generating Excel:', error);
            return false;
        }
    },

    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2
        }).format(amount);
    }
};
