import { LightningElement } from 'lwc';
import rsgPage_page from '@salesforce/resourceUrl/rsgPage';
import thankYou_page from '@salesforce/resourceUrl/ThankYou';
export default class InstallerAfterSubmit extends LightningElement {
    imageUrl1 = rsgPage_page;
    thankYouImage = thankYou_page;
    sfdcBaseURL;
    vfPage = 'InstallerCardList';

    get setBaseUrl() {
        return (this.sfdcBaseURL = window.location.origin + "/" + this.vfPage);
      }
}