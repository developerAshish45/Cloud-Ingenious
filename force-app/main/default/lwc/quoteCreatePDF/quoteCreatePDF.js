import { LightningElement,api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import LargeModel from "@salesforce/resourceUrl/LargeModel";
import { loadStyle } from "lightning/platformResourceLoader";
import savePDFApex from "@salesforce/apex/QuotePDFController1.savePDF";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const domain = '/apex/QuotePDF?id=';
export default class QuoteCreatePDF extends LightningElement {

    @api _recordId;
    url='';
        @api set recordId(value) {
        this._recordId = value;
        this.url = domain + this.recordId;
        console.log('url---',this.url);
        }

        get recordId() {
        return this._recordId;
        }
    connectedCallback() {
     //this.url = domain + this.recordId;
     console.log('urll---',this.url);
         loadStyle(this, LargeModel);

    }

     closeQuickActionDialog() {
        
        this.dispatchEvent( new CloseActionScreenEvent() );

    }

    savePDF() {
        // Call the Apex method to generate and save the PDF
        console.log( 'Inside Close Save method' );
        const result = savePDFApex({ quoteId: this._recordId });
        
        if (result) {
            const evt = new ShowToastEvent({
                        title: 'Success',
                        message: 'Quote Saved Successfully',
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);
            this.dispatchEvent( new CloseActionScreenEvent() );
            console.log( 'Inside Close Save results' );
        } else {
            console.log( 'Inside Close error save' );
           this.dispatchEvent( new CloseActionScreenEvent() );
        } 
    } 
}