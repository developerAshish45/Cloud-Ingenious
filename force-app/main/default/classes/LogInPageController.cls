public without sharing class LogInPageController {

    @AuraEnabled(cacheable=true)
    public static Contact getContactByEmail(String email) {
        String DealerRecordType = Label.DealerRecordType;
        String domain = email.substringAfter('@');
        System.debug('domain: ' + domain);
        
        // Check if the domain is a public domain
        List<Credit_App_Public_Domain__mdt> publicDomainRecords = [SELECT Public_Domains__c FROM Credit_App_Public_Domain__mdt];
        Set<String> publicDomains = new Set<String>();
        for (Credit_App_Public_Domain__mdt record : publicDomainRecords) {
            publicDomains.addAll(record.Public_Domains__c.split(','));
        }
		Boolean domainExists = false;
        for (String domainVar : publicDomains) {
             domainVar = domainVar.trim().toLowerCase();
             domain = domain.trim().toLowerCase();
             if (domainVar.equals(domain)) {
             domainExists = true;
             break;
                } 
            }     
        List<Contact> lstContact = [SELECT Id, Name, Email, Verification_Code__c FROM Contact WHERE Email = :email LIMIT 1];
        Contact resultContact;
        if(lstContact.size() > 0) {
            resultContact = lstContact[0];
        } else { // Create New Contact
            resultContact = new Contact();
            resultContact.Email = email;
            resultContact.LastName = email;
            
            // Query for the account associated with the domain
            if(domainExists == false){
            List<Account> lstAccount = [SELECT Id FROM Account WHERE Account_Domain__c = :domain AND RecordTypeId = :DealerRecordType LIMIT 1];
            if (lstAccount.size() > 0) {
                resultContact.AccountId = lstAccount[0].Id;
            } else {
                resultContact.AccountId = null;
            	}
            }
            insert resultContact;
        }
        return resultContact;
    }

    
    @AuraEnabled
    public static Integer sendOTP(String email) {
        Integer otp = (Integer) Math.floor(Math.random() * 9000) + 1000;
        sendOTPByEmail(email, String.valueOf(otp));
        return otp;
    }
    
    @Testvisible
	private static void sendOTPByEmail(String email, String otp) {
    // Fetch OrgWideEmailAddress
    String OrgWideEmailAddressId = Label.OrgWideEmailAddressId;
    List<OrgWideEmailAddress> lstEmailAddress = [SELECT Id FROM OrgWideEmailAddress WHERE Id =: OrgWideEmailAddressId LIMIT 1];

    // Check if OrgWideEmailAddress exists
    if (lstEmailAddress.isEmpty()) {
        System.debug('OrgWideEmailAddress with specified Id not found.');
        return; // Exit method if OrgWideEmailAddress not found
    }

    String[] toAddressString = new String[] { email };

    System.debug('Sending OTP email from: ' + lstEmailAddress[0].Id); // Print the email id from
    System.debug('Sending OTP email to: ' + email); // Print the email id to

    List<EmailTemplate> templates = [SELECT Id,Body FROM EmailTemplate WHERE DeveloperName =:'otpSending' LIMIT 1];

    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    mail.setOrgWideEmailAddressId(lstEmailAddress[0].Id);
    mail.setBccSender(false);
    mail.setUseSignature(true);  
    mail.setToAddresses(toAddressString);
    mail.setSubject('Your OTP For login for credit application');

    String emailBody = 'Dear Applicant,\n\n';
    emailBody += 'Your One Time Password (OTP) for login is: ' + otp + '.\n';
    emailBody += 'Please use this OTP to securely log in for Credit App.\n\n';
    emailBody += 'Thanks,\n';
    emailBody += 'Refrigerated Solutions Group.';
    
    mail.setPlainTextBody(emailBody);
    try {
        // Send the email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    } catch (Exception e) {
        // Handle any exceptions
        System.debug('An error occurred while sending OTP email: ' + e.getMessage());
    }
}
public static Id getEmailTemplateId(String templateApiName) {
    List<EmailTemplate> templates = [SELECT Id FROM EmailTemplate WHERE DeveloperName = :templateApiName LIMIT 1];
    return templates.isEmpty() ? null : templates[0].Id;
}



    public class CustomException extends Exception {}
}