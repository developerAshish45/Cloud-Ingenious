/**
 * @description       : 
 * @author            : 
 * @group             : 
 * @last modified on  : 02-02-2024
 * @last modified by  : 
**/
public class IPAddressController{
    public string ip {get;set;}
    public pageReference getUserIPAddress() {
        
        // True-Client-IP has the value when the request is coming via the caching integration.
        ip = ApexPages.currentPage().getHeaders().get('True-Client-IP');
        
        // X-Salesforce-SIP has the value when no caching integration or via secure URL.
        if (ip == '' || ip == null) {
            ip = ApexPages.currentPage().getHeaders().get('X-Salesforce-SIP');
        } 
        
        // get IP address when no caching (sandbox, dev, secure urls)        
        if (ip == '' || ip == null) {
            ip = ApexPages.currentPage().getHeaders().get('X-Forwarded-For');
        }
        
        //get IP address from standard header if proxy in use
        //ip = ApexPages.currentPage().getHeaders().get('True-Client-IP');  
        return null;
        
    }
}