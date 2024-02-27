import {ibmdb} from "ibm_db"

let connStr = "DATABASE=SYSSOP;HOSTNAME=192.168.1.28;UID=db2inst1;PWD=H0l41324%;PORT=25000;PROTOCOL=TCPIP"

ibmdb.open(connStr,
  function(err,conn) {
    if (err) return console.log(err);
    conn.query('select tabname, tabschema, tbspace from syscat.tables WHERE tabschema = TECNICO',
      function (err, rows) {
        if (err) console.log(err);
        else
        { console.log(rows);
          //loop through the rows from the resultset
          console.log('EStoy aqui prros');
         }
         conn.close(function () {
           console.log('done');
         });
      });
  });