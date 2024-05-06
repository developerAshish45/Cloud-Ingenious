public with sharing class ApprovalLogInPageController {

    @AuraEnabled(cacheable=true)
    public static String getContactByEmail(String email) {
        // Use a more specific query to fetch only necessary fields
        List<Credit_App_Email__mdt> emailSettings = [SELECT Receipents__c FROM Credit_App_Email__mdt];
        Set<String> allRecipients = new Set<String>();

        for (Credit_App_Email__mdt setting : emailSettings) {
            allRecipients.addAll(setting.Receipents__c.split(','));
        }
        System.debug('allRecipients: ' + allRecipients);
        if (allRecipients.contains(email.trim())) {
            return email;
        }
        return null;
    }

    @AuraEnabled
    public static Integer sendOTP(String email) {
        Integer otp = generateOTP();
        String contactToUpdate = getContactByEmail(email);
        if (contactToUpdate == null) {
            // Handle the case where the email is not found in recipients
            return null;
        }
        sendOTPByEmail(email, String.valueOf(otp));
        return otp;
    }
    

    @AuraEnabled
    public static String validateOTP(String email) {    
        return getContactByEmail(email);
    }

    private static Integer generateOTP() {
        // Generate a random OTP within the specified range
        return (Integer) Math.floor(Math.random() * 9000) + 1000;
    }

    @TestVisible
    private static void sendOTPByEmail(String email, String otp) {
        // Fetch OrgWideEmailAddress
        String orgWideEmailAddressId = Label.OrgWideEmailAddressId;
        // Use LIMIT 1 in the query when retrieving a single record
        OrgWideEmailAddress[] lstEmailAddress = [SELECT Id FROM OrgWideEmailAddress WHERE Id = :orgWideEmailAddressId LIMIT 1];

        if (!lstEmailAddress.isEmpty()) {
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setOrgWideEmailAddressId(lstEmailAddress[0].Id);
            mail.setBccSender(false);
            mail.setUseSignature(true);
            mail.setToAddresses(new String[] { email });
            mail.setSubject('Your OTP For login for approval');

            String emailBody = 'Dear Approver,\n\n';
            emailBody += 'Your One Time Password (OTP) for login is: ' + otp + '.\n';
            emailBody += 'Please use this OTP to securely log in for approval.\n\n';
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
        } else {
            System.debug('OrgWideEmailAddress with specified Id not found.');
        }
    }

    // Optionally define custom exception classes in a separate file for better organization
    // public class CustomException extends Exception {}
}