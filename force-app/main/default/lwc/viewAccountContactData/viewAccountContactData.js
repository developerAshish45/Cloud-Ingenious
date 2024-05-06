import { LightningElement, track, wire } from 'lwc';
import fetchFilteredAccounts from '@salesforce/apex/DealerPortalController.fetchFilteredAccounts';
import fetchFilteredContacts from '@salesforce/apex/DealerPortalController.fetchFilteredContacts';

export default class ViewAccountContactData extends LightningElement {
    @track selectedValue = 'Account'; // Auto-select 'Account' initially
    @track showDataTable = false;
    @track showSearchBar = false;
    @track searchLabel = '';
    @track searchKey = '';
    @track tableData = [];
    @track tableColumns = [];
    disablePrevious = true;
    disableNext = false;
    @track page = 1; 
    @track items = []; 
    @track data = []; 
    @track columns; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 5; 
    @track totalRecountCount = 0;
    @track totalPage = 0;
    isPageChanged = false;

    // Define columns for Account and Contact separately
    accountColumns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Industry', fieldName: 'Industry' },
        { label: 'Phone', fieldName: 'Phone' }
    ];
    contactColumns = [
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName' },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'Email', fieldName: 'Email' }
    ];

    picklistOptions = [
        { label: 'Account', value: 'Account' },
        { label: 'Contact', value: 'Contact' }
    ];

    connectedCallback() {
        // Load account data by default on component initialization
        this.loadAccountData();
    }

    loadAccountData() {
        this.showDataTable = true;
        this.showSearchBar = true;
        this.searchLabel = 'Search Accounts';
        this.tableColumns = this.accountColumns;
        this.fetchFilteredAccountData();
    }

    loadContactData() {
        this.showDataTable = true;
        this.showSearchBar = true;
        this.searchLabel = 'Search Contacts';
        this.tableColumns = this.contactColumns;
        this.fetchFilteredContactData();
    }

    handleChange(event) {
        this.selectedValue = event.detail.value;
        if (this.selectedValue === 'Account') {
            this.page = 1;
            this.loadAccountData();
        } else if (this.selectedValue === 'Contact') {
            this.loadContactData();
            this.page = 1;
        } else {
            // Handle other scenarios if needed
        }
        if(this.page > 1){
            this.disablePrevious = false;
        }else{
            this.disablePrevious = true;
        }
        if(this.page == this.totalPage){
            this.disableNext = true;
        }else{
            this.disableNext = false;
        }
    }

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value.toLowerCase();
        if (this.selectedValue === 'Account') {
            this.fetchFilteredAccountData();
        } else if (this.selectedValue === 'Contact') {
            this.fetchFilteredContactData();
        }
        if(this.page > 1){
            this.disablePrevious = false;
        }else{
            this.disablePrevious = true;
        }
        if(this.page == this.totalPage){
            this.disableNext = true;
        }else{
            this.disableNext = false;
        }
    }

    fetchFilteredAccountData() {
        fetchFilteredAccounts({ searchKey: this.searchKey })
            .then(result => {
                this.tableData = result;
                this.processRecords(result);
            })
            .catch(error => {
                // Handle error
            });
    }

    fetchFilteredContactData() {
        fetchFilteredContacts({ searchKey: this.searchKey })
            .then(result => {
                this.tableData = result;
                this.processRecords(result);
            })
            .catch(error => {
                // Handle error
            });
    }


    processRecords(result){
            this.items = result;
            this.totalRecountCount = result.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            
            this.tableData = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = columns;
    }
     //clicking on previous button this method will be called
     previousHandler() {
        this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
          var selectedIds = [];
          for(var i=0; i<this.allSelectedRows.length;i++){
            selectedIds.push(this.allSelectedRows[i].Id);
          }
        this.template.querySelector(
            '[data-id="table"]'
          ).selectedRows = selectedIds;
    }

    //clicking on next button this method will be called
    nextHandler() {
        this.isPageChanged = true;
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }
          var selectedIds = [];
          for(var i=0; i<this.allSelectedRows.length;i++){
            selectedIds.push(this.allSelectedRows[i].Id);
          }
        this.template.querySelector(
            '[data-id="table"]'
          ).selectedRows = selectedIds;
    }

    //this method displays records page by page
    displayRecordPerPage(page){
        if(this.page > 1){
            this.disablePrevious = false;
        }else{
            this.disablePrevious = true;
        }
        if(this.page == this.totalPage){
            this.disableNext = true;
        }else{
            this.disableNext = false;
        }
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.tableData = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }    
}