var config = {};

// self explanatory, your application name, descriptions, etc
config.appName = 'Svalinn';
config.appDescription = 'ICONation Wallet';
config.appSlogan = 'By ICONists, For ICONists';
config.appId = 'org.iconation.svalinn';
config.appGitRepo = 'https://github.com/ICONation/svalinn';

// default port number for your daemon (e.g. TurtleCoind)
config.daemonDefaultRpcPort = 11898;

// wallet file created by this app will have this extension
config.walletFileDefaultExt = 'icx';

// change this to match your wallet service executable filename
config.walletServiceBinaryFilename = 'turtle-service';

// version on the bundled service (turtle-service)
config.walletServiceBinaryVersion = "v0.12.0";

// config file format supported by wallet service, possible values:
// ini -->  for turtle service (or its forks) version <= v0.8.3
// json --> for turtle service (or its forks) version >= v0.8.4
config.walletServiceConfigFormat = "json";

// default port number for your wallet service (e.g. turtle-service)
config.walletServiceRpcPort = 8070;

// block explorer url, the [[TX_HASH]] will be substituted w/ actual transaction hash
config.blockExplorerUrl = 'https://explorer.turtlecoin.lol/transaction.html?hash=[[TX_HASH]]';

// default remote node to connect to, set this to a known reliable node for 'just works' user experience
config.remoteNodeDefaultHost = 'turtlenode.co';

// remote node list update url, set to null if you don't have one
config.remoteNodeListUpdateUrl = 'https://raw.githubusercontent.com/turtlecoin/turtlecoin-nodes-json/master/turtlecoin-nodes.json';

// fallback remote node list, in case fetching update failed, fill this with known to works remote nodes
config.remoteNodeListFallback = [
  'turtlenode.co:11898',
  'nodes.hashvault.pro:11898',
  'turtle.mine.nu:11898',
];

// your currency name
config.assetName = 'ICX';
// your currency ticker
config.assetTicker = 'ICX';
// your currency address prefix, for address validation
config.addressPrefix = 'hx';
// standard wallet address length, for address validation
config.addressLength = 42;

// minimum fee for sending transaction
config.minimumFee = 0.1;
// minimum amount for sending transaction
config.mininumSend = 0.1;
// default mixin/anonimity for transaction
config.defaultMixin = 3;
// to convert from atomic unit
config.decimalDivisor = 100;
// to represent human readable value
config.decimalPlaces = 2;

// obfuscate address book entries, set to false if you want to save it in plain json file.
// not for security because the encryption key is attached here
config.addressBookObfuscateEntries = true;
// key use to obfuscate address book contents
config.addressBookObfuscationKey = '79009fb00ca1b7130832a42de45142cf6c4b7f333fe6fba5';
// initial/sample entries to fill new address book
config.addressBookSampleEntries = [
  {
    name: 'ICONation Donation',
    address: 'hxbaa0aa5664c198e59f9913a920f5c2f0629a42c8',
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
