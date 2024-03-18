import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppAccountStatusComponent } from './app-account-status/app-account-status.component';
import { AppAcctAlreadyInUsingComponent } from './app-acct-already-in-using/app-acct-already-in-using.component';
import { AppBasedComponent } from './app-based/app-based.component';
import { AppBvnRegisterComponent } from './app-bvn-register/app-bvn-register.component';
import { AppEmailAccountVerifyComponent } from './app-email-account-verify/app-email-account-verify.component';
import { AppFooterViewsComponent } from './app-footer-views/app-footer-views.component';
import { AppHeaderViewsComponent } from './app-header-views/app-header-views.component';
import { AppLoanApplicationStatusComponent } from './app-loan-application-status/app-loan-application-status.component';
import { AppLoanDetailsComponent } from './app-loan-details/app-loan-details.component';
import { AppLoanNoticesComponent } from './app-loan-notices/app-loan-notices.component';
import { AppLoanPrintPreviewComponent } from './app-loan-print-preview/app-loan-print-preview.component';
import { AppLoanReviewComponent } from './app-loan-review/app-loan-review.component';
import { AppNewLoanAuthComponent } from './app-new-loan-auth/app-new-loan-auth.component';
import { AppPasswordComponent } from './app-password/app-password.component';
import { AppPasswordRestStatusComponent } from './app-password-rest-status/app-password-rest-status.component';
import { AppPinAuthComponent } from './app-pin-auth/app-pin-auth.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { ClientEditProfileComponent } from './client-edit-profile/client-edit-profile.component';
import { ClientLoanRequestComponent } from './client-loan-request/client-loan-request.component';
import { ClientMenuComponent } from './client-menu/client-menu.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { ClientTopComponent } from './client-top/client-top.component';
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
import { SpinnerComponent } from './spinner/spinner.component';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LapoLoanApiService } from './datatableservicehelper/lapo-loan-api.service';

@NgModule({
  declarations: [
    AppComponent,
    AppAccountStatusComponent,
    AppAcctAlreadyInUsingComponent,
    AppBasedComponent,
    AppBvnRegisterComponent,
    AppEmailAccountVerifyComponent,
    AppFooterViewsComponent,
    AppHeaderViewsComponent,
    AppLoanApplicationStatusComponent,
    AppLoanDetailsComponent,
    AppLoanNoticesComponent,
    AppLoanPrintPreviewComponent,
    AppLoanReviewComponent,
    AppNewLoanAuthComponent,
    AppPasswordComponent,
    AppPasswordRestStatusComponent,
    AppPinAuthComponent,
    ClientDashboardComponent,
    ClientEditProfileComponent,
    ClientLoanRequestComponent,
    ClientMenuComponent,
    ClientProfileComponent,
    ClientTopComponent,
    HomepageComponent,
    LoanAppDetailsComponent,
    LoanbvnappComponent,
    LoanPersonalDetailsComponent,
    Passwordrecoverstep1Component,
    Passwordrecoverstep2Component,
    ProfileUpdatedComponent,
    RepaymentsComponent,
    SignInAcctComponent,
    SignUpAcctComponent,
    SpinnerComponent,
    TwoFactorAuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    // NgxSpinnerModule,
    // HttpModule,
  ],
  providers: [
    provideClientHydration(), LapoLoanApiService, { provide: 'Window', useValue: Window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
