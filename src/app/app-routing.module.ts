import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppAccountStatusComponent } from './app-account-status/app-account-status.component';
import { AppAcctAlreadyInUsingComponent } from './app-acct-already-in-using/app-acct-already-in-using.component';
import { AppBvnRegisterComponent } from './app-bvn-register/app-bvn-register.component';
import { AppEmailAccountVerifyComponent } from './app-email-account-verify/app-email-account-verify.component';
import { AppLoanApplicationStatusComponent } from './app-loan-application-status/app-loan-application-status.component';
import { AppLoanNoticesComponent } from './app-loan-notices/app-loan-notices.component';
import { AppLoanPrintPreviewComponent } from './app-loan-print-preview/app-loan-print-preview.component';
import { AppLoanReviewComponent } from './app-loan-review/app-loan-review.component';
import { AppPasswordRestStatusComponent } from './app-password-rest-status/app-password-rest-status.component';
import { AppPasswordComponent } from './app-password/app-password.component';
import { AppPinAuthComponent } from './app-pin-auth/app-pin-auth.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { ClientEditProfileComponent } from './client-edit-profile/client-edit-profile.component';
import { ClientLoanRequestComponent } from './client-loan-request/client-loan-request.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoanAppDetailsComponent } from './loan-app-details/loan-app-details.component';
import { LoanbvnappComponent } from './loan-bvn-app/loan-bvn-app.component';
import { LoanPersonalDetailsComponent } from './loan-personal-details/loan-personal-details.component';
import { Passwordrecoverstep1Component } from './password-recover-step1/password-recover-step1.component';
import { Passwordrecoverstep2Component } from './password-recover-step2/password-recover-step2.component';
import { ProfileUpdatedComponent } from './profile-updated/profile-updated.component';
import { RepaymentsComponent } from './repayments/repayments.component';
import { SignInAcctComponent } from './sign-in-acct/sign-in-acct.component';
import { SignUpAcctComponent } from './signup-acct/signup-acct.component';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { AppLoanDetailsComponent } from './app-loan-details/app-loan-details.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'Home', component: HomepageComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'signin', component: SignInAcctComponent },
  { path: 'appprofile', component: ClientProfileComponent },
  { path: 'signup', component: SignUpAcctComponent },
  { path: 'appeditprofile', component: ClientEditProfileComponent },
  { path: 'forgetpwrd', component: Passwordrecoverstep1Component },
  { path: 'forgetpwrd2', component: Passwordrecoverstep2Component },
  { path: 'twofactorauth', component: TwoFactorAuthComponent },
  { path: 'loanbvnapp', component: LoanbvnappComponent },
  { path: 'loanpersonaldetails', component: LoanPersonalDetailsComponent },
  { path: 'apppasswordreststatus', component: AppPasswordRestStatusComponent },
  { path: 'apploanreview', component: AppLoanReviewComponent },
  { path: 'dashboard', component: ClientDashboardComponent },
  { path: 'apploandetails', component:   AppLoanDetailsComponent},
  { path: 'clientloanRequest', component: ClientLoanRequestComponent },
  { path: 'emailaccountverify', component: AppEmailAccountVerifyComponent },
  { path: 'apploanapplicationStatus', component: AppLoanApplicationStatusComponent },
  { path: 'apppinauthentication', component: AppPinAuthComponent },
  { path: 'apppassworddashboard', component: AppPasswordComponent },
  { path: 'apploannotices', component: AppLoanNoticesComponent },
  { path: 'apploanprintpreview', component: AppLoanPrintPreviewComponent },
  { path: 'loanappdetails', component: LoanAppDetailsComponent },
  { path: 'profileupdated', component: ProfileUpdatedComponent }, 
  { path: 'appstatus', component: AppAccountStatusComponent },
  { path: 'acctalreadyinusing', component: AppAcctAlreadyInUsingComponent },
  { path: 'appbvnregister', component: AppBvnRegisterComponent },
  { path: 'repayments', component: RepaymentsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
