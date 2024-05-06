import { LightningElement, wire, api, track} from 'lwc';
import rsgLogo_page from '@salesforce/resourceUrl/rsgLogo_page';
import { NavigationMixin } from 'lightning/navigation';
import bgImage_page from '@salesforce/resourceUrl/bgImage_page';
import welcomeMessage from '@salesforce/apex/IntallerWelcome.welcomeMessage';
export default class installerPortal extends NavigationMixin (LightningElement) {
    bgImageUrl=bgImage_page;
    rsgLogoUrl = rsgLogo_page;
    accountId;
    data;
    error;
    showClnOrInstNameFlag = false;
    sfdcBaseURL;
    sfdcBaseURLC;
    vfPage = 'InstallerDataTable';
    vfPage1 = 'CleanDataTable';
    get backgroundImage() {
        return `background-image: url(${this.bgImageUrl}); background-size: cover; padding: 20px; `;
    }
    connectedCallback() {
        var fullurl = window.location.href;
        var urlParams = new URLSearchParams(new URL(fullurl).search);
        var instaId = urlParams.get('instaId');
        this.accountId = instaId;
        this.handleService();
    }

    handleService(event){
        welcomeMessage({recId : this.accountId})
            .then(result => {
                console.log('result 21312312 ---'+ JSON.stringify(result));
                this.data = result;
                if(this.data.Is_Maintainance__c == true){
                    this.showClnOrInstNameFlag = true;
                }
                
                if(result != null){
                    console.log('data--->',JSON.Stringify(result));
                    console.log('Customer name ---',this.data.Name);
                    console.log('Maintenance', this.data.Name)
                }
                else{
                    console.log('data is null');
                }
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching customer name:'+ JSON.stringify(this.error));
            });
    }
    changeColor(event) {
        event.target.style.backgroundColor = "#34578a"; // Change background color on mouse hover
    }
    againconvert(event) {
        event.target.style.backgroundColor = "#4169e1"; // Change background color on mouse hover
    }
    get setBaseUrl() {
        return (this.sfdcBaseURL = window.location.origin + "/RSGInstaller/s/installerList" + '?instaId='+ this.accountId);
    }
    
    get setBaseUrl1() {
    return 'https://refsg--service.sandbox.my.site.com/installer/'+'?instaId='+ this.accountId;
    }

    handleNavigation(){
        console.log('Inside Navigation');
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes:{
                pageName: 'installerList'
            },
            state: {
                instaId: this.accountId
            }
        });
    }
}