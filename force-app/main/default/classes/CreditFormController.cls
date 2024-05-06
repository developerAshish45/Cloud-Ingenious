public without sharing class CreditFormController {
    
    @AuraEnabled
    public static Id  createCompanyInformation(String accountDomain,String recordId,String businessName, String yearStarted, 
                                               String parentCompany,String radioGroup, string groupName, String phone, string physicalAddress, 
                                               string physicalCity, string physicalState, String physicalZip,
                                               String mailingAddress,String mailingCity,String mailingState, Integer mailingZip, 
                                               String billingAddress, String billingCity, String billingState, string billingZip,
                                               String apName, String Contact, string email, string invoiceEmail, string orderEmail,
                                               string timeZone, String resaleNumber, Integer duns, string website){
                                                   
             List<Credit_App_Public_Domain__mdt> publicDomainRecords = [SELECT Public_Domains__c FROM Credit_App_Public_Domain__mdt];
                Set<String> publicDomains = new Set<String>();
                for (Credit_App_Public_Domain__mdt record : publicDomainRecords) {
                    publicDomains.addAll(record.Public_Domains__c.split(','));
                }
                Boolean domainExists = false;
                for (String domainVar : publicDomains) {
                     domainVar = domainVar.trim().toLowerCase();
                     accountDomain = accountDomain.trim().toLowerCase();
                     if (domainVar.equals(accountDomain)) {
                     domainExists = true;
                     break;
                        } 
                    }  
            String DealerRecordType = Label.DealerRecordType;   
            String CountryName = 'United States';                                 
            Account acc = new Account();    
            if(domainExists == true){
              acc.Public_Domain__c = true;  
            }                                       
            acc.Account_Domain__c =  accountDomain;                                               
            acc.Id = recordId;  
                                                         
            acc.RecordTypeId = DealerRecordType;
            acc.Name = businessName;
            acc.Year__c = yearStarted;
            acc.Parent_Company__c = parentCompany;
            acc.Are_you_a_Buying_Group_member__c = radioGroup;
            acc.Buying_group_Note__c = groupName;
            acc.Phone = phone;
            acc.ShippingStreet =physicalAddress;
            acc.ShippingCity =physicalCity;
            acc.ShippingState = physicalState;
            acc.ShippingCountry = CountryName;
            acc.ShippingPostalCode = physicalZip;
            acc.Mailing_address__c = mailingAddress;
            acc.Mailing_City__c = mailingCity;
            acc.Mailing_State__c = mailingState;
            acc.Mailing_Country__c =CountryName;
            acc.Mailing_Zip__c = mailingZip;
            acc.BillingStreet = billingAddress;
            acc.BillingCity = billingCity;
            acc.BillingState = billingState;
            acc.BillingCountry = CountryName;
            acc.BillingPostalCode = billingZip;
            acc.AP_Name_Title__c =apName;
            acc.Contact_Number__c = Contact;
            acc.Email__c = email;
            acc.Dedicated_Invoice_Email__c =invoiceEmail;
            acc.Order_Acknowledgment_Email__c = orderEmail;
            acc.Time_Zone__c = timeZone;
            acc.State_Resale_Number__c = resaleNumber;
            acc.DUNS__c = duns;
            acc.Website = website;
        try{
           upsert acc;
        }
        catch(exception e){
            System.debug('Error while creting'+ e.getMessage());
        }
        return acc.Id;
    }

     @AuraEnabled
     public static List<Credit__c> createCreditRecord(List<Credit__c> creditData){
        try{
            upsert creditData;
            System.debug('Credit records upserted successfully: ' + creditData.size());
        }
            catch(exception e){
               System.debug(e.getMessage()); 
            }
        System.debug(creditData);
        return creditData;
    }
	@AuraEnabled
    public static Contact updateContactRecord(String email,Date updatedDate,String conId,String accID,String LastName,String FirstName,String Title,
                                              String phoneNumber) {
        Contact newContact = new Contact();
        newContact.Email = email;
        newContact.Updated_Date__c = updatedDate;                                          
        newContact.Id = conId;                                          
        newContact.Phone = phoneNumber;                                          
        newContact.FirstName = FirstName;
        newContact.LastName = LastName;
        newContact.AccountId = accID;
        newContact.Title = Title; 
        //update newContact;
        upsert newContact;
        System.debug(newContact);
        return newContact;
    }
    @AuraEnabled
    public static Contact updateContactRecordNew(Date updatedDate,String conId,String LastName,String FirstName,String Title,
                                              String phoneNumber) {
        Contact newContact = new Contact();
        newContact.Updated_Date__c = updatedDate;                                          
        newContact.Id = conId;                                          
        newContact.Phone = phoneNumber;                                          
        newContact.FirstName = FirstName;
        newContact.LastName = LastName;
        newContact.Title = Title; 
        update newContact;
        System.debug(newContact);
        return newContact;
    }

    // @AuraEnabled
    // public static List<Account> getAccountInfo(String accountDomain) {
    //     try {
    //         List<Account> accList = [SELECT Id,Account_Domain__c,Status__c, Name, Year__c, Parent_Company__c, Are_you_a_Buying_Group_member__c,
    //                        Buying_group_Note__c, Phone, ShippingStreet, ShippingCity, ShippingState,
    //                        ShippingPostalCode, Mailing_address__c, Mailing_City__c, Mailing_State__c,
    //                        Mailing_Zip__c, BillingStreet, BillingCity, BillingState, BillingPostalCode,
    //                        AP_Name_Title__c, Contact_Number__c, Email__c, Dedicated_Invoice_Email__c,
    //                        Order_Acknowledgment_Email__c, Time_Zone__c, State_Resale_Number__c,
    //                        DUNS__c, Website FROM Account WHERE Account_Domain__c = :accountDomain];
    //         System.debug('Retrieved Account: ' + accList);
    //         return accList;
    //     } catch (Exception e) {
    //         System.debug('Error occurred: ' + e.getMessage());
    //         return null;
    //     }
    // }
    @AuraEnabled
    public static List<Account> getAccountInfo(String accountDomain,String logInEmail) {
        String DealerRecordType = Label.DealerRecordType;
        List<Account> accList = new List<Account>();
        List<Account> accListForDomain = [Select Id,Account_Domain__c From Account Where Account_Domain__c =: accountDomain And RecordTypeId = :DealerRecordType Limit 1];
        try {
            List<Credit_App_Public_Domain__mdt> publicDomainRecords = [SELECT Id, Public_Domains__c FROM Credit_App_Public_Domain__mdt];
            System.debug('publicDomainRecords'+ publicDomainRecords);
            List<String> domainList = new List<String>();
            if(!publicDomainRecords.isEmpty()){
                for (Credit_App_Public_Domain__mdt record : publicDomainRecords) {
                    domainList.addAll(record.Public_Domains__c.split(','));
                }
            }
            System.debug(domainList);
            System.debug('0th index'+domainList[0]);
            System.debug('99th index'+domainList[99]);
            System.debug('98th index'+domainList[98]);
            Boolean domainExists = false;
            for (String domain : domainList) {
                domain = domain.trim().toLowerCase();
                accountDomain = accountDomain.trim().toLowerCase();
                if (domain.equals(accountDomain)) {
                    domainExists = true;
                    break;
                } 
            }
            System.debug(accountDomain);
            System.debug('Domain Exists in Custom Metadata Type: ' + domainExists);
            if(domainExists == true) {
                List<Contact> conList = [Select Id,Email,AccountId From Contact Where Email =: logInEmail Limit 1];
                if(!conList.isEmpty()){
                    accList = [SELECT Id, Account_Domain__c,Name, Year__c, Parent_Company__c, Are_you_a_Buying_Group_member__c,
                    Buying_group_Note__c, Phone, ShippingStreet, ShippingCity, ShippingState,
                    ShippingPostalCode, Mailing_address__c, Mailing_City__c, Mailing_State__c,
                    Mailing_Zip__c, BillingStreet, BillingCity, BillingState, BillingPostalCode,
                    AP_Name_Title__c, Contact_Number__c, Email__c, Dedicated_Invoice_Email__c,
                    Order_Acknowledgment_Email__c, Time_Zone__c, State_Resale_Number__c,
                    DUNS__c, Website FROM Account WHERE Id =:conList[0].AccountId AND RecordTypeId = :DealerRecordType];
                }
                else{
                System.debug('Domain exists in Custom Metadata Type. Flow will be prevented.');
                return null;
                }
            }
            
            // Check if conListForLogInEmail has any elements
            if (domainExists == false) {
                // Query accounts based on the AccountId of the contact in conListForLogInEmail
                accList = [SELECT Id, Account_Domain__c,Name, Year__c, Parent_Company__c, Are_you_a_Buying_Group_member__c,
                                        Buying_group_Note__c, Phone, ShippingStreet, ShippingCity, ShippingState,
                                        ShippingPostalCode, Mailing_address__c, Mailing_City__c, Mailing_State__c,
                                        Mailing_Zip__c, BillingStreet, BillingCity, BillingState, BillingPostalCode,
                                        AP_Name_Title__c, Contact_Number__c, Email__c, Dedicated_Invoice_Email__c,
                                        Order_Acknowledgment_Email__c, Time_Zone__c, State_Resale_Number__c,
                                        DUNS__c, Website FROM Account WHERE Account_Domain__c = :accountDomain AND RecordTypeId = :DealerRecordType];
            }
            
            System.debug('Retrieved Account: ' + accList);
            return accList;
        } catch (Exception e) {
            System.debug('Error occurred: ' + e.getMessage());
            return null;
        }
    }

    @AuraEnabled
    public static List<Account> getAccountInfoFromCreditId(String creditId) {
        String DealerRecordType = Label.DealerRecordType;
        List<Credit__c> creditList = [Select Id,Account_Id__c From Credit__c Where Id =:creditId Limit 1];
        System.debug('creditList'+creditList);
        List<Account> accList = [SELECT Id, Account_Domain__c,Name, Year__c, Parent_Company__c, Are_you_a_Buying_Group_member__c,
        Buying_group_Note__c, Phone, ShippingStreet, ShippingCity, ShippingState,ShippingCountry,
        ShippingPostalCode, Mailing_address__c, Mailing_City__c, Mailing_State__c,
        Mailing_Zip__c, BillingStreet, BillingCity, BillingState,BillingCountry, BillingPostalCode,
        AP_Name_Title__c, Contact_Number__c, Email__c, Dedicated_Invoice_Email__c,
        Order_Acknowledgment_Email__c, Time_Zone__c, State_Resale_Number__c,
        DUNS__c, Website,Mailing_Country__c FROM Account WHERE Id = :creditList[0].Account_Id__c AND RecordTypeId = :DealerRecordType Limit 1];
        System.debug('accList'+ accList);
        return accList;
    }


    @AuraEnabled
    public static Credit__c getCreditInfo(String creditId) {
        Credit__c credit = new Credit__c();
        try{
           credit = [SELECT Id,Customer_Accounts_Payable_Portal_Require__c,Website__c,Resale_Certificate__c,Group_brand_s__c,
                     Pay_tax_on_shipment__c,Business_Type__c,President_Owner__c,VP_of_Finance_CFO__c,Sec_Treasurer__c,
                     Credit_Limit_Requested__c,Company_1__c,Contact_Number_1__c,Acct_1__c,Supplier_Email_1__c,
                     Phone_Number_1__c,Company_2__c,Contact_Number_2__c,Acct_2__c,Supplier_Email_2__c,Phone_Number_2__c,
                     Company_3__c,Contact_Number_3__c,Acct_3__c,Supplier_Email_3__c,Phone_Number_3__c,Bank_Name__c,Account__c,
                     Address__c,City__c,State__c,Zip__c,Contact__c,Phone__c,Fax__c,Head_of_Finance_or_Head_of_Accounting__c,Name_Finance__c,
                     Phone_Finance__c, Email_Finance__c,Terms_And_Conditions__c,Applicant_Signature__c,Approver_Comment__c,Approver_Email__c,Status__c,Approved_Credit_Amount__c FROM Credit__c where Id=:creditId] ;
            System.debug('Retrieved credit: ' + credit);
            return credit;
        }
         catch (Exception e) {
            System.debug('Error occurred: ' + e.getMessage());
            return null;
        }

    }
    @AuraEnabled
    public static List<Credit__c> getCreditInfoForExisting(String contactEmail){
      List<Contact> conList = [Select Id,Email from Contact where Email=:contactEmail];
        
        
        List<Credit__c> creditList = [SELECT Id,Customer_Accounts_Payable_Portal_Require__c,Website__c,Resale_Certificate__c,Group_brand_s__c,
                                      Pay_tax_on_shipment__c,Business_Type__c,President_Owner__c,VP_of_Finance_CFO__c,
                                      Sec_Treasurer__c,Credit_Limit_Requested__c,Company_1__c,Contact_Number_1__c,Acct_1__c,Supplier_Email_1__c,
                                      Phone_Number_1__c,Company_2__c,Contact_Number_2__c,Acct_2__c,Supplier_Email_2__c,Phone_Number_2__c,
                                      Company_3__c,Contact_Number_3__c,Acct_3__c,Supplier_Email_3__c,Phone_Number_3__c,Bank_Name__c,Account__c,
                                      Address__c,City__c,State__c,Zip__c,Contact__c,Phone__c,Fax__c FROM Credit__c];
        return creditList;
        
    }
    @AuraEnabled
    public static Id getContactId(String logInEmail){
        List<Contact> conList = [SELECT Id FROM Contact WHERE Email = :logInEmail LIMIT 1];
        if (conList.isEmpty()) {
            return null; 
        } else {
            return conList[0].Id;
        }
    }
    
    @AuraEnabled
    public static Contact getContactByEmail(String email) {
        return [SELECT Id, FirstName, LastName,Updated_Date__c, Title, Phone,CreatedDate FROM Contact WHERE Email = :email LIMIT 1];
    }
    @AuraEnabled
    public static Contact getContactByCreditId(String creditId) {
        List<Credit__c> creditList = [Select Id,Contact_Id__c From Credit__c Where Id =:creditId Limit 1];
        System.debug('creditList'+creditList);
        Contact con = [SELECT Id, FirstName, LastName,Updated_Date__c, Title, Phone,CreatedDate,Email FROM Contact WHERE Id = :creditList[0].Contact_Id__c LIMIT 1];
        System.debug('con'+ con);
        return [SELECT Id, FirstName, LastName,Updated_Date__c, Title, Phone,CreatedDate,Email FROM Contact WHERE Id = :creditList[0].Contact_Id__c LIMIT 1];
    }
    // @AuraEnabled
    // public static Account getAccountStatus(String accId,string status) {
    //     String DealerRecordType = Label.DealerRecordType;
    //     List<Account> accList = [SELECT Id, Status__c FROM Account WHERE Id = :accId AND RecordTypeId = :DealerRecordType];
    //     System.debug('line 141'+ accList);
    //     if(accList.size()>0){
    //         for(Account objAccount : accList){
    //         if(objAccount.Status__c == 'In Progress'){
    //             objAccount.Status__c = status;  
    //         } 
    //     }
    //     update accList;
    //     System.debug('line 148'+accList);
    //         return accList[0];
    //     }else{
    //          return null;
    //     }
    // }
    // @AuraEnabled
    // public static List<Credit__c> getCreditRecords(String contactEmail) {
    //     List<Credit__c> creditList = new List<Credit__c>();
    //     List<Contact> contactRecord = [SELECT Id FROM Contact WHERE Email = :contactEmail LIMIT 1];
    //     if (contactRecord != null) {
    //         creditList = [SELECT Id,Credit_Limit_Requested__c,Name, Business_Type__c, Bank_Name__c, Account__c, Account_Id__c, Contact_Id__c, Status__c,Account_Id__r.Name,Contact_Id__r.Name 
    //                       FROM Credit__c 
    //                       WHERE Contact_Id__c = :contactRecord[0].Id  ORDER BY CreatedDate DESC];
    //         system.debug(creditList);
    //     } else {
    //         system.debug('Contact not found for email: ' + contactEmail);
    //     }
        
    //     return creditList;
    // }
    @AuraEnabled
    public static List<Credit__c> getCreditRecords(String contactEmail) {
        List<Credit__c> creditList = new List<Credit__c>();
        String domain = contactEmail.substringAfter('@');
        String DealerRecordType = Label.DealerRecordType;
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
        // Query the Contact to find the associated Account Id
        List<Contact> contactRecords = [SELECT Id, Email, AccountId FROM Contact WHERE Email = :contactEmail LIMIT 1];
        System.debug('contactRecords' + contactRecords);
        
        if (!contactRecords.isEmpty()) {
            Id accountId = contactRecords[0].AccountId;
            System.debug('Account Id' + accountId);
            
            if (!String.isEmpty(accountId)) {
                creditList = [SELECT Id, Credit_Limit_Requested__c, Name, Business_Type__c, Bank_Name__c, Account__c, Account_Id__c, Contact_Id__c, Status__c, Account_Id__r.Name, Contact_Id__r.Name 
                            FROM Credit__c 
                            WHERE Account_Id__c = :accountId ORDER BY CreatedDate DESC];
                
                System.debug('Credit Records: ' + creditList);
            } else {
                System.debug('Account Id is null for Contact with email: ' + contactEmail);
            }
        } else if(contactRecords.isEmpty() && domainExists == false){
                List<Account> accList = [Select Id,Account_Domain__c From Account where Account_Domain__c=:domain AND RecordTypeId = :DealerRecordType Limit 1];
                if(!accList.isEmpty()){
                    creditList = [SELECT Id, Credit_Limit_Requested__c, Name, Business_Type__c, Bank_Name__c, Account__c, Account_Id__c, Contact_Id__c, Status__c, Account_Id__r.Name, Contact_Id__r.Name 
                    FROM Credit__c 
                    WHERE Account_Id__c = :accList[0].Id ORDER BY CreatedDate DESC];
        
                    System.debug('Credit Records: ' + creditList);
                }
                else {
                    System.debug('Account Id is null for Contact with email: ' + contactEmail);
                }
        }
        else {
            System.debug('Contact not found for email: ' + contactEmail);
        }
        
        return creditList;
    }


    @AuraEnabled
    public static String getCreditStatus(String creditId) {
       List<Credit__c> creditStatus = [Select Id,Status__c from Credit__c where Id=:creditId Limit 1];
        System.debug(creditStatus[0].Status__c);
        return creditStatus[0].Status__c;
    }
    @AuraEnabled
    public static String changeCreditStatus(String rowCreditId) {
        try {
            List<Credit__c> creditsToUpdate = [SELECT Id, Status__c FROM Credit__c WHERE Id = :rowCreditId LIMIT 1];
            
            if (!creditsToUpdate.isEmpty()) {
                Credit__c creditToUpdate = creditsToUpdate[0];
                
                if (creditToUpdate.Status__c == 'In Progress') {
                    creditToUpdate.Status__c = 'Rejected';
                    update creditToUpdate;
                }
                
                return creditToUpdate.Status__c;
            } else {
                return null;
            }
        } catch (Exception e) {
            System.debug('An error occurred while changing credit status: ' + e.getMessage());
            return null;
        }
    }
    @AuraEnabled
    public static Credit__c updateCreditStatus(String creditId, String status, String signature) {
        List<Credit__c> creditList = [SELECT Id, Status__c FROM Credit__c WHERE Id = :creditId];
        System.debug('line 155' + creditList);
        if (!creditList.isEmpty()) {
            for (Credit__c objCredit : creditList) {
                if (objCredit.Status__c == 'In Progress') {
                    objCredit.Status__c = status;  
                    objCredit.Applicant_Signature__c = signature;
                } 
            }
            update creditList;
            System.debug('line 162' + creditList);
            return creditList[0];
        } else {
            return null;
        }
    }
    
    @AuraEnabled
    public static Credit__c updateCreditStatusForApprover(String creditId, String comment, String status,Decimal amount) {
        Credit__c updatedCredit;
    
        try {
            Credit__c creditRecord = [SELECT Id, Status__c FROM Credit__c WHERE Id = :creditId LIMIT 1];
            if (creditRecord != null) {
                creditRecord.Status__c = status;
                creditRecord.Approver_Comment__c = comment;
                creditRecord.Approved_Credit_Amount__c = amount;
                update creditRecord;
                updatedCredit = creditRecord;
            } else {
                throw new AuraHandledException('Credit record not found with ID: ' + creditId);
            }
        } catch (Exception e) {
            System.debug('Error updating credit record: ' + e.getMessage());
        }
        return updatedCredit;
    }
    @AuraEnabled
    public static Credit__c updateCreditApprovalEmailForApprover(String creditId,String email) {
        Credit__c updatedCredit;
    
        try {
            Credit__c creditRecord = [SELECT Id, Status__c,Approver_Email__c FROM Credit__c WHERE Id = :creditId LIMIT 1];
            if (creditRecord != null) {
                creditRecord.Approver_Email__c = email;
                update creditRecord;
                updatedCredit = creditRecord;
            } else {
                throw new AuraHandledException('Credit record not found with ID: ' + creditId);
            }
        } catch (Exception e) {
            System.debug('Error updating credit record: ' + e.getMessage());
        }
        return updatedCredit;
    }
    

    @AuraEnabled
    public static List<Credit__c> saveSignature(string creditId,String signature){
	List<Credit__c> creditList = [Select Id,Applicant_Signature__c from Credit__c where Id=:creditId Limit 1];
    List<Credit__c> creditListNew = new List<Credit__c>();    
        if(!creditList.isEmpty()){
            Credit__c credit = new Credit__c();
            credit.Id = creditId;
            credit.Applicant_Signature__c = signature;
            creditListNew.add(credit); 
        } 
        update creditListNew;
        return creditListNew;
    }
    @AuraEnabled
    public static Credit__c getCreditSignature(string creditId){
        return [Select Id,Applicant_Signature__c from Credit__c where Id=:creditId Limit 1];
    }
    @AuraEnabled
    public static void reparentFileAttachment(Id contentDocumentId, Id newParentId) {
        // Query the ContentDocumentLink associated with the file attachment
        ContentDocumentLink oldLink = [SELECT Id, ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE ContentDocumentId = :contentDocumentId LIMIT 1];
        
        if (oldLink != null) {
            // Create a new ContentDocumentLink for the new parent record
            ContentDocumentLink newLink = new ContentDocumentLink(
                ContentDocumentId = oldLink.ContentDocumentId,
                LinkedEntityId = newParentId,
                ShareType = 'V',
                Visibility = 'AllUsers'
            );
            insert newLink;
            delete oldLink;
        }
    }


}