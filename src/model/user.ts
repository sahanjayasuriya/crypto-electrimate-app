export class User {
  private _email: string;
  private _password: string;
  private _displayName: string;
  private _phoneNumber: string;
  private _photoURL: string;

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get displayName(): string {
    return this._displayName;
  }

  set displayName(value: string) {
    this._displayName = value;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get photoURL(): string {
    return this._photoURL;
  }

  set photoURL(value: string) {
    this._photoURL = value;
  }
}
