export class AccountInfoDtoyy {
}


export interface AccountInfoDto {

    Id : BigInteger,
    PersonId :BigInteger,
    Username : string,
    Email : string,
    Password : string,
    Status : string,
    LastLoginDate : any,

    CreatedDate : any,
    AccountType : string,
    AllowLoginTwoFactor : boolean,
}


export class AccountDetailsDto
{
    public  FirstName :string| undefined
    public  MiddleName :string| undefined
    public  LastName :string | undefined
    public  Gender:string| undefined
    public  Age :string| undefined
    public  CurrentAddress :string| undefined

    public  Address :string| undefined
    public  Email :string| undefined
    public  Phone :string| undefined
    public  AltPhone :string| undefined

    public  AccountType :string| undefined
    public  AccountId :string | undefined
}
