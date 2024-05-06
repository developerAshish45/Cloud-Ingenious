import { LightningElement, wire, api, track} from 'lwc';
import bgImage_page from '@salesforce/resourceUrl/bgImage_page';
import rsgLogo_page from '@salesforce/resourceUrl/rsgLogo_page';
import site_action_logo from '@salesforce/resourceUrl/NavIcon1';
import home_action_logo from '@salesforce/resourceUrl/NavIcon2';
import action_action_logo from '@salesforce/resourceUrl/NavIcon3';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
const RECORDS_PER_PAGE = 5;
import getData from '@salesforce/apex/InstallerSiteDataTableController.getData';
import getSubmittedData from '@salesforce/apex/InstallerSiteDataTableController.getSubmittedData';
export default class InstallerSiteDataTable extends NavigationMixin(LightningElement) {
    bgImageUrl=bgImage_page;
    rsgLogoUrl = rsgLogo_page;
    siteActionUrl = site_action_logo;
    homeActionUrl =  home_action_logo;
    actionActionUrl = action_action_logo;
    openDataSize = 0;
    data=[];
    sfdcBaseURL;
    vfPage = 'InstallerCardList';
    vfPage1 = 'InstallerForm';
    vfHome;
    vfDataTable = 'InstallerDataTable';
    error;
    currentSite = '';
    submittedData;
    @api accountId;
    //for sorting
    @track selectedValue = '5';
    @track selectOptions = [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: 'All', value: '0' }
    ];
    //pagination start
    @api timeSheetData;
    @track currentPage = 1;
    @track recordIDClick = false;
    @track nameee;
    @track sortOptions = [];
    @track selectedSortOption =0;
    @track show = false;
    @track totalPages = 1;
    get totalPages() {
        return Math.ceil((this.timeSheetData && this.timeSheetData.length) / RECORDS_PER_PAGE);
    }
    get displayedRecords() {
        const start = (this.currentPage -1 ) * RECORDS_PER_PAGE;
        const end = start + RECORDS_PER_PAGE;
        return this.timeSheetData ? this.timeSheetData.slice(start, end) : [];
    }
    get isFirstPage() {
        return this.currentPage === 1;
    }
    get isLastPage() {
        return this.currentPage === this.totalPages;
    }
    handlePrevious() {
        if (this.currentPage > 1) {
        this.currentPage--;
        }
    }
    handleNext() {
        if (this.currentPage < this.totalPages) {
        this.currentPage++;
        }
    }
    handleAnchorClick(event) {
        this.recordIDClick = true;
        this.nameee = event.target.name;
    }
    cancelHandler(event) {
        this.recordIDClick = event.detail.message;
    }
//end pagi

    get backgroundImage() {
        return `background-image: url(${this.bgImageUrl}); background-size: cover; padding: 20px; box-sizing: border-box; `;
    }
    connectedCallback() {
        var fullurl = window.location.href;
        // Parse the URL to get the query parameters
        var urlParams = new URLSearchParams(new URL(fullurl).search);
        var instaId = urlParams.get('instaId');
        this.accountId = instaId;
        console.log('instaId', this.accountId);
         if (this.accountId) {
            this.handleService();
            this.handleSubmittedData();
         }
    }
    // handleDataChange(event) {
    //     this.selectedValue = event.detail.value;
    //     this.show = this.selectedValue === '0';
    //     getData({instaId : this.accountId, selectedValue: this.selectedValue})
    //         .then(result => {
    //             if (result !== null && result !== undefined) {
    //                 this.data = result;
    //                 this.data = this.incrementIndex(result);
    //                 console.log('data--->', JSON.stringify(result));
    //             }
    //             else{
    //                 console.log('data is null');
    //             }
    //         })
    //         .catch(error => {
    //             this.error = error;
    //             console.log('Error in fetching Sites:'+ JSON.stringify(this.error));
    //             // Handle error
    //         });
    // }
    handleService(){
        getData({instaId : this.accountId, selectedValue: this.selectedValue})
            .then(result => {
                if (result !== null && result !== undefined) {
                    this.data = this.incrementIndex(result);
                    this.openDataSize = result.length + 1;
                                        console.log('data is--->' + JSON.stringify(this.data));
                }
                else{
                    console.log('data is null1');
                }
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching Sites:'+ JSON.stringify(this.error));
                // Handle error
            });
    }
    handleSubmittedData(){
        getSubmittedData({instaId : this.accountId, selectedValue: this.selectedValue})
            .then(result => {
                if (result !== null && result !== undefined) {
                    this.submittedData = result;
                    console.log('data is--->' + JSON.stringify(this.submittedData));
                    this.submittedData = this.incrementIndexSubmitted(result);
                }
                else{
                    console.log('data is null2');
                }
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching Sites:'+ JSON.stringify(this.error));
                // Handle error
            }); 
    }
    incrementIndex(data) {
        return data.map((record, index) => ({ ...record, index: index + 1 }));
    }
    incrementIndexSubmitted(data) {
        if(this.openDataSize != 0){
                    console.log('OPen data Size---' + this.openDataSize);
            return data.map((record, index) => ({ ...record, index: this.openDataSize + index}));
        } else if(this.openDataSize == 0){
            return data.map((record, index) => ({ ...record, index: index + 1})); 
        }
    }
    handleSiteChange(event){
        this.currentSite = event.target.name;
    }
    get setBaseUrl() {
        return (this.sfdcBaseURL = window.location.origin + "/RSGInstaller/s/installerMenu" +'?instaId='+ this.accountId +'&recordId=' + this.currentSite);
    }
    get setBaseUrl1() {
        return (this.sfdcBaseHome = window.location.origin + "/RSGInstaller/s/" +'?instaId='+ this.accountId);
    }
    get setBaseUrl3() {
        return (this.sfdcBaseURL = window.location.origin + "/RSGInstaller/s/installerForm" +'?instaId='+ this.accountId +'&recordId=' + this.currentSite);
    }
}