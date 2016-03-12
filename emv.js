var util = require('./util.js');

var emv_tags = [
	//  { 'tag': '', 'name' : '', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': ''},	
	{ 'tag': '4F', 'name' : 'Application Identifier (AID) – card', 'source' : 'ICC', 'format' : 'b', 'template' : '61', 'length' : '4-5', 'p/c' : 'primitive', 'description': 'Identifies the application as described in ISO/IEC 7816-5'},
	{ 'tag': '42', 'name' : 'Issuer Identification Number (IIN)', 'source' : 'ICC', 'format' : 'n6', 'template' : 'BF0C or 73', 'length' : '', 'p/c' : 'primitive', 'description': 'The number that identifies the major industry and the card issuer and that forms the first part of the Primary Account Number (PAN)' },
	{ 'tag': '50', 'name' : 'Application Label', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Mnemonic associated with the AID according to ISO/IEC 7816-5'},
	{ 'tag': '57', 'name' : 'Track 2 Equivalent Data', 'source' : 'ICC', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Contains the data elements of track 2 according to ISO/IEC 7813, excluding start sentinel, end sentinel, and Longitudinal Redundancy Check (LRC), as follows: Primary Account Number (n, var. up to 19) Field Separator (Hex \'D\') (b) Expiration Date (YYMM) (n 4) Service Code (n 3) Discretionary Data (defined by individual payment systems) (n, var.) Pad with one Hex \'F\' if needed to ensure whole bytes (b)' },
	{ 'tag': '5A', 'name' : 'Application Primary Account Number (PAN)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Valid cardholder account number' },
	{ 'tag': '61', 'name' : 'Application Template', 'source' : 'ICC', 'format' : 'b', 'template' : '', 'length' : '', 'p/c' : 'constructed', 'description': 'Contains one or more data objects relevant to an application directory entry according to ISO/IEC 7816-5' },
	{ 'tag': '6F', 'name' : 'File Control Information (FCI) Template', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies the FCI template according to ISO/IEC 7816-4'},
	{ 'tag': '71', 'name' : 'Issuer Script Template 1', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Contains proprietary issuer data for transmission to the ICC before the second GENERATE AC command'},
	{ 'tag': '72', 'name' : 'Issuer Script Template 2', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Contains proprietary issuer data for transmission to the ICC after the second GENERATE AC command'},
	{ 'tag': '73', 'name' : 'Directory Discretionary Template', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Issuer discretionary part of the directory according to ISO/IEC 7816-5'},
	{ 'tag': '77', 'name' : 'Response Message Template Format 2', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Contains the data objects (with tags and lengths) returned by the ICC in response to a command' },	
	{ 'tag': '80', 'name' : 'Response Message Template Format 1', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Contains the data objects (without tags and lengths) returned by the ICC in response to a command'},
	{ 'tag': '81', 'name' : 'Amount, Authorised (Binary)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Authorised amount of the transaction (excluding adjustments)' },
	{ 'tag': '82', 'name' : 'Application Interchange Profile', 'source' : 'ICC', 'format' : 'b', 'template' : '77 or 80', 'length' : '2', 'p/c' : 'primitive', 'description': 'Indicates the capabilities of the card to support specific functions in the application' },
	{ 'tag': '83', 'name' : 'Command Template', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies the data field of a command message'},
	{ 'tag': '84', 'name' : 'Dedicated File (DF) Name', 'source' : 'ICC', 'format' : 'b', 'template' : '6F', 'length' : '5-16', 'p/c' : 'primitive', 'description': 'Identifies the name of the DF as described in ISO/IEC 7816-4' },
	{ 'tag': '86', 'name' : 'Issuer Script Command', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Contains a command for transmission to the ICC'},
	{ 'tag': '87', 'name' : 'Application Priority Indicator', 'source' : 'ICC', 'format' : 'b', 'template' : '6F', 'length' : '1', 'p/c' : 'primitive', 'description': '' },
	{ 'tag': '8A', 'name' : 'Authorisation Response Code', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Code that defines the disposition of a message' },
	{ 'tag': '8C', 'name' : 'Card Risk Management Data Object List 1 (CDOL1)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'List of data objects (tag and length) to be passed to the ICC in the first GENERATE AC command' },
	{ 'tag': '8D', 'name' : 'Card Risk Management Data Object List 2 (CDOL2)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'List of data objects (tag and length) to be passed to the ICC in the second GENERATE AC command' },
	{ 'tag': '8E', 'name' : 'Cardholder Verification Method (CVM) List', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies a method of verification of the cardholder supported by the application' },	
	{ 'tag': '8F', 'name' : 'Certification Authority Public Key Index', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies the certification authority’s public key in conjunction with the RID' },
	{ 'tag': '90', 'name' : 'Issuer Public Key Certificate', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Issuer public key certified by a certification authority'},	
	{ 'tag': '91', 'name' : 'Issuer Authentication Data', 'source' : 'Issuer', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Data sent to the ICC for online issuer authentication' },
	{ 'tag': '92', 'name' : 'Issuer Public Key Remainder', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Remaining digits of the Issuer Public Key Modulus'},	
	{ 'tag': '93', 'name' : 'Signed Static Application Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Digital signature on critical application parameters for SDA' },
	{ 'tag': '94', 'name' : 'Application File Locator (AFL)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the location (SFI, range of records) of the AEFs related to a given application' },
	{ 'tag': '95', 'name' : 'Terminal Verification Results', 'source' : 'Terminal', 'format' : '', 'template' : '', 'length' : '5', 'p/c' : 'primitive', 'description': 'Status of the different functions as seen from the terminal' },
	{ 'tag': '97', 'name' : 'Transaction Certificate Data Object List (TDOL)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'List of data objects (tag and length) to be used by the terminal in generating the TC Hash Value' },	
	{ 'tag': '98', 'name' : 'Transaction Certificate (TC) Hash Value', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Result of a hash function specified in Book 2, Annex B3.1'},
	{ 'tag': '99', 'name' : 'Transaction Personal Identification Number (PIN) Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Data entered by the cardholder for the purpose of the PIN verification'},
	{ 'tag': '9A', 'name' : 'Transaction Date', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': '' },
	{ 'tag': '9B', 'name' : 'Transaction Status Information', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the functions performed in a transaction' },
	{ 'tag': '9C', 'name' : 'Transaction Type', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the type of financial transaction, represented by the first two digits of ISO 8583:1987 Processing Code' },
	{ 'tag': '9D', 'name' : 'Directory Definition File (DDF) Name', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies the name of a DF associated with a directory'},
	{ 'tag': 'A5', 'name' : 'File Control Information (FCI) Proprietary Template', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies the data object proprietary to this specification in the FCI template according to ISO/IEC 7816-4' },	
	{ 'tag': '5F20', 'name' : 'Cardholder Name', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates cardholder name according to ISO 7813' },
	{ 'tag': '5F24', 'name' : 'Application Expiration Date', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Date after which application expires' },
	{ 'tag': '5F25', 'name' : 'Application Effective Date', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Date from which the application may be used' },
	{ 'tag': '5F28', 'name' : 'Issuer Country Code', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the country of the issuer according to ISO 3166' },
	{ 'tag': '5F30', 'name' : 'Service Code', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Service code as defined in ISO/IEC 7813 for track 1 and track 2' },
	{ 'tag': '5F34', 'name' : 'Application Primary Account Number (PAN) Sequence Number', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies and differentiates cards with the same PAN' },
	{ 'tag': '5F36', 'name' : 'Transaction Currency Exponent', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the implied position of the decimal point from the right of the transaction amount represented according to ISO 4217'},
	{ 'tag': '5F53', 'name' : 'International Bank Account Number (IBAN)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Uniquely identifies the account of a customer at a financial institution as defined in ISO 13616.'},
	{ 'tag': '5F55', 'name' : 'Issuer Country Code (alpha2 format)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the country of the issuer as defined in ISO 3166 (using a 2 character alphabetic code)'},
	{ 'tag': '5F56', 'name' : 'Issuer Country Code (alpha3 format)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the country of the issuer as defined in ISO 3166 (using a 3 character alphabetic code)'},
	{ 'tag': '5F2A', 'name' : 'Transaction Currency Code', 'source' : 'Terminal', 'format' : 'n3', 'template' : '', 'length' : '2', 'p/c' : 'primitive', 'description': 'Indicates the currency code of the transaction according to ISO 4217' },
	{ 'tag': '5F2D', 'name' : 'Language Preference', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': '1–4 languages stored in order of preference, each represented by 2 alphabetical characters according to ISO 639 Note: EMVCo strongly recommends that cards be personalised with data element \'5F2D\' coded in lowercase, but that terminals accept the data element whether it is coded in upper or lower case.' },	
	{ 'tag': '9F01', 'name' : 'Acquirer Identifier', 'source' : 'Terminal', 'format' : 'n 6–11', 'template' : '', 'length' : '6', 'p/c' : 'primitive', 'description': 'Uniquely identifies the acquirer within each payment system' },	
	{ 'tag': '9F02', 'name' : 'Amount, Authorised (Numeric)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Authorised amount of the transaction (excluding adjustments)' },
	{ 'tag': '9F03', 'name' : 'Amount, Other (Numeric)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Secondary amount associated with the transaction representing a cashback amount' },	
	{ 'tag': '9F04', 'name' : 'Amount, Other (Binary)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Secondary amount associated with the transaction representing a cashback amount' },
	{ 'tag': '9F05', 'name' : 'Application Discretionary Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Issuer or payment system specified data relating to the application' },	
	{ 'tag': '9F06', 'name' : 'Application Identifier (AID) – terminal', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies the application as described in ISO/IEC 7816-5	' },
	{ 'tag': '9F07', 'name' : 'Application Usage Control', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates issuer’s specified restrictions on the geographic usage and services allowed for the application' },	
	{ 'tag': '9F08', 'name' : 'Application Version Number', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Version number assigned by the payment system for the application' },
	{ 'tag': '9F09', 'name' : 'Application Version Number', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Version number assigned by the payment system for the application' },
	{ 'tag': '9F10', 'name' : 'Issuer Application Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : 'primitive', 'description': '' },	
	{ 'tag': '9F11', 'name' : 'Issuer Code Table Index', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the code table according to ISO/IEC 8859 for displaying the Application Preferred Name' },
	{ 'tag': '9F12', 'name' : 'Application Preferred Name', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Preferred mnemonic associated with the AID' },	
	{ 'tag': '9F13', 'name' : 'Last Online Application Transaction Counter (ATC) Register', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'ATC value of the last transaction that went online' },
	{ 'tag': '9F14', 'name' : 'Lower Consecutive Offline Limit', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Issuer-specified preference for the maximum number of consecutive offline transactions for this ICC application allowed in a terminal with online capability' },	
	{ 'tag': '9F15', 'name' : 'Merchant Category Code', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Classifies the type of business being done by the merchant, represented according to ISO 8583:1993 for Card Acceptor Business Code' },
	{ 'tag': '9F17', 'name' : 'Personal Identification Number (PIN) Try Counter', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Number of PIN tries remaining' },
	{ 'tag': '9F18', 'name' : 'Issuer Script Identifier', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identification of the Issuer Script' },
	{ 'tag': '9F0B', 'name' : 'Cardholder Name Extended', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the whole cardholder name when greater than 26 characters using the same coding convention as in ISO 7813' },
	{ 'tag': '9F0D', 'name' : 'Issuer Action Code – Default', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Specifies the issuer’s conditions that cause a transaction to be rejected if it might have been approved online, but the terminal is unable to process the transaction online' },
	{ 'tag': '9F0E', 'name' : 'Issuer Action Code – Denial', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Specifies the issuer’s conditions that cause the denial of a transaction without attempt to go online' },
	{ 'tag': '9F0F', 'name' : 'Issuer Action Code – Online', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Specifies the issuer’s conditions that cause a transaction to be transmitted online' },
	{ 'tag': '9F1A', 'name' : 'Terminal Country Code', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the country of the terminal, represented according to ISO 3166' },
	{ 'tag': '9F1E', 'name' : 'Interface Device (IFD) Serial Number', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Unique and permanent serial number assigned to the IFD by the manufacturer' },
	{ 'tag': '9F1F', 'name' : 'Track 1 Discretionary Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Discretionary part of track 1 according to ISO/IEC 7813' },
	{ 'tag': '9F20', 'name' : 'Track 2 Discretionary Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Discretionary part of track 2 according to ISO/IEC 7813' },
	{ 'tag': '9F21', 'name' : 'Transaction Time', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Local time that the transaction was authorised' },
	{ 'tag': '9F22', 'name' : 'Certification Authority Public Key Index', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Identifies the certification authority’s public key in conjunction with the RID' },
	{ 'tag': '9F23', 'name' : 'Upper Consecutive Offline Limit', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Issuer-specified preference for the maximum number of consecutive offline transactions for this ICC application allowed in a terminal without online capability'},	
	{ 'tag': '9F26', 'name' : 'Application Cryptogram', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Cryptogram returned by the ICC in response of the GENERATE AC command' },
	{ 'tag': '9F27', 'name' : 'Cryptogram Information Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the type of cryptogram and the actions to be performed by the terminal' },
	{ 'tag': '9F2D', 'name' : 'Integrated Circuit Card (ICC) PIN Encipherment Public Key Certificate', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'ICC PIN Encipherment Public Key certified by the issuer'},	
	{ 'tag': '9F2E', 'name' : 'Integrated Circuit Card (ICC) PIN Encipherment Public Key Exponent', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'ICC PIN Encipherment Public Key Exponent used for PIN encipherment'},
	{ 'tag': '9F2F', 'name' : 'Integrated Circuit Card (ICC) PIN Encipherment Public Key Remainder', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Remaining digits of the ICC PIN Encipherment Public Key Modulus' },
	{ 'tag': '9F32', 'name' : 'Issuer Public Key Exponent', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Issuer public key exponent used for theverification of the Signed Static Application Data and the ICC Public Key Certificate' },	
	{ 'tag': '9F33', 'name' : 'Terminal Capabilities', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the card data input, CVM, and security capabilities of the terminal' },	
	{ 'tag': '9F34', 'name' : 'Cardholder Verification Method (CVM) Results', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the results of the last CVM performed' },
	{ 'tag': '9F35', 'name' : 'Terminal Type', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the environment of the terminal, its communications capability, and its operational control' },	
	{ 'tag': '9F36', 'name' : 'Application Transaction Counter (ATC)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Counter maintained by the application in the ICC (incrementing the ATC is managed by the ICC)' },	
	{ 'tag': '9F37', 'name' : 'Unpredictable Number', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Value to provide variability and uniqueness to the generation of a cryptogram' },	
	{ 'tag': '9F38', 'name' : 'Processing Options Data Object List (PDOL)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Contains a list of terminal resident data objects (tags and lengths) needed by the ICC in processing the GET PROCESSING OPTIONS command' },
	{ 'tag': '9F39', 'name' : 'Point-of-Service (POS) Entry Mode', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the method by which the PAN was entered, according to the first two digits of the ISO 8583:1987 POS Entry Mode' },
	{ 'tag': '9F3B', 'name' : 'Application Reference Currency', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': '1–4 currency codes used between the terminal and the ICC when the Transaction Currency Code is different from the Application Currency Code; each code is 3 digits according to ISO 4217' },
	{ 'tag': '9F3A', 'name' : 'Amount, Reference Currency', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Authorised amount expressed in the reference currency' },
	{ 'tag': '9F3C', 'name' : 'Transaction Reference Currency Code', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Code defining the common currency used by the terminal in case the Transaction Currency Code is different from the Application Currency Code' },
	{ 'tag': '9F3D', 'name' : 'Transaction Reference Currency Exponent', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the implied position of the decimal point from the right of the transaction amount, with the Transaction Reference Currency Code represented according to ISO 4217' },
	{ 'tag': '9F40', 'name' : 'Additional Terminal Capabilities', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the data input and output capabilities of the terminal' },
	{ 'tag': '9F41', 'name' : 'Transaction Sequence Counter', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Counter maintained by the terminal that is incremented by one for each transaction' },
	{ 'tag': '9F42', 'name' : 'Application Currency Code', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the currency in which the account is managed according to ISO 4217' },
	{ 'tag': '9F43', 'name' : 'Application Reference Currency Exponent', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the implied position of the decimal point from the right of the amount, for each of the 1–4 reference currencies represented according to ISO 4217' },
	{ 'tag': '9F44', 'name' : 'Application Currency Exponent', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the implied position of the decimal point from the right of the amount represented according to ISO 4217' },	
	{ 'tag': '9F45', 'name' : 'Data Authentication Code', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'An issuer assigned value that is retained by the terminal during the verification process of the Signed Static Application Data'},
	{ 'tag': '9F46', 'name' : 'Integrated Circuit Card (ICC) Public Key Certificate', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'ICC Public Key certified by the issuer' },
	{ 'tag': '9F47', 'name' : 'Integrated Circuit Card (ICC) Public Key Exponent', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'ICC Public Key Exponent used for the verification of the Signed Dynamic Application Data' },
	{ 'tag': '9F48', 'name' : 'Integrated Circuit Card (ICC) Public Key Remainder', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Remaining digits of the ICC Public Key Modulus' },	
	{ 'tag': '9F49', 'name' : 'Dynamic Data Authentication Data Object List (DDOL)', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'List of data objects (tag and length) to be passed to the ICC in the INTERNAL AUTHENTICATE command'},
	{ 'tag': '9F4A', 'name' : 'Static Data Authentication Tag List', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'List of tags of primitive data objects defined in this specification whose value fields are to be included in the Signed Static or Dynamic Application Data' },
	{ 'tag': '9F4B', 'name' : 'Signed Dynamic Application Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Digital signature on critical application parameters for DDA or CDA' },
	{ 'tag': '9F4C', 'name' : 'ICC Dynamic Number', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Time-variant number generated by the ICC, to be captured by the terminal'},
	{ 'tag': '9F4D', 'name' : 'Log Entry', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Provides the SFI of the Transaction Log file and its number of records' },
	{ 'tag': '9F4E', 'name' : 'Merchant Name and Location', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Indicates the name and location of the merchant' },
	{ 'tag': '9F4F', 'name' : 'Log Format', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'List (in tag and length format) of data objects representing the logged data elements that are passed to the terminal when a transaction log record is read' },
	{ 'tag': 'BF0C', 'name' : 'File Control Information (FCI) Issuer Discretionary Data', 'source' : '', 'format' : '', 'template' : '', 'length' : '', 'p/c' : '', 'description': 'Issuer discretionary part of the FCI'},
];	

function lookup( tag, callback ){ 
	var found = emv_tags.filter(function(item) {
		if(item.tag == tag)
			return item.name;							
		});
	callback(found);
};



function parse(emv_data, callback){	
	var emv_objects = [];
	while(emv_data.length > 0){
		var tag_bin = util.Hex2Bin(emv_data.substring(0, 2));
		tag_bin = util.pad(tag_bin, 8);
		//console.log(tag_bin);
		var tag_class = tag_bin.substring(0, 2);
		var tag_constructed = tag_bin.substring(2, 3);
		var tag_number = tag_bin.substring(3, 8);
		
		if (tag_number == '11111'){
			//console.log('constructed tag');
			tag_bin = util.Hex2Bin(emv_data.substring(0, 4));
			tag_bin = util.pad(tag_bin, 16);
			tag_number = tag_bin.substring(3, 16);	
		}

		var tag = util.Bin2Hex(tag_class + tag_constructed + tag_number).toUpperCase();	
		var lenHex = emv_data.substring(tag.length, tag.length + 2);

		var lenBin = util.pad(util.Hex2Bin(lenHex), 8);
		if(lenBin.substring(0, 1) == 1){
			console.log('lenHex: ' + lenHex + ' lenBin: '+ lenBin +' ---> len is more than 1 byte');
		 	lenHex = emv_data.substring(tag.length, tag.length + 4);	
		}
		
		var len = util.Hex2Dec(lenHex) * 2;	
		var offset = tag.length + 2 + len;
		var value = emv_data.substring(tag.length + 2, offset);
		
		//console.log(tag + ' ' + lenHex + ' ' + value);		
		emv_objects.push( { 'tag': tag, 'length': lenHex, 'value' : value} );	
		emv_data = emv_data.substring(offset);
	}	

	callback(emv_objects);

};


function describe(emv_data, callback){
	var emv_objects = [];
	parse(emv_data, function(tlv_list){
		if(tlv_list != null){
			for(var i=0; i < tlv_list.length; i++){
				lookup(tlv_list[i].tag,  function(data){
					if(data.length > 0){
						emv_objects.push( { 'tag': tlv_list[i].tag, 'length': tlv_list[i].length, 'value' : tlv_list[i].value, 'description' : data[0].name} );	
					}else{
						emv_objects.push( tlv_list[i] );
					}							
				});
			}
			callback(emv_objects);
		}
	});	
};


function aip(aip_data, callback){
	var aip_bin = util.pad(util.Hex2Bin(aip_data), 16);
	var data = [];
	var Byte1 = [ 
		{ 'bit' : '8' , 'value' : aip_bin.substring(0, 1), 'description' : 'RFU'},
		{ 'bit' : '7' , 'value' : aip_bin.substring(1, 2), 'description' : 'SDA supported'},
		{ 'bit' : '6' , 'value' : aip_bin.substring(2, 3), 'description' : 'DDA supported'},
		{ 'bit' : '5' , 'value' : aip_bin.substring(3, 4), 'description' : 'Cardholder verification supported' } ,
		{ 'bit' : '4' , 'value' : aip_bin.substring(4, 5), 'description' : 'Terminal risk Management to be performed' } ,
		{ 'bit' : '3' , 'value' : aip_bin.substring(5, 6), 'description' : 'Issuer authentication supported'} ,
		{ 'bit' : '2' , 'value' : aip_bin.substring(6, 7), 'description' : 'RFU' } ,
		{ 'bit' : '1' , 'value' : aip_bin.substring(7, 8), 'description' : 'CDA supported'} 
	];
	var Byte2 = [
		{ 'bit' : '8' , 'value' : aip_bin.substring(8, 9),   'description' : 'RFU'},
		{ 'bit' : '7' , 'value' : aip_bin.substring(9, 10),  'description' : 'RFU'},
		{ 'bit' : '6' , 'value' : aip_bin.substring(10, 11), 'description' : 'RFU'},
		{ 'bit' : '5' , 'value' : aip_bin.substring(11, 12), 'description' : 'RFU'},
		{ 'bit' : '4' , 'value' : aip_bin.substring(12, 13), 'description' : 'RFU'},
		{ 'bit' : '3' , 'value' : aip_bin.substring(13, 14), 'description' : 'RFU'},
		{ 'bit' : '2' , 'value' : aip_bin.substring(14, 15), 'description' : 'RFU'},
		{ 'bit' : '1' , 'value' : aip_bin.substring(15, 16), 'description' : 'RFU'},
	];
	data.push(Byte1, Byte2);
	callback(data);
};



function cvm(cvm_data, callback){
	var cvm_bin = util.Hex2Bin(cvm_data);
	var data = [];
	
	data.push(cvm_bin.substring(1, 2) == '0' ? 'Fail cardholder verification if this CVM is unsuccessful' : 'Apply succeeding CV Rule if this CVM is unsuccessful');		

	var cvm_code = cvm_bin.substring(2, 8);
	if(cvm_code == '000000')
	 	data.push('Fail CVM processing');
	else if(cvm_code == '000001')
		data.push('Plaintext PIN verification performed by ICC');
	else if(cvm_code == '000010')
		data.push('Enciphered PIN verified online');
	else if(cvm_code == '000011')
		data.push('Plaintext PIN verification performed by ICC and signature (paper)');
	else if(cvm_code == '000100')
		data.push('Enciphered PIN verification performed by ICC');
	else if(cvm_code == '000101')
		data.push('Enciphered PIN verification performed by ICC and signature (paper)');
	else if(cvm_code == '011110')
		data.push('Signature (paper)');
	else if(cvm_code == '011111')
		data.push('No CVM required');
	else if(cvm_code.startsWith('10'))
		data.push('Values in the range 100000-101111 reserved for use by the individual payment systems');
	else if(cvm_code.startsWith('11'))
		data.push('Values in the range 110000-111110 reserved for use by the issuer');
	else if(cvm_code == '11111')
		data.push('This value is not available for use');


	var condition_code = cvm.substring(2, 4);
	if(condition_code == '00')
		data.push('Condition: Always');
	else if(condition_code == '01')
		data.push('Condition: If unattended cash');
	else if(condition_code == '02')
		data.push('Condition: If not unattended cash and not manual cash and not purchase with cashback');
	else if(condition_code == '03')
		data.push('Condition: If terminal supports the CVM');
	else if(condition_code == '04')
		data.push('Condition: If manual cash');
	else if(condition_code == '05')
		data.push('Condition: If purchase with cashback');
	else if(condition_code == '06')
		data.push('Condition: If transaction is in the application currency 21 and is under X value (see section 10.5 for a discussion of “X”)');
	else if(condition_code == '07')
		data.push('Condition: If transaction is in the application currency and is over X value');
	else if(condition_code == '08')
		data.push('Condition: If transaction is in the application currency and is under Y value (see section 10.5 for a discussion of \'Y\')');
	else if(condition_code == '09')
		data.push('Condition: If transaction is in the application currency and is over Y value');
	else if( util.Hex2Dec('0A') <= util.Hex2Dec(condition_code) && util.Hex2Dec(condition_code) <= util.Hex2Dec('7F'))
		data.push('RFU');
	else if( util.Hex2Dec('80') <= util.Hex2Dec(condition_code) && util.Hex2Dec(condition_code) <= util.Hex2Dec('FF'))
		data.push('Reserved for use by individual payment systems');
	callback(data);
};


function auc(auc_data, callback){
	var auc_bin = util.Hex2Bin(auc_data);
	var data = [];
	var Byte1 = [ 
		{ 'bit' : '8' , 'value' : auc_bin.substring(0, 1), 'description' : 'Valid for domestic cash transactions'},
		{ 'bit' : '7' , 'value' : auc_bin.substring(1, 2), 'description' : 'Valid for international cash transactions'},
		{ 'bit' : '6' , 'value' : auc_bin.substring(2, 3), 'description' : 'Valid for domestic goods'},
		{ 'bit' : '5' , 'value' : auc_bin.substring(3, 4), 'description' : 'Valid for international goods' } ,
		{ 'bit' : '4' , 'value' : auc_bin.substring(4, 5), 'description' : 'Valid for domestic services' } ,
		{ 'bit' : '3' , 'value' : auc_bin.substring(5, 6), 'description' : 'Valid for international services'} ,
		{ 'bit' : '2' , 'value' : auc_bin.substring(6, 7), 'description' : 'Valid at ATMs'} ,
		{ 'bit' : '1' , 'value' : auc_bin.substring(7, 8), 'description' : 'Valid at terminals other than ATMs'} 
	];

	var Byte2 = [
		{ 'bit' : '8' , 'value' : auc_bin.substring(8, 9), 'description' : 'Domestic cashback allowed'},
		{ 'bit' : '7' , 'value' : auc_bin.substring(9, 10), 'description' : 'International cashback allowed'},
		{ 'bit' : '6' , 'value' : auc_bin.substring(10, 11), 'description' : 'RFU'},
		{ 'bit' : '5' , 'value' : auc_bin.substring(11, 12), 'description' : 'RFU'},
		{ 'bit' : '4' , 'value' : auc_bin.substring(12, 13), 'description' : 'RFU'},
		{ 'bit' : '3' , 'value' : auc_bin.substring(13, 14), 'description' : 'RFU'},
		{ 'bit' : '2' , 'value' : auc_bin.substring(14, 15), 'description' : 'RFU'},
		{ 'bit' : '1' , 'value' : auc_bin.substring(15, 16), 'description' : 'RFU'},
		];
	data.push(Byte1, Byte2);
	callback(data);
};


function tsi(tsi_data, callback){
	var tsi_bin = util.Hex2Bin(tsi_data);
	var data = [];
	var Byte1 = [ 
		{ 'bit' : '8' , 'value' : tsi_bin.substring(0, 1), 'description' : 'Offline data authentication was performed' },
		{ 'bit' : '7' , 'value' : tsi_bin.substring(1, 2), 'description' : 'Cardholder verification was performed' },
		{ 'bit' : '6' , 'value' : tsi_bin.substring(2, 3), 'description' : 'Card risk management was performed' },
		{ 'bit' : '5' , 'value' : tsi_bin.substring(3, 4), 'description' : 'Issuer authentication was performed' } ,
		{ 'bit' : '4' , 'value' : tsi_bin.substring(4, 5), 'description' : 'Terminal risk management was performed' } ,
		{ 'bit' : '3' , 'value' : tsi_bin.substring(5, 6), 'description' : 'Script processing was performed' } ,
		{ 'bit' : '2' , 'value' : tsi_bin.substring(6, 7), 'description' : 'RFU' } ,
		{ 'bit' : '1' , 'value' : tsi_bin.substring(7, 8), 'description' : 'RFU' } 
	];

	var Byte2 = [
		{ 'bit' : '8' , 'value' : tsi_bin.substring(8, 9),   'description' : 'RFU' },
		{ 'bit' : '7' , 'value' : tsi_bin.substring(9, 10),  'description' : 'RFU' },
		{ 'bit' : '6' , 'value' : tsi_bin.substring(10, 11), 'description' : 'RFU' },
		{ 'bit' : '5' , 'value' : tsi_bin.substring(11, 12), 'description' : 'RFU' },
		{ 'bit' : '4' , 'value' : tsi_bin.substring(12, 13), 'description' : 'RFU' },
		{ 'bit' : '3' , 'value' : tsi_bin.substring(13, 14), 'description' : 'RFU' },
		{ 'bit' : '2' , 'value' : tsi_bin.substring(14, 15), 'description' : 'RFU' },
		{ 'bit' : '1' , 'value' : tsi_bin.substring(15, 16), 'description' : 'RFU' },
	];
	data.push(Byte1, Byte2);
	callback(data);
};

function to_bits(hexData, callback){
	var bin_data = util.Hex2Bin(hexData);
	var data = [];
	var no_bytes = bin_data.length / 8;
	for(var i = 0; i < no_bytes; i++){
		var str = '{ byte : '+ i + ', bits : ['; 
		for(var j = 0; j < 8; j++){
			str += ' { bit : '+ j + ', value : ' + bin_data.substring(i, i + 1) + ' }' ;
			if(j != 7) str += ',';
		}
		str += ']}'
		data.push( str );
	}
	callback(data);
};


function tvr(tvr_data, callback){
	var tvr_bin = util.Hex2Bin(tvr_data);
	var data = [];
	var Byte1 = [ 
		{ 'bit' : '8' , 'value' : tvr_bin.substring(0, 1), 'description' : 'Offline data authentication was not performed' },
		{ 'bit' : '7' , 'value' : tvr_bin.substring(1, 2), 'description' : 'SDA failed' },
		{ 'bit' : '6' , 'value' : tvr_bin.substring(2, 3), 'description' : 'ICC data missing' },
		{ 'bit' : '5' , 'value' : tvr_bin.substring(3, 4), 'description' : 'Card appears on terminal exception file' },
		{ 'bit' : '4' , 'value' : tvr_bin.substring(4, 5), 'description' : 'DDA failed' },
		{ 'bit' : '3' , 'value' : tvr_bin.substring(5, 6), 'description' : 'CDA failed' },
		{ 'bit' : '2' , 'value' : tvr_bin.substring(6, 7), 'description' : 'RFU' },
		{ 'bit' : '1' , 'value' : tvr_bin.substring(7, 8), 'description' : 'RFU' }
	]; 

	var Byte2 = [
		{ 'bit' : '8' , 'value' : tvr_bin.substring(8, 9),   'description' : 'ICC and terminal have different application versions' },
		{ 'bit' : '7' , 'value' : tvr_bin.substring(9, 10),  'description' : 'Expired application' },
		{ 'bit' : '6' , 'value' : tvr_bin.substring(10, 11), 'description' : 'Application not yet effective' },
		{ 'bit' : '5' , 'value' : tvr_bin.substring(11, 12), 'description' : 'Requested service not allowed for card product' },
		{ 'bit' : '4' , 'value' : tvr_bin.substring(12, 13), 'description' : 'New card' },
		{ 'bit' : '3' , 'value' : tvr_bin.substring(13, 14), 'description' : 'RFU' },
		{ 'bit' : '2' , 'value' : tvr_bin.substring(14, 15), 'description' : 'RFU' },
		{ 'bit' : '1' , 'value' : tvr_bin.substring(15, 16), 'description' : 'RFU' }
	];

	var Byte3 = [
		{ 'bit' : '8' , 'value' : tvr_bin.substring(16, 17), 'description' : 'Cardholder verification was not successful' },
		{ 'bit' : '7' , 'value' : tvr_bin.substring(17, 18), 'description' : 'Unrecognised CVM' },
		{ 'bit' : '6' , 'value' : tvr_bin.substring(18, 19), 'description' : 'PIN Try Limit exceeded' },
		{ 'bit' : '5' , 'value' : tvr_bin.substring(19, 20), 'description' : 'PIN entry required and PIN pad not present or not working' },
		{ 'bit' : '4' , 'value' : tvr_bin.substring(20, 21), 'description' : 'PIN entry required, PIN pad present, but PIN was not entered' },
		{ 'bit' : '3' , 'value' : tvr_bin.substring(21, 22), 'description' : 'Online PIN entered' },
		{ 'bit' : '2' , 'value' : tvr_bin.substring(22, 23), 'description' : 'RFU' },
		{ 'bit' : '1' , 'value' : tvr_bin.substring(23, 24), 'description' : 'RFU' }
	];

	var Byte4 = [
		{ 'bit' : '8' , 'value' : tvr_bin.substring(24, 25), 'description' : 'Transaction exceeds floor limit' },
		{ 'bit' : '7' , 'value' : tvr_bin.substring(25, 26), 'description' : 'Lower consecutive offline limit exceeded' },
		{ 'bit' : '6' , 'value' : tvr_bin.substring(26, 27), 'description' : 'Upper consecutive offline limit exceeded' },
		{ 'bit' : '5' , 'value' : tvr_bin.substring(27, 28), 'description' : 'Transaction selected randomly for online processing' },
		{ 'bit' : '4' , 'value' : tvr_bin.substring(28, 29), 'description' : 'Merchant forced transaction online' },
		{ 'bit' : '3' , 'value' : tvr_bin.substring(29, 30), 'description' : 'RFU' },
		{ 'bit' : '2' , 'value' : tvr_bin.substring(30, 31), 'description' : 'RFU' },
		{ 'bit' : '1' , 'value' : tvr_bin.substring(31, 32), 'description' : 'RFU' }
	];

	var Byte5 = [
		{ 'bit' : '8' , 'value' : tvr_bin.substring(32, 33), 'description' : 'Default TDOL used' },
		{ 'bit' : '7' , 'value' : tvr_bin.substring(33, 34), 'description' : 'Issuer authentication failed' },
		{ 'bit' : '6' , 'value' : tvr_bin.substring(34, 35), 'description' : 'Script processing failed before final GENERATE AC' },
		{ 'bit' : '5' , 'value' : tvr_bin.substring(35, 36), 'description' : 'Script processing failed after final GENERATE AC' },
		{ 'bit' : '4' , 'value' : tvr_bin.substring(36, 37), 'description' : 'RFU' },
		{ 'bit' : '3' , 'value' : tvr_bin.substring(37, 38), 'description' : 'RFU' },
		{ 'bit' : '2' , 'value' : tvr_bin.substring(38, 39), 'description' : 'RFU' },
		{ 'bit' : '1' , 'value' : tvr_bin.substring(39, 40), 'description' : 'RFU' }
	];

	data.push(Byte1, Byte2, Byte3, Byte4, Byte5);
	callback(data);
};



module.exports={
	parse 	 : function(emv_data, callback){ parse(emv_data, callback); },
	describe : function(emv_data, callback){ describe(emv_data, callback); },
	lookup	 : function(emv_tag, callback){ lookup(emv_tag, callback); },
	aip	 	 : function(aip_data, callback){ aip(aip_data, callback); },
	auc		 : function(auc_data, callback){ auc(auc_data, callback); },
	cvm 	 : function(cvm_data, callback){ cvm(cvm_data, callback); },
	tvr 	 : function(tvr_data, callback){ tvr(tvr_data, callback); },
	tsi 	 : function(tsi_data, callback){ tvr(tsi_data, callback); }
};