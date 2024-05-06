public class UpdateAccountController {
  @InvocableMethod(label='Insert Accounts' description='Inserts the accounts specified and returns the IDs of the new accounts.' category= 'Account')
  public static List<ID> insertAccounts(List<Account> accounts) {
    Database.SaveResult[] results = Database.update(accounts);
    List<ID> accountIds = new List<ID>();
      for (Database.SaveResult result : results) {
      accountIds.add(result.getId());
    }
    return accountIds;
  }
}