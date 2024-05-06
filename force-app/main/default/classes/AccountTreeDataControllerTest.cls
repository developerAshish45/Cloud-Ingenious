@isTest
public class AccountTreeDataControllerTest {

    @isTest
    static void testGetAccountsHierarchy_NoChildAccounts() {
        Account acc = new Account();
        acc.Name = 'New Account';
        insert acc;
        
        Account accNew = new Account();
        accNew.Name = 'New Account';
        accNew.RecordTypeId = '0123t0000013sPkAAI';
        insert accNew;
        
        Account testAccount = new Account();
        testAccount.Name = 'Test Account';
        testAccount.Buying_Group__c = acc.Id;
        testAccount.Associated_Dealer__c = acc.Id;
        testAccount.Associated_Consultant__c = acc.Id;
        testAccount.Associated_Corporate_Chain__c = acc.Id;
        testAccount.Sales_Rep_2__c = accNew.Id;
        testAccount.Dealer__c = acc.Id;
        testAccount.End_User_Account__c = acc.Id;
        testAccount.Rep_Group__c = acc.Id;
        testAccount.RSM_REP__c = accNew.Id;
        testAccount.ParentId = acc.Id;
        insert testAccount;
        List<Map<String, Object>> hierarchyList = AccountTreeDataController.getAccountsHierarchy(testAccount.Id);
        System.assertEquals('Test Account', hierarchyList[0].get('key'), 'Key of the node should match the account name');
        System.assert(hierarchyList[0].get('parent') == null, 'Parent of the node should be null');
    }
}