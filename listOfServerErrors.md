# ~~fix attempt it to screen for host === '35.223.58.26' and if true respond with 404 instead of forwarding~~

# Solution: whitelist incoming requests that match `redpointnotebooks` in the host, 404 the rest

0|proxyServer | { Error: Hostname/IP doesn't match certificate's altnames: "IP: 35.223.58.26 is not in the cert's list: "
0|proxyServer | at Object.checkServerIdentity (tls.js:223:17)
0|proxyServer | at TLSSocket.<anonymous> (\_tls*wrap.js:1111:29)
0|proxyServer | at emitNone (events.js:106:13)
0|proxyServer | at TLSSocket.emit (events.js:208:7)
0|proxyServer | at TLSSocket.\_finishInit (\_tls_wrap.js:639:8)
0|proxyServer | at TLSWrap.ssl.onhandshakedone (\_tls_wrap.js:469:38)
0|proxyServer | reason: 'IP: 35.223.58.26 is not in the cert\'s list: ',
0|proxyServer | host: '35.223.58.26',
0|proxyServer | cert:
0|proxyServer | { subject: { CN: '*.redpointnotebooks.com' },
0|proxyServer | issuer:
0|proxyServer | { C: 'US',
0|proxyServer | O: 'Let\'s Encrypt',
0|proxyServer | CN: 'Let\'s Encrypt Authority X3' },
0|proxyServer | subjectaltname: 'DNS:\_.redpointnotebooks.com, DNS:redpointnotebooks.com',
0|proxyServer | infoAccess: { 'OCSP - URI': [Array], 'CA Issuers - URI': [Array] },
0|proxyServer | modulus: 'AD1B416266E3292332DE581FA917236C8A7894E4357E21706D2127078A20DE5F71518F8A387A89BDFE75E25FA0BEE49B88EB344180FD86E6B76E80BCAD946B09B2DD63CA5CE19B653DAB0F07F48F80CE03A6CA42E31023993AD5AA499D15A069C09D0368C4CC7C9000B83D35F65D1349BC802C31CE451C800DC99D551B92B827E1B43DE6DCF6A569AD3784C2C1115C4F1C99B5D74E898D1F862CF62BA1F9FCA06C86CF8A0C8E3802A739875FCF35545955A81040A6F1CF8A8C9198AA04B140899767B39FE9C4F25B8FDD7456121E9D662F54D47ED3D91E91209A288A72D86E4096AAB792E4B68F26DA99FF6DE64551BD1E5D13103E0BC875DC0AA8F80EF1D9E7',
0|proxyServer | exponent: '0x10001',
0|proxyServer | valid_from: 'Dec 9 15:24:58 2019 GMT',
0|proxyServer | valid_to: 'Mar 8 15:24:58 2020 GMT',
0|proxyServer | fingerprint: 'D5:E2:2F:0A:F8:79:83:CF:F5:76:50:C2:71:C6:E6:E3:3F:B1:A8:CF',
0|proxyServer | ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
0|proxyServer | serialNumber: '037F9847F4C49EE7FAF0B7BE6E01991109F5',
0|proxyServer | raw: <Buffer 30 82 05 7e 30 82 04 66 a0 03 02 01 02 02 12 03 7f 98 47 f4 c4 9e e7 fa f0 b7 be 6e 01 99 11 09 f5 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0b 05 00 30 4a ... > } }

---

# fix attempt is to conditionally check that session exists before setting property on it

https://stackoverflow.com/questions/40182121/error-getaddrinfo-eai-again
https://github.com/microsoft/botframework-sdk/issues/3788

0|proxyServer | TypeError: Cannot set property 'notebookId' of undefined
0|proxyServer | at IncomingMessage.req.on (/home/reverse-proxy/helpers.js:36:45)
0|proxyServer | at emitNone (events.js:106:13)
0|proxyServer | at IncomingMessage.emit (events.js:208:7)
0|proxyServer | at endReadableNT (\_stream_readable.js:1064:12)
0|proxyServer | at \_combinedTickCallback (internal/process/next_tick.js:138:11)
0|proxyServer | at process.\_tickCallback (internal/process/next_tick.js:180:9)

---

# DNS error

# looks like fix for this is to screen out `undefined` hosts before forwarding to https

# maybe screen out all hosts that don't match our /._redpointnotebooks_/ pattern

{ Error: getaddrinfo EAI_AGAIN undefined:443
0|proxySer | at Object.\_errnoException (util.js:1022:11)
0|proxySer | at errnoException (dns.js:55:15)
0|proxySer | at GetAddrInfoReqWrap.onlookup [as oncomplete](dns.js:92:26)
0|proxySer | code: 'EAI_AGAIN',
0|proxySer | errno: 'EAI_AGAIN',
0|proxySer | syscall: 'getaddrinfo',
0|proxySer | hostname: 'undefined',
0|proxySer | host: 'undefined',
0|proxySer | port: 443 }

---

SyntaxError: Unexpected token p in JSON at position 0
0|proxySer | at JSON.parse (<anonymous>)
0|proxySer | at IncomingMessage.req.on (/home/reverse-proxy/helpers.js:304:30)
0|proxySer | at emitNone (events.js:106:13)
0|proxySer | at IncomingMessage.emit (events.js:208:7)
0|proxySer | at endReadableNT (\_stream_readable.js:1064:12)
0|proxySer | at \_combinedTickCallback (internal/process/next_tick.js:138:11)
0|proxySer | at process.\_tickCallback (internal/process/next_tick.js:180:9)

---

0|proxySer | ReferenceError: request is not defined
0|proxySer | at IncomingMessage.req.on (/home/reverse-proxy/helpers.js:304:25)
0|proxySer | at emitNone (events.js:106:13)
0|proxySer | at IncomingMessage.emit (events.js:208:7)
0|proxySer | at endReadableNT (\_stream_readable.js:1064:12)
0|proxySer | at \_combinedTickCallback (internal/process/next_tick.js:138:11)
0|proxySer | at process.\_tickCallback (internal/process/next_tick.js:180:9)

---

0|proxySer | TypeError: req.getHeader is not a function
0|proxySer | at IncomingMessage.req.on (/home/reverse-proxy/helpers.js:304:29)
0|proxySer | at emitNone (events.js:106:13)
0|proxySer | at IncomingMessage.emit (events.js:208:7)
0|proxySer | at endReadableNT (\_stream_readable.js:1064:12)
0|proxySer | at \_combinedTickCallback (internal/process/next_tick.js:138:11)
0|proxySer | at process.\_tickCallback (internal/process/next_tick.js:180:9)

---

# This is the IP address of a university in China -- did someone use our notebook to try to access this site?

## Looks like this is an outgoing connection request that was refused?

{ Error: connect ECONNREFUSED 219.218.99.175:443
0|proxySer | at Object.\_errnoException (util.js:1022:11)
0|proxySer | at \_exceptionWithHostPort (util.js:1044:20)
0|proxySer | at TCPConnectWrap.afterConnect [as oncomplete](net.js:1198:14)
0|proxySer | code: 'ECONNREFUSED',
0|proxySer | errno: 'ECONNREFUSED',
0|proxySer | syscall: 'connect',
0|proxySer | address: '219.218.99.175',
0|proxySer | port: 443 }

---

0|proxySer | { Error: socket hang up
0|proxySer | at TLSSocket.onHangUp (\_tls_wrap.js:1137:19)
0|proxySer | at Object.onceWrapper (events.js:313:30)
0|proxySer | at emitNone (events.js:111:20)
0|proxySer | at TLSSocket.emit (events.js:208:7)
0|proxySer | at endReadableNT (\_stream_readable.js:1064:12)
0|proxySer | at \_combinedTickCallback (internal/process/next_tick.js:138:11)
0|proxySer | at process.\_tickCallback (internal/process/next_tick.js:180:9)
0|proxySer | code: 'ECONNRESET',
0|proxySer | path: null,
0|proxySer | host: '35.223.58.26',
0|proxySer | port: '80',
0|proxySer | localAddress: undefined }

---

{ Error: connect ECONNREFUSED 219.218.99.175:443
0|proxySer | at Object.\_errnoException (util.js:1022:11)
0|proxySer | at \_exceptionWithHostPort (util.js:1044:20)
0|proxySer | at TCPConnectWrap.afterConnect [as oncomplete](net.js:1198:14)
0|proxySer | code: 'ECONNREFUSED',
0|proxySer | errno: 'ECONNREFUSED',
0|proxySer | syscall: 'connect',
0|proxySer | address: '219.218.99.175',
0|proxySer | port: 443 }

---

{ Error: getaddrinfo EAI_AGAIN undefined:443
0|proxySer | at Object.\_errnoException (util.js:1022:11)
0|proxySer | at errnoException (dns.js:55:15)
0|proxySer | at GetAddrInfoReqWrap.onlookup [as oncomplete](dns.js:92:26)
0|proxySer | code: 'EAI_AGAIN',
0|proxySer | errno: 'EAI_AGAIN',
0|proxySer | syscall: 'getaddrinfo',
0|proxySer | hostname: 'undefined',
0|proxySer | host: 'undefined',
0|proxySer | port: 443 }
