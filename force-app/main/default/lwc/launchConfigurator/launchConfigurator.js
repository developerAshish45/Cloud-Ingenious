import { LightningElement, track} from 'lwc';
import MY_RESOURCE from '@salesforce/resourceUrl/LaunchConfiguratorImage';
export default class LaunchConfigurator extends LightningElement {
    imageUrl = 'https://refsg--service--c.sandbox.vf.force.com/resource/1713873618000/LaunchConfiguratorImage?';
    title = 'New Quote';
    @track isOpen = true;

    closeModal() {
        this.isOpen = false;
    }
}