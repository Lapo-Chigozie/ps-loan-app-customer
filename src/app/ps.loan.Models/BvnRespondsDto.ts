import { AccountDetailsDto } from "./AccountInfoDto";
import { LoanAppDto } from "./LoanAppDto";
import { PersonalDetailsDto } from "./PersonalDetailsDto";

export class BvnRespondsDto {

      ResponseCode :string | undefined;
      BVN :string | undefined;
      FirstName  :string | undefined;
      MiddleName  :string | undefined;
      LastName :string | undefined;
      DateOfBirth  :string | undefined;
      RegistrationDate  :string | undefined;
      EnrollmentBank :string | undefined;
      EnrollmentBranch  :string | undefined;
      PhoneNumber1  :string | undefined;
      WatchListed  :string | undefined;
}

export class NewLoanAppDto {

   public   BvnDetail :BvnRespondsDto | undefined;
   public    AcctDetail :AccountDetailsDto | undefined;
   public    ClientDetail :PersonalDetailsDto | undefined;
   public   LoanDetailsData :LoanAppDto | undefined;
}
