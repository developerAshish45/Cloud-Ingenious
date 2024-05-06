import { LightningElement, wire, api } from 'lwc';
import getAllCases from '@salesforce/apex/DealerPortalController.getAllCases';

export default class CaseCardContainer extends LightningElement {
    @api contact ;
    caseRecords = [];
    pagedCaseRecords = [];
    currentPage = 1;
    pageSize = 12; // Adjust the number of records per page as needed
    totalRecords = 0;
    
    @wire(getAllCases, { contactId: '$contact'})
    wiredCases({ error, data }) {
        console.log('wiredCases - error', this.contact);
       // console.log('wiredCases - data', this.password);
    
        if (data) {
            this.caseRecords = data;
            console.log('Record Data:', JSON.stringify(this.caseRecords));
            /*this.caseRecords = data.map(record => ({
                ...record,
                CreatedDate: new Date(record.CreatedDate).toLocaleDateString('en-US')
            }));*/
            this.totalRecords = this.caseRecords.length;
            this.updatePagedRecords();
        } else if (error) {
            console.error(error);
        }
    }
    

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.updatePagedRecords();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
            this.updatePagedRecords();
        }
    }

    handleSearch(event) {
        const searchValue = event.detail.toLowerCase();
        this.currentPage = 1;
        this.updatePagedRecords(searchValue);
    }

    updatePagedRecords(searchValue = null) {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        let filteredRecords = this.caseRecords;

        if (searchValue) {
            filteredRecords = this.caseRecords.filter(record =>
                Object.values(record).some(value => String(value).toLowerCase().includes(searchValue))
            );
        }

        this.totalPages = Math.ceil(filteredRecords.length / this.pageSize);
        this.isFirstPage = this.currentPage === 1;
        this.isLastPage = this.currentPage === this.totalPages;

        this.pagedCaseRecords = filteredRecords.slice(start, end);
    }
}