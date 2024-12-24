import {
  PublicClientApplication,
  AuthenticationResult,
  AccountInfo,
  EndSessionRequest,
  RedirectRequest,
  PopupRequest,
} from '@azure/msal-browser';

import {MSAL_CONFIG} from './azure-authentication-config';

export class AzureAuthenticationContext {
  private myMSALObj: PublicClientApplication = new PublicClientApplication(
    MSAL_CONFIG,
  );
  private account?: AccountInfo;
  private loginRedirectRequest?: RedirectRequest;
  private loginRequest?: PopupRequest;

  public isAuthenticationConfigured = false;

  constructor() {
    // @ts-ignore
    this.account = null;
    this.setRequestObjects();
    if (MSAL_CONFIG?.auth?.clientId) {
      this.isAuthenticationConfigured = true;
    }
  }

  private setRequestObjects(): void {
    this.loginRequest = {
      scopes: [],
      prompt: 'select_account',
    };

    this.loginRedirectRequest = {
      ...this.loginRequest,
      redirectStartPage: window.location.href,
    };
  }

  async login(signInType: string): Promise<any> {
    if (signInType === 'loginPopup') {
      try {
        const response: AuthenticationResult = await this.myMSALObj.loginPopup(
          this.loginRequest,
        );
        if (response !== null && response.account !== null) {
          this.account = response.account;
        } else {
          this.account = this.getAccount();
        }
        return this.account;
      } catch (error) {
        console.error('LOGIN_VIA_MICROSOFT: ', error);
        return undefined;
      }

      // this.myMSALObj
      //   .loginPopup(this.loginRequest)
      //   .then((resp: AuthenticationResult) => {
      //     this.handleResponse(resp, setUser);
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });
    } else if (signInType === 'loginRedirect') {
      this.myMSALObj.loginRedirect(this.loginRedirectRequest);
    }
  }

  logout(account: AccountInfo): void {
    const logOutRequest: EndSessionRequest = {
      account,
    };

    this.myMSALObj.logout(logOutRequest);
  }

  handleResponse(response: AuthenticationResult, incomingFunction: any) {
    if (response !== null && response.account !== null) {
      this.account = response.account;
    } else {
      this.account = this.getAccount();
    }

    return this.account;
    //   if (this.account) {
    //     incomingFunction(this.account);
    //   }
  }

  private getAccount(): AccountInfo | undefined {
    const currentAccounts = this.myMSALObj.getAllAccounts();
    if (currentAccounts === null) {
      // @ts-ignore
      console.log('No accounts detected');
      return undefined;
    }

    if (currentAccounts.length > 1) {
      // TBD: Add choose account code here
      // @ts-ignore
      console.log(
        'Multiple accounts detected, need to add choose account code.',
      );
      return currentAccounts[0];
    } else if (currentAccounts.length === 1) {
      return currentAccounts[0];
    }
  }
}

export default AzureAuthenticationContext;
