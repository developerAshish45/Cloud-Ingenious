import { LightningElement, api, track } from 'lwc';

export default class SrsgEmailBody extends LightningElement {
    @api emailTemplate; // Passed email template content from Flow

    // Handler for template changes
    handleTemplateChange(event) {
        this.emailTemplate = event.detail.value;
        // Dispatch event to notify Flow of the changed template
        this.dispatchEvent(new CustomEvent('templatechange', { detail: { emailTemplate: this.emailTemplate } }));
    }
}