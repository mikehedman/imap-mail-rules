imap-mail-rules
===============

A nodejs based rules engine for processing incoming emails.  This tool fills in when an email server does not provide for exceptions to rules, for example: delete all mails that have a subject line which contains the text "Nigerian jackpot", but do NOT delete it if it also contains the word "genuine".

NOTE: This is not intended to be an "out of the box" product.  Users MUST put the proper credentials either in config.js, or a copy of that file named custom_config.js.  Users will also have to supply their own filtering rules.

Special thanks to https://github.com/mscdex/node-imap for doing all the hard work :)

TODO:
 - Would like to build out a unit test for the listener class
 - write up a how-to
 - handle destination mailbox returned from checker
 - Gracefully handle connection interruptions
 - at startup, clean up any messages in the inbox that meet the filter
