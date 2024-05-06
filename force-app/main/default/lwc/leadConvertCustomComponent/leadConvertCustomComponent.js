import { LightningElement,api,track } from 'lwc';
import leadConvert from '@salesforce/apex/LeadConvertController.leadConvert';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class LeadConvertCustomComponent extends LightningElement {
    @api recordId;
    @track showSpinner=true;
    connectedCallback() {
        console.log('check id>',this.recordId);
          leadConvert({leadId:this.recordId}).then(result=> {
                 this.showSpinner=false;
              if(result=='Please complete all task'){
                  this.showToastWarning('Warning','Please complete all task','Warning');
                  
                window.location.reload()

              }else{
             this.showToast();
							 
           

              
							console.log('check result>',result);
    var opportunityId = result;

var url = `https://refsg--angeladev.sandbox.lightning.force.com/lightning/r/Quote/${opportunityId}/view`;
window.open(url,"_self");
}
        
         }).catch(error => {
           this.showToastError();
						//	this.showToast();
						
              this.showSpinner=false;
             window.location.reload()
				
				

             console.log('Error',error);
             
							
       // this.showToastError('Error', 'Cannot convert lead. There are incomplete tasks related to the lead.', 'Error');
              //this.showSpinner = false;    
         
        });
    }
   showToast() {
        const event = new ShowToastEvent({
            title: 'Success',
            variant:'Success',
            message:
                'Lead convert successfully!',
        });
        this.dispatchEvent(event);}
		
		showToastError()
			{
        const event = new ShowToastEvent({
            title: 'Error',
            variant:'Error',
            message:
                'lead convert failed',
        });
        this.dispatchEvent(event);} 
				
	
    showToastWarning(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
        } 

}