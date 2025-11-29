import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

function MemberCheckIn() {
  const [scannerResult, setScannerResult] = useState<string>(null)
  useEffect(() => {
    const scanner=new Html5QrcodeScanner("reader", 
    { 
      fps: 10, 
      qrbox: { 
        width: 250, 
        height: 250 
      } 
    }, 
  false)
  scanner.render(success, error)

  function success(result:any){
    console.log(result)
    alert(result)
    setTimeout(() => {
      scanner.clear()
    }, 1000);
    setScannerResult(result)
  }
  function error(err:any){
    console.warn(err)
  }
  }, [])
  

  return (
    <div className="App">
      <h1>QR code scanning</h1>
      <div id="reader" className="w-44"></div>
      {scannerResult && <h2>Scanned Code: {scannerResult}</h2>}
    </div>
  )
}

export default MemberCheckIn;