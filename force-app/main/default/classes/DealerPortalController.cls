/**
 * @description       : 
 * @author            : 
 * @group             : 
 * @last modified on  : 02-06-2024
 * @last modified by  : 
**/
public Without sharing class DealerPortalController {
  // To get All cases of related Contact.
    @AuraEnabled(cacheable=true)
    public static List<Case> getAllCases(String contactId) {
        List<Contact> conList = [Select AccountId From Contact Where Id =: contactId LIMIT 1];
        if(!conList.isEmpty()){
            return [SELECT Id, CaseNumber, Subject, Status, CreatedDate, Equipment_SO__c, Install_PO_Amount__c, Install_SO__c FROM Case Where RecordType.DeveloperName = 'Install' AND AccountId =: conList[0].AccountId LIMIT 50000];
        }else{
            return null;
        }
    }

    @AuraEnabled
    public static Contact doLogin(String userName, String password) { 

        List<Contact> lstContact = [SELECT Name FROM Contact Where email =: userName and Password__c =: password LIMIT 1];

        if (!lstContact.isEmpty()) {
            List<Dealer_Login_Session__c> listDealerLogin = [SELECT Id, IsLoggedIn__c, User_Email__c FROM Dealer_Login_Session__c WHERE User_Email__c = :userName LIMIT 1];
            
            Dealer_Login_Session__c logInInfo = new Dealer_Login_Session__c();
            if (listDealerLogin.size()>0) {
                logInInfo.Id = listDealerLogin[0].Id;
                logInInfo.Contact__c = lstContact[0].Id;
                logInInfo.IsLoggedIn__c = True;
                logInInfo.User_Email__c = userName;
                try {
                    update logInInfo;
                } catch (Exception e) {
                    System.debug('Error while upserting Dealer_Login_Session__c: ' + e.getMessage());
                }
            }else{
                logInInfo.Contact__c = lstContact[0].Id;
                logInInfo.IsLoggedIn__c = True;
                logInInfo.User_Email__c = userName;
                try {
                    insert logInInfo;
                } catch (Exception e) {
                    System.debug('Error while upserting Dealer_Login_Session__c: ' + e.getMessage());
                }
            }
           
        } else {
            System.debug('Error: No contact found with provided username and password.');
        }
        return lstContact.size() > 0 ? lstContact[0] : null;
    }

    @AuraEnabled
    public static String checkLoginStatus() {
           String contactId = '';
            List<Dealer_Login_Session__c> loginData = [SELECT IsLoggedIn__c, Contact__c 
                                                       FROM Dealer_Login_Session__c ORDER BY LastModifiedDate DESC
                                                       LIMIT 1
                                                       ];
            
            if (!loginData.isEmpty()) {
                System.debug('IsLoggedIn ' +loginData[0].IsLoggedIn__c);
                if(loginData[0].IsLoggedIn__c){
                    return contactId = loginData[0].Contact__c;
                }
                
            }
        
        return contactId;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> fetchFilteredAccounts(String searchKey) {
        if (String.isNotBlank(searchKey)) {
            searchKey = '%' + searchKey + '%';
            return [SELECT Id, Name, Industry, Phone FROM Account WHERE Name LIKE :searchKey OR Industry LIKE :searchKey OR Phone LIKE :searchKey];
        } else {
            return [SELECT Id, Name, Industry, Phone FROM Account];
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> fetchFilteredContacts(String searchKey) {
        if (String.isNotBlank(searchKey)) {
            searchKey = '%' + searchKey + '%';
            return [SELECT Id, FirstName, LastName, Phone, Email FROM Contact WHERE FirstName LIKE :searchKey OR LastName LIKE :searchKey OR Phone LIKE :searchKey OR Email LIKE :searchKey];
        } else {
            return [SELECT Id, FirstName, LastName, Phone, Email FROM Contact];
        }
    }

    @AuraEnabled
    public static Boolean updateDealerSession() {
        Boolean isLogin = false;
        try {
            Dealer_Login_Session__c[] loginDataList = [SELECT Id, IsLoggedIn__c 
                                                        FROM Dealer_Login_Session__c 
                                                        ORDER BY LastModifiedDate DESC
                                                        LIMIT 1];
    
            if (loginDataList.size() == 1) {
                Dealer_Login_Session__c loginData = loginDataList[0];
                loginData.IsLoggedIn__c = false;
                update loginData;
            } else if (loginDataList.isEmpty()) {
                System.debug('No Dealer_Login_Session__c record found.');
            } else {
                System.debug('Multiple Dealer_Login_Session__c records found. Unable to determine which one to update.');
            }
        } catch (Exception e) {
            isLogin = true;
            System.debug('Exception while updating: ' + e.getMessage());
        }
        return isLogin;
    }
    
}