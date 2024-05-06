public without Sharing class SendEmailForCreditController {
    public static void sendCreditEmailNotifications(List<Credit__c> newCredits, Map<Id, Credit__c> oldMap) {
        String OrgWideEmailAddressId = Label.OrgWideEmailAddressId;
        List<OrgWideEmailAddress> lstEmailAddress = [SELECT Id FROM OrgWideEmailAddress WHERE Id =:OrgWideEmailAddressId LIMIT 1];
        if (lstEmailAddress != null && !lstEmailAddress.isEmpty() && lstEmailAddress[0] != null && lstEmailAddress[0].Id != null) {
            System.debug('Found OrgWideEmailAddress: ' + lstEmailAddress[0].Id);

            List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
            List<Messaging.SingleEmailMessage> emailsApprover = new List<Messaging.SingleEmailMessage>();

            for (Credit__c newCredit : newCredits) {
                System.debug('Processing Credit record: ' + newCredit.Id);
                Credit__c oldCredit = oldMap != null && oldMap.containsKey(newCredit.Id) ? oldMap.get(newCredit.Id) : null;
                sYSTEM.DEBUG('lINE 14'+oldCredit);

                List<Credit_App_Email__mdt> emailSettings = [SELECT Id, DeveloperName, MasterLabel, Receipents__c,LessThan50K__c,
                                                             MoreThan50K__c,NeedMoreInfo__c FROM Credit_App_Email__mdt];
                List<String> moreThan50kRecipents = new List<String>();
                List<String> lessThan50kRecipents = new List<String>();
                List<String> NeedMoreInformationRecipients = new List<String>();

                for (Credit_App_Email__mdt setting : emailSettings) {
                    if (setting.MoreThan50K__c == true) {
                        moreThan50kRecipents.addAll(setting.Receipents__c.split(','));
                    }
                }
                    for (Credit_App_Email__mdt setting : emailSettings) {
                    if (setting.LessThan50K__c == true) {
                        lessThan50kRecipents.addAll(setting.Receipents__c.split(','));
                    } 
                }
                    for (Credit_App_Email__mdt setting : emailSettings) {
					if (setting.NeedMoreInfo__c == true) {
                        NeedMoreInformationRecipients.addAll(setting.Receipents__c.split(','));
                    }
                }
                System.debug('moreThan50kRecipents Recipients: ' + moreThan50kRecipents);
                System.debug('lessThan50kRecipents' + lessThan50kRecipents);
                System.debug('Need More Information Recipients: ' + NeedMoreInformationRecipients);

                // Check if credit amount is less than 50k
                if (oldCredit == null || (oldCredit.Status__c != 'Submitted' && newCredit.Status__c == 'Submitted')) {
                    String templateName;
                    List<String> recipients;
                    if (newCredit.Credit_Limit_Requested__c < 50000) {
                        templateName = 'Credit_Limit_Less_Than_50k';
                        recipients = lessThan50kRecipents;
                        system.debug('less recipents'+recipients);
                    } else if (newCredit.Credit_Limit_Requested__c > 50000) {
                        templateName = 'Credit_Limit_More_Than_50k';
                        recipients = moreThan50kRecipents;
                    }
                    emails.add(createEmail(lstEmailAddress[0], recipients, templateName, newCredit));
                    System.debug('emails'+emails);
                }

                // Check if status is either "Approved" or "Need More Information"
                if ((oldCredit == null || oldCredit.Status__c != newCredit.Status__c) && (newCredit.Status__c == 'Approved' || newCredit.Status__c == 'Need More Information')) {
                    System.debug('Status is either "Approved" or "Need More Information" for Credit record ' + newCredit.Id);
                    Contact relatedContact = new Contact();
                    String contactEmail = '';
                    if (newCredit.Contact_Id__c != null) {
                        relatedContact = [SELECT Email FROM Contact WHERE Id = :newCredit.Contact_Id__c LIMIT 1];
                        if (relatedContact != null) {
                            contactEmail = relatedContact.Email;
                        }
                    }
                    String templateName = 'Credit_Application_Update';
                    List<String> recipients = new List<String>{contactEmail};
                    emails.add(createEmail(lstEmailAddress[0], recipients, templateName, newCredit));
                    System.debug('63'+emails);
                }
                if ((oldCredit == null || oldCredit.Status__c != newCredit.Status__c) && (newCredit.Status__c == 'Need More Information')) {
                    System.debug('More information required for Credit record ' + newCredit.Id);
                    String templateName = 'Need_More_Information';
                    List<String> recipients = NeedMoreInformationRecipients;
                    System.debug('77'+ lstEmailAddress[0]);
                    emails.add(createEmail(lstEmailAddress[0], recipients, templateName, newCredit));
                    System.debug('68'+emails);
                }
            }
				
            try {
                System.debug('Number of emails in emailsApprover: ' + emailsApprover.size());
                if (emails.size()>0) {
                    System.debug('emails'+emails);
                    System.debug('Sending emails');
                    Messaging.sendEmail(emails);
                }
                else {
                    System.debug('No emails to send.');
                }
            } catch (Exception e) {
                System.debug('An error occurred while sending emails: ' + e.getMessage());
            }
        } else {
            System.debug('OrgWideEmailAddress with specified Id not found.');
            return;
        }
    }

    private static Messaging.SingleEmailMessage createEmail(OrgWideEmailAddress orgWideEmailAddress, List<String> toAddresses, String templateName, Credit__c credit) {
        try {
            if (orgWideEmailAddress == null || toAddresses == null || templateName == null || credit == null) {
                throw new IllegalArgumentException('One or more arguments is null.');
            }
            
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            
            // Set OrgWideEmailAddressId
            if (orgWideEmailAddress.Id != null) {
                email.setOrgWideEmailAddressId(orgWideEmailAddress.Id);
            } else {
                throw new IllegalArgumentException('OrgWideEmailAddress Id is null.');
            }
            
            // Set To addresses
            if (!toAddresses.isEmpty()) {
                email.setToAddresses(toAddresses);
            } else {
                throw new IllegalArgumentException('To addresses list is empty.');
            }
            
            // Get email template content
            Map<String, String> templateContent = getEmailTemplateContent(templateName);
            System.debug('Template before html body =>>>>>>>>'+templateContent);
            if (templateContent != null) {
               
                String htmlBody = templateContent.get('Body');
                 System.debug('Before html body =>>>>>>>>'+htmlBody);
                String subject = templateContent.get('Subject');
                
                System.debug('Before subject body =>>>>>>>>'+subject);
                if (htmlBody != null && subject != null) {
                    // Replace placeholders in email template with credit details
                    htmlBody = htmlBody.replaceAll('\\{!Credit__c.Name\\}', credit.Name);
                    htmlBody = htmlBody.replaceAll('\\{!Credit__c.Credit_Limit_Requested__c\\}', String.valueOf(credit.Credit_Limit_Requested__c));
                    htmlBody = htmlBody.replaceAll('\\{!Credit__c.Id\\}', credit.Id);
                    htmlBody = htmlBody.replaceAll('\\{!Credit__c.Status__c\\}', credit.Status__c);
                    //if(subject.indexof('Credit__c.Approver_Comment__c') != -1){
                        if(!String.isBlank(credit.Approver_Comment__c))
                    	    htmlBody = htmlBody.replaceAll('\\{!Credit__c.Approver_Comment__c\\}', credit.Approver_Comment__c);
                        else
                            htmlBody = htmlBody.replaceAll('\\{!Credit__c.Approver_Comment__c\\}', '');
                    //}
                    htmlBody = htmlBody.replaceAll('\\]\\]>', '');
                    System.debug('139 html body =>>>>>>>>'+htmlBody);
                    
                    subject = subject.replaceAll('\\{!Credit__c.Name\\}', credit.Name);
                    subject = subject.replaceAll('\\{!Credit__c.Credit_Limit_Requested__c\\}', String.valueOf(credit.Credit_Limit_Requested__c));
                    subject = subject.replaceAll('\\{!Credit__c.Id\\}', credit.Id);
                    subject = subject.replaceAll('\\{!Credit__c.Status__c\\}', credit.Status__c);
                    System.debug('139 html subject =>>>>>>>>>'+subject);
                    
                    email.setSubject(subject);
                    email.setHtmlBody(htmlBody);
                } else {
                    throw new IllegalArgumentException('Email template body or subject is null.');
                }
            } else {
                throw new IllegalArgumentException('Email template content not found for template: ' + templateName);
            }
            
            return email;
        } catch (Exception e) {
            System.debug('Error creating email: ' + e.getMessage());
            return null;
        }
    }


    
    public static Map<String, String> getEmailTemplateContent(String templateApiName) {
        List<EmailTemplate> templates = [SELECT Id, Subject, HtmlValue,BrandTemplateId FROM EmailTemplate WHERE DeveloperName = :templateApiName LIMIT 1];
        if (!templates.isEmpty()) {
            Map<String, String> templateContent = new Map<String, String>();
            templateContent.put('Subject', templates[0].Subject);
            String htmlBody = templates[0].HtmlValue;
            templateContent.put('Body', templates[0].HtmlValue);
            return templateContent;
        } else {
            return null;
        }
    }

}