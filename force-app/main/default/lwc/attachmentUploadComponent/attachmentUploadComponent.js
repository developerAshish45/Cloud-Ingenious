import { LightningElement, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import uploadFile from "@salesforce/apex/InstallerDetailFormController.uploadFile";
export default class AttachmentUploadComponent extends LightningElement {
    @api recordId;
    encrypt = fileupload;

     get acceptedFormats() {
        return ['.png', '.jpg', '.jpeg'];
    }
    //This method fires after files got uploaded
    handleUploadFinished(event) {
        const linkedEntityId = this.recordId;    
        const uploadedFiles = event.detail.files;
        //show success toast message        
        const evt = new ShowToastEvent({
            title: 'File Upload Status...',
            message: uploadedFiles.length + 'file(s) uploaded successfully.',
            variant: 'success',
        });
        this.dispatchEvent(evt);

        /*dispatch this event to the parent, so that parent will take care to delegate this to 
         attachmentRelatedList component for refreshing the list with currently loaded files.
        */
         const evtCustomEvent = new CustomEvent('refreshlist', {   
            detail: {linkedEntityId}
            });
        this.dispatchEvent(evtCustomEvent);
    }
}