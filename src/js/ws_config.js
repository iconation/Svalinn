var config = {};

// self explanatory, your application name, descriptions, etc
config.appName = 'Svalinn';
config.appDescription = 'ICONation ICX Wallet';
config.appSlogan = 'Svalinn';
config.appId = 'org.iconation.svalinn';
config.appGitRepo = 'https://github.com/ICONation/svalinn';

// wallet file created by this app will have this extension
config.walletFileDefaultExt = 'icx';
// transaction file created by this app will have this extension
config.transactionFileDefaultExt = 'tx';

// your currency name
config.assetName = 'ICX';
// your currency ticker
config.assetTicker = 'ICX';
// your currency address prefix, for address validation
config.addressPrefix = 'hx';
// standard wallet address length, for address validation
config.addressLength = 42;

// minimum fee for sending transaction
config.minimumFee = 100000;
// minimum amount for sending transaction
config.mininumSend = 0.0;
// to represent human readable value
config.decimalPlaces = 18;

// obfuscate address book entries, set to false if you want to save it in plain json file.
// not for security because the encryption key is attached here
config.addressBookObfuscateEntries = true;
// key use to obfuscate address book contents
config.addressBookObfuscationKey = '79009fb00ca1b7130832a42de45142cf6c4b7f333fe6fba5';
// initial/sample entries to fill new address book
config.addressBookSampleEntries = [
  {
    name: 'ICONation Donation Wallet',
    address: 'cx87fda925272496ae3f0bdeb551dad8fd29e0c7cf',
    paymentId: '',
  }
];
// cipher config for private address book
config.addressBookCipherConfig = {
  algorithm: 'aes-256-gcm',
  saltLenght: 128,
  pbkdf2Rounds: 10000,
  pbkdf2Digest: 'sha512'
};

module.exports = config;
