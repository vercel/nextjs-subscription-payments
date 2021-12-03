export const reduce = (desc) => {
  var sdp = desc.sdp;
  if (sdp !== undefined) {
    var lines = sdp.split('\r\n');
    lines = lines.filter(function (line) {
      return (
        (line.indexOf('a=candidate:') === 0 &&
          line.indexOf('typ relay') !== -1 &&
          line.charAt(14) === '1') ||
        line.indexOf('a=ice-ufrag:') === 0 ||
        line.indexOf('a=ice-pwd:') === 0 ||
        line.indexOf('a=fingerprint:') === 0
      );
    });
    lines = lines.sort().reverse();
    // why is chrome reporting more than one candidate?
    // pick last candidate
    //lines = lines.slice(0, 3).concat(lines[4]);
    var firstcand = true;
    var comp = lines.map(function (line) {
      switch (line.split(':')[0]) {
        case 'a=fingerprint':
          var hex = line
            .substr(22)
            .split(':')
            .map(function (h) {
              return parseInt(h, 16);
            });
          // b64 is slightly more concise than colon-hex
          return btoa(String.fromCharCode.apply(String, hex));
        case 'a=ice-pwd':
          return line.substr(10); // already b64
        case 'a=ice-ufrag':
          return line.substr(12); // already b64
        case 'a=candidate':
          var parts = line.substr(12).split(' ');
          var ip = parts[4].split('.').reduce(function (prev, cur) {
            return (prev << 8) + parseInt(cur, 10);
          });
          // take ip/port from candidate, encode
          // foundation and priority are not required
          // can I have sprintf("%4c%4c%4c%2c") please? pike rocks
          // since chrome (for whatever reason) generates two candidates with the same foundation, ip and different port
          // (possibly the reason for this is multiple local interfaces but still...)
          if (firstcand) {
            firstcand = false;
            return [ip, parseInt(parts[5])]
              .map(function (a) {
                return a.toString(32);
              })
              .join(',');
          } else {
            return [parseInt(parts[5])]
              .map(function (a) {
                return a.toString(32);
              })
              .join(',');
          }
      }
    });
    return [desc.type === 'offer' ? 'O' : 'A'].concat(comp).join(',');
  }
};

export const expand = (str) => {
  var comp = str.split(',');
  var sdp = [
    'v=0',
    'o=- 5498186869896684180 2 IN IP4 127.0.0.1',
    's=-',
    't=0 0',
    'a=msid-semantic: WMS',
    'm=application 9 DTLS/SCTP 5000',
    'c=IN IP4 0.0.0.0',
    'a=mid:data',
    'a=sctpmap:5000 webrtc-datachannel 1024'
  ];
  if (comp[0] === 'A') {
    sdp.push('a=setup:active');
  } else {
    sdp.push('a=setup:actpass');
  }
  sdp.push('a=ice-ufrag:' + comp[1]);
  sdp.push('a=ice-pwd:' + comp[2]);
  sdp.push(
    'a=fingerprint:sha-256 ' +
      atob(comp[3])
        .split('')
        .map(function (c) {
          var d = c.charCodeAt(0);
          var e = c.charCodeAt(0).toString(16).toUpperCase();
          if (d < 16) e = '0' + e;
          return e;
        })
        .join(':')
  );
  var candparts;
  candparts = comp.splice(4, 2).map(function (c) {
    return parseInt(c, 32);
  });
  var ip = [
    (candparts[0] >> 24) & 0xff,
    (candparts[0] >> 16) & 0xff,
    (candparts[0] >> 8) & 0xff,
    candparts[0] & 0xff
  ].join('.');
  var cand = [
    'a=candidate:0', // foundation 0
    '1',
    'udp',
    '1', // priority 1
    ip,
    candparts[1],
    'typ host' // well, not a host cand but...
  ];
  sdp.push(cand.join(' '));
  // parse subsequent candidates
  var prio = 2;
  for (var i = 4; i < comp.length; i++) {
    cand = [
      'a=candidate:0',
      '1',
      'udp',
      prio++, // increase priority
      ip, // ip stays the same
      parseInt(comp[i], 32), // port changes
      'typ host' // well, not a host cand but...
    ];
    sdp.push(cand.join(' '));
  }
  return {
    type: comp[0] === 'O' ? 'offer' : 'answer',
    sdp: sdp.join('\r\n') + '\r\n'
  };
};
